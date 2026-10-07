# Features

User-facing capabilities. In FSD, a feature is an isolated user scenario that may use **entities** and **shared**, but must not import other features or pages.

## Documented features

| Feature                        | Doc                                        |
| :----------------------------- | :----------------------------------------- |
| Theme (dark / light)           | [theme-switching.md](./theme-switching.md) |
| Internationalization (FR / EN) | [i18n.md](./i18n.md)                       |
| Contact system                 | [contact-system.md](./contact-system.md)   |

## Also in the product (see source / entities)

These are implemented as pages + entities rather than dedicated feature docs:

- Blog (Markdown / Velite / Shiki) - [../entities/blog.md](../entities/blog.md)
- Projects portfolio - [../entities/project.md](../entities/project.md)
- Skills - [../entities/skill.md](../entities/skill.md)
- CV / PDF export, services, testimonials - under `src/pages/public/` and `src/entities/`

## Rules

1. **Isolation** - keep feature code self-contained.
2. **Coupling** - only depend on entities and shared.
3. **Public API** - export only through the feature `index.ts` / public entry.
