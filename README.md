# dossier-astro-sqlite-app

[![Node CI](https://github.com/dossierhq/dossier-astro-sqlite-app/actions/workflows/node.js.yml/badge.svg)](https://github.com/dossierhq/dossier-astro-sqlite-app/actions/workflows/node.js.yml)

This is a template for an app using [Dossier](https://dossierhq.dev/), [Astro](https://astro.build/)
and [SQLite](https://www.sqlite.org/).

## Getting started

- `npm init using dossierhq/dossier-astro-sqlite-app my-project`
- `cd my-project`
- `git init && git add . && git commit -m '🚀 Created project 🚀'`
- `npm install`
- `npm run build`
- `npm start`

You should now have a working app running at http://localhost:4321. To access the Dossier web interface open http://localhost:4321/dossier/content in your browser. Try to add an entity type to the schema and create some entities.

The home page fetches some published entities and displays their names in a list.

The database is a SQLite database, stored in `database/dossier.sqlite`.

A Typescript file is generated in `src/generated/SchemaTypes.ts` based on the Dossier schema whenever you run `npm run build` (or if you explicitly run `npm run schema-types:generate`).

## Auth

There is no authentication in this example. However, there are two different users used:

- In development mode (`npm start`), the `editor` principal is used (specified in `DOSSIER_PRINCIPAL_ID` in `.env.development`)
- In production mode (`npm run build && npm run start:production`), the `reader` principal is used (specified in `DOSSIER_PRINCIPAL_ID` in `.env`). The `reader` principal can't access the admin API.

The Dossier web interface is disabled in production mode.

**N.B.** Supporting multiple users and real authentication is left as an exercise.
