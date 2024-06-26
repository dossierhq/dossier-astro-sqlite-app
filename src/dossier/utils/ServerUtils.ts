import { createBetterSqlite3Adapter } from '@dossierhq/better-sqlite3';
import {
  createConsoleLogger,
  notOk,
  ok,
  type ErrorType,
  type Logger,
  type PromiseResult,
  type Result,
} from '@dossierhq/core';
import {
  BackgroundEntityProcessorPlugin,
  createServer,
  type Server,
  type SessionContext,
} from '@dossierhq/server';
import BetterSqlite, { type Database } from 'better-sqlite3';
import { mkdir } from 'node:fs/promises';
import {
  getPrincipalConfig,
  type PrincipalConfig,
  type PrincipalIdentifier,
} from '../config/PrincipalConfig.ts';

const logger = createConsoleLogger(console);

let serverPromise: Promise<
  Result<Server, typeof ErrorType.BadRequest | typeof ErrorType.Generic>
> | null = null;

export async function getServer(): Promise<
  Result<Server, typeof ErrorType.BadRequest | typeof ErrorType.Generic>
> {
  if (!serverPromise) {
    serverPromise = (async () => {
      const databaseAdapterResult = await createDatabaseAdapter(logger);
      if (databaseAdapterResult.isError()) return databaseAdapterResult;

      const serverResult = await createServer({ databaseAdapter: databaseAdapterResult.value });
      if (serverResult.isError()) return serverResult;
      const server = serverResult.value;

      const processorPlugin = new BackgroundEntityProcessorPlugin(server, logger);
      server.addPlugin(processorPlugin);
      processorPlugin.start();

      return ok(server);
    })();
  }

  return serverPromise;
}

async function createDatabaseAdapter(logger: Logger) {
  const context = { logger };
  let database: Database;
  try {
    await mkdir('database', { recursive: true });

    database = new BetterSqlite('database/dossier.sqlite');
  } catch (error) {
    return notOk.GenericUnexpectedException(context, error);
  }

  const databaseAdapterResult = await createBetterSqlite3Adapter(context, database, {
    migrate: true,
    fts: { version: 'fts5' },
    journalMode: 'wal',
  });
  return databaseAdapterResult;
}

export async function getAuthenticatedDossierClient(principalId?: PrincipalIdentifier) {
  const principalConfig = getPrincipalConfig(principalId ?? import.meta.env.DOSSIER_PRINCIPAL_ID);
  if (!principalConfig.enableFull) {
    return notOk.NotAuthorized('Full access is disabled for this principal');
  }

  const result = await createSessionForPrincipal(principalConfig);
  if (result.isError()) return result;
  const { server, sessionContext } = result.value;

  return ok(server.createDossierClient(sessionContext));
}

export async function getAuthenticatedPublishedClient() {
  const principalConfig = getPrincipalConfig(import.meta.env.DOSSIER_PRINCIPAL_ID);

  const result = await createSessionForPrincipal(principalConfig);
  if (result.isError()) return result;
  const { server, sessionContext } = result.value;

  return ok(server.createPublishedDossierClient(sessionContext));
}

async function createSessionForPrincipal(
  principalConfig: PrincipalConfig,
): PromiseResult<
  { server: Server; sessionContext: SessionContext },
  typeof ErrorType.BadRequest | typeof ErrorType.Generic
> {
  const serverResult = await getServer();
  if (serverResult.isError()) return serverResult;
  const server = serverResult.value;

  const sessionResult = await server.createSession({
    provider: principalConfig.provider,
    identifier: principalConfig.identifier,
    readonly: principalConfig.readonly,
  });
  if (sessionResult.isError()) return sessionResult;
  const sessionContext = sessionResult.value.context;

  return ok({ server, sessionContext });
}
