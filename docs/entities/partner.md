# Partner (collaborations / logos)

Organizations that trusted a collaboration. Logo strip on the homepage (“Ils m’ont fait confiance”).

## Fields

| Field                             | Type             | Notes                                 |
| --------------------------------- | ---------------- | ------------------------------------- |
| `id`                              | string \| number |                                       |
| `name`                            | string           | Organization name                     |
| `logoUrl`                         | string           | Required for public display           |
| `websiteUrl`                      | string?          | Optional outbound link                |
| `descriptionFr` / `descriptionEn` | string?          | Short context                         |
| `relationFr` / `relationEn`       | string?          | Client / Employer / Partner…          |
| `isPublished`                     | boolean?         | Default true; false hides from public |
| `sortOrder`                       | number?          | CMS reorder                           |

## REST API (implemented)

Backend module: `backend-barthez-portfolio/src/modules/partners`  
Base path: `/api/v1/partners`

| Method   | Path                   | Auth                 | Notes                                                                              |
| -------- | ---------------------- | -------------------- | ---------------------------------------------------------------------------------- |
| `GET`    | `/partners`            | public               | Query: `page`, `limit`, `isPublished`, `includeUnpublished` — published by default |
| `GET`    | `/partners/:partnerId` | public               |                                                                                    |
| `POST`   | `/partners`            | `partner:create`     | Body = create payload                                                              |
| `PUT`    | `/partners/:partnerId` | `partner:update:own` | Partial update (incl. `sortOrder`, `isPublished`)                                  |
| `DELETE` | `/partners/:partnerId` | `partner:delete:own` | Soft-delete                                                                        |

Envelope list: `{ items, totalItems, totalPages, currentPage }` inside standard `{ success, data, … }`.

## Frontend

- Entity: `src/entities/partners/`
- CMS: `src/pages/app/Admin/PartnersPage/` → `/barthez-admin/partners`
- Public: `TrustedBySection` on homepage (between Why Choose Me and Testimonials)
