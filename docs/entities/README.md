# Entities

Core domain models. They define data shapes and contracts used across pages, widgets, and features.

## Documented entities

| Entity     | Doc                              |
| :--------- | :------------------------------- |
| Project    | [project.md](./project.md)       |
| Blog       | [blog.md](./blog.md)             |
| Skill      | [skill.md](./skill.md)           |
| Experience | [experience.md](./experience.md) |

## Also present in `src/entities/`

Document as needed when the public API stabilizes:

- `services` - professional offerings
- `certifications`, `education`, `cv`, `contact`, `testimonies`, `userProfile`, `achievment`

## Rules

1. Prefer Zod schemas for runtime validation of content / mock data.
2. Export TypeScript types derived from those schemas.
3. Keep mappers in the entity slice when raw data differs from UI needs.
4. Do not import from `features/`, `widgets/`, or `pages/`.
