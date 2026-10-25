# Folder structure

High-level folders (what they mean):

- `src/app` - application bootstrap, global providers, routes.
- `src/entities` - domain models, api schemas, mappers.
- `src/features` - feature verticals with `ui/`, `model/`, `api/` subfolders.
- `src/shared` - components, ui primitives, hooks, api client, styles.
- `widgets` - small composite components used across pages.
- `tests/unit` - Vitest unit/component suites (mirrors `src/`; never colocate under `src/`).
- `cypress` - browser E2E.

Keep folders small and dedicated. If a folder grows beyond 200 lines per file, consider splitting.
