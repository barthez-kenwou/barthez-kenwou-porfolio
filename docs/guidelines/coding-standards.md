# 🎨 Coding Standards & Best Practices

To maintain the high quality and performance of the portfolio, please adhere to these standards.

## 🏗 Architecture (FSD)

- Respect the **Feature-Sliced Design** layers.
- Cross-importing between slices of the same layer is strictly forbidden (use the `shared` layer or promote to a `widget`).
- Every slice must have a clear `index.ts` public API.

## ⌨️ TypeScript

- **Strict Mode**: Mandatory. No `any` unless absolutely necessary (and documented).
- **Interfaces vs Types**: Prefer `interface` for entity shapes and `type` for unions/compositions.
- **Naming**: Use descriptive names. `isThemeDark` instead of `flag`.

## 💅 Styling (Tailwind CSS 4)

- **Utility First**: Avoid writing custom CSS in `.css` files unless implementing complex animations (like Aurora or Blobs).
- **Consistency**: Use the design system tokens for spacing, colors, and shadows.
- **Responsive**: Always design mobile-first using `md:`, `lg:`, etc.

## 🚀 Performance

- **Image Optimization**: Use the `Image` component which handles lazy loading and optimized formats.
- **Bundle Size**: Monitor third-party imports. Prefer lightweight alternatives (e.g., `lucide-react` with tree-shaking).
- **Animations**: Use `framer-motion` strategically to avoid high CPU usage.

## 🛠 Workflow

- Run `bun run validate` before pushing to ensure linting, types, and tests pass.
- Follow **Conventional Commits** for clear version history.
