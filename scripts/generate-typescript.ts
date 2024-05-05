#!/usr/bin/env -S npx tsx
import {
  SchemaWithMigrations,
  createConsoleLogger,
  type DossierClient,
  type Logger,
} from '@dossierhq/core';
import { generateTypescriptForSchema } from '@dossierhq/typescript-generator';
import { mkdir, writeFile } from 'node:fs/promises';
import { format, resolveConfig } from 'prettier';
import { getAuthenticatedDossierClient, getServer } from '../src/dossier/utils/ServerUtils.js';

async function generateTypes(logger: Logger, schema: SchemaWithMigrations, filename: string) {
  const publishedSchema = schema.toPublishedSchema();
  const sourceCode = generateTypescriptForSchema({ schema, publishedSchema });

  const prettierConfig = await resolveConfig(filename);
  const formattedSource = await format(sourceCode, {
    ...prettierConfig,
    filepath: filename,
  });

  await writeFile(filename, formattedSource);
  logger.info(`Wrote ${filename}`);
}

async function getSchema(logger: Logger, client: DossierClient) {
  const schemaResult = await client.getSchemaSpecification({ includeMigrations: true });
  let schema = new SchemaWithMigrations(schemaResult.valueOrThrow());

  if (schema.getEntityTypeCount() === 0) {
    logger.info('No entities found, adding placeholder with name "Placeholder"');
    schema = schema
      .updateAndValidate({ entityTypes: [{ name: 'Placeholder', fields: [] }] })
      .valueOrThrow();
  }

  return schema;
}

async function main() {
  const logger = createConsoleLogger(console);
  const server = (await getServer()).valueOrThrow();
  const client = (await getAuthenticatedDossierClient('editor')).valueOrThrow();
  const schema = await getSchema(logger, client);

  await mkdir('./src/generated', { recursive: true });
  await generateTypes(logger, schema, './src/generated/SchemaTypes.ts');

  await server.shutdown();
}

await main();
