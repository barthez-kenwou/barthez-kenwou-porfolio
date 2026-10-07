# API conventions

This portfolio is primarily a **static SPA**. Most “API” usage is:

- local mocks / Velite content under `src/entities/**`
- optional remote calls via `VITE_API_BASE_URL` (contact / future backend)

## Documents

| Doc                                      | Topic                                        |
| :--------------------------------------- | :------------------------------------------- |
| [conventions.md](./conventions.md)       | Naming, response shapes, client conventions  |
| [error-handling.md](./error-handling.md) | Errors, ErrorBoundary, user-facing fallbacks |

`endpoints/` is reserved for documented HTTP routes when a backend is wired.

## Related

- Contact feature: [../features/contact-system.md](../features/contact-system.md)
- Env vars: [../../.env.example](../../.env.example)
