# 🌗 Theme Management

This feature handles the visual identity of the portfolio across different lighting conditions.

## Technologies

- `next-themes` for theme persistence and system settings detection.
- **Tailwind CSS 4** for styling variables.
- **Framer Motion** for transition animations.

## Core Capabilities

1. **Toggle**: Manual switch between Dark and Light modes.
2. **Persistence**: Remembers user preference in `localStorage`.
3. **Animations**: Smooth transitions including background shifts (Aurora/Blob) and icon morphing.

## Key Files

- `src/features/ThemeToggle/`
- `src/shared/ui/ThemeToggle/`
- `src/shared/ui/animated-theme-toggler.tsx`
