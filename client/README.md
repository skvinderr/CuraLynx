# Hack-W-Up Hackathon - Client

A modern React + TypeScript + Vite application for the Hack-W-Up Hackathon project.

## Project Structure

```
src/
├── components/                  # React components
│   ├── common/                 # Shared/reusable components (Button, Card, etc.)
│   ├── layout/                 # Layout components (Header, Footer, Sidebar)
│   ├── pages/                  # Page-level wrapper components
│   └── ui/                     # Base UI components
│       └── interactive-grid-pattern/  # Grid pattern component
├── pages/                       # Page/route components
├── hooks/                       # Custom React hooks
├── utils/                       # Utility functions and helpers
│   └── index.ts               # Main utilities (cn function, etc.)
├── constants/                   # Application constants
│   └── index.ts               # Constant definitions
├── types/                       # TypeScript type definitions
│   └── index.ts               # Type exports
├── assets/                      # Static assets (images, fonts)
│   └── react.svg
├── App.tsx                      # Root component
├── App.css                      # App styles
├── main.tsx                     # Application entry point
└── index.css                    # Global styles
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** - Type-safe component variants
- **clsx & tailwind-merge** - Utility helpers

## ESLint Configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
