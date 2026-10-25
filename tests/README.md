# Tests

Unit / component tests live **outside** `src/`, same idea as the backend `tests/` tree.
Browser E2E stays in `cypress/`.

```
tests/
└── unit/                 # Vitest — mirrors src/ features & shared
    ├── features/
    └── shared/
cypress/                  # Cypress E2E (unchanged)
```

## Rules

- Do **not** colocate `*.test.ts(x)` next to production code under `src/`.
- Import production code via `@/` aliases.
- Keep suites fast and deterministic (mock network).

## Commands

```bash
bun run test          # vitest watch
bun run test:ci       # vitest --run
bun run test:coverage
```
