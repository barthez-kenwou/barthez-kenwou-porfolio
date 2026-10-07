# Project entity

The `Project` entity represents a technical delivery showcased in the portfolio.

## Source

`src/entities/projets/api/mocks/projectData.mocks.ts`  
Types: `src/entities/projets/model/project.types.ts`

## Core fields

- Identity: `id`, `titleFr/En`, `descriptionFr/En`, `fullDescriptionFr/En`
- Narrative: `problem*`, `solution*`, `challenges*`, `impact*`, `businessContext*`
- Delivery: `techStack`, `architecture`, `testing`, `metrics`
- Media cover: `images[]`, `preview`
- Meta: `category`, `status`, `complexity`, `role`, `teamSize`, `duration`, `date`
- Links: `github`, `demo`, `isFeatured`

## Case-study extensions (all optional)

Sections on the detail page render **only when data is present**:

| Field                                         | Section                                  |
| :-------------------------------------------- | :--------------------------------------- |
| `responsibilitiesFr/En`                       | Overview                                 |
| `confidential`                                | Hero badge (NDA / anonymized)            |
| `videos[]` / `videoDemo`                      | Videos (YouTube/Vimeo or `.mp4`/`.webm`) |
| `gallery[]`                                   | Gallery + lightbox                       |
| `diagrams[]`                                  | Mermaid diagrams                         |
| `scope*` / `nonGoals*`                        | Scope                                    |
| `milestones[]`                                | Timeline                                 |
| `decisions[]`                                 | Key decisions (ADR light)                |
| `security*` / `infra*`                        | Security & infrastructure                |
| `beforeAfter[]`                               | Before / After                           |
| `testimonial`                                 | Client quote                             |
| `lessons*`                                    | Lessons learned                          |
| `resources[]` / `documentation` / `caseStudy` | Public documents                         |
| `externalLinks[]`                             | Extra links                              |

## Detail page order

Hero → Overview → Problem/Solution → Videos → Tech → Gallery → Architecture/Testing → Diagrams → Scope → Timeline → Decisions → Security/Infra → Impact → Before/After → Testimonial → Lessons → Resources → Links → Other projects → CTA

## UI

Page composition: `src/pages/public/ProjectPage/projectDetails.tsx`  
Cards: `src/entities/projets/ui/`
