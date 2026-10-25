# Testing strategy

Levels:

- Unit tests: small pure functions and UI components using `vitest` + `@testing-library/react`.
- Integration tests: small flows (form submission) mocking network.
- E2E: Cypress under `cypress/` for critical browser flows.

## Layout (aligned with backend)

```
tests/unit/…     # Vitest — mirrors src/ (features/, shared/, …)
cypress/         # Browser E2E
```

Do **not** place `*.test.ts(x)` inside `src/` next to production modules.

Rules:

- Tests must be fast and deterministic. Use `msw` or similar to mock network in unit/integration tests.
- Import app code via `@/` aliases from `tests/`.
- CI should run `vitest --run` (`bun run test:ci`) and publish coverage if needed.
