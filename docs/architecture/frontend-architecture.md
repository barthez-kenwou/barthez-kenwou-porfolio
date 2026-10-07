# 🏛 Frontend Architecture: Feature-Sliced Design (FSD)

This project is built using the **Feature-Sliced Design** (FSD) architectural methodology. It provides a clear structure for scaling the codebase and managing dependencies.

## The Hierarchy of Layers

The core rule of FSD: **A lower layer cannot import anything from a higher layer.**

### 1. `app/`

- **Goal**: Global configuration, providers, and bootstrap.
- **Content**: `App.tsx`, global styles (`index.css`), routing setup, internationalization initialization.

### 2. `pages/`

- **Goal**: Compose widgets and features into full application pages.
- **Content**: Layouts and page containers.

### 3. `widgets/`

- **Goal**: Self-contained UI blocks that combine features and entities.
- **Content**: `Navbar`, `Footer`, `Sidebar`.

### 4. `features/`

- **Goal**: User-facing scenarios that carry business value.
- **Content**: `ThemeToggle`, `LanguageSwitcher`, `ContactForm`.

### 5. `entities/`

- **Goal**: Business domain models and logic.
- **Content**: `Article` (Blog), `Project`, `User`, `Experience`.

### 6. `shared/`

- **Goal**: Infrastructure code and reusable UI primitives.
- **Content**: Base UI components (Button, Input), utility functions, custom hooks, API clients.

## Key Principles

- **Unidirectional Data Flow**: Higher layers depend on lower layers.
- **Public API**: Every entry point to a slice is defined via an `index.ts`.
- **Low Coupling**: Features should be independent and not import each other.
- **Tech Stack**: Powered by **Vite (Rolldown)**, **React 18**, and **Tailwind CSS 4**.
