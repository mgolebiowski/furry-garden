# FurryGarden: Technical Overview

This document provides a technical explanation of the FurryGarden web application, detailing its architecture, technologies, and key implementation features.

---

### 1. Core Technologies

The project is built on a modern, lightweight stack designed for performance and developer experience:

- **Framework/Compiler:** **Svelte 5** is used for creating reactive and efficient user interfaces.
- **Build Tool:** **Vite** provides a fast development server with Hot Module Replacement (HMR) and an optimized build process.
- **Language:** **TypeScript** is used throughout the project for static typing, improving code quality and maintainability.
- **Styling:** **Tailwind CSS 4** is utilized for a utility-first CSS workflow, enabling rapid and consistent styling. It is configured with a JIT compiler for optimal performance.
- **Fuzzy Search:** **Fuse.js** is integrated for a robust and efficient fuzzy search capability.
- **Internationalization (i18n):** **`svelte-i18n`** is used to provide localization for English and Polish languages.

---

### 2. Project Structure

The repository is organized to separate concerns and maintain a clean codebase:

- **`public/`**: Contains static assets.
  - **`public/data/`**: Stores the raw plant data in `safe.csv` and `toxic.csv` files. These are fetched by the application at runtime.
- **`src/`**: The main application source code.
  - **`components/`**: Reusable Svelte components, organized by feature (e.g., `plants`, `ui`).
  - **`locales/`**: Contains `en.json` and `pl.json` files for i18n.
  - **`services/`**: Houses the core application logic.
    - `plantData.ts`: Responsible for fetching, parsing, and processing the plant data from the CSV files. It initializes and configures the `Fuse.js` search engine.
  - **`stores/`**: Svelte stores for managing global application state, such as the `theme.ts` store for light/dark mode.
  - **`types/`**: TypeScript type definitions, like the `Plant` interface.
  - **`App.svelte`**: The main root component of the application.
  - **`main.ts`**: The entry point for the Vite application.

---

### 3. Key Features & Implementation

#### Data Handling & Search

- **Data Source:** Plant information is stored in two CSV files (`safe.csv` and `toxic.csv`).
- **Data Loading:** As defined in `src/services/plantData.ts`, the application fetches these CSV files on component mount.
- **Parsing:** A custom CSV parser within `plantData.ts` processes the text data into an array of `Plant` objects.
- **Fuzzy Search:** A `Fuse.js` instance is initialized with the entire plant dataset. It is configured to search against the `commonName`, `additionalNames`, `latinName`, and `polishName` fields with a `threshold` of `0.3` to allow for some typos and partial matches. The search results are updated reactively as the user types.

#### Internationalization (i18n)

- The `svelte-i18n` library is configured in `src/i18n.ts`.
- It automatically detects the user's browser language preference (`en` or `pl`) and sets it as the initial locale, with a fallback to `en`.
- A `LanguageSelector.svelte` component allows the user to manually toggle between English and Polish.

#### Theming (Light/Dark Mode)

- The application supports both light and dark themes, managed via Tailwind's `dark: 'class'` strategy.
- The theme state is controlled by a writable Svelte store in `src/stores/theme.ts`.
- The store initializes its value from the user's `localStorage` or falls back to their system's `prefers-color-scheme` media query.
- The theme can be toggled manually, and the choice is persisted in `localStorage`.

---

### 4. Build & Deployment

- **Build Process:** The `vite build` command, defined in `package.json`, bundles the application for production. It transpiles the Svelte and TypeScript code, processes styles with Tailwind CSS, and outputs optimized static files to the `dist/` directory.
- **Base Path:** The `vite.config.ts` file sets `base: '/furry-garden/'`, which is essential for correct asset pathing when deployed to a subdirectory on GitHub Pages.
- **Continuous Deployment (CI/CD):** A GitHub Actions workflow defined in `.github/workflows/gh_pages.yml` automates the deployment process. On every push to the `main` branch, the workflow:
  1. Checks out the code.
  2. Sets up Node.js.
  3. Installs dependencies.
  4. Builds the project using `npm run build`.
  5. Deploys the contents of the `dist` directory to the `gh-pages` branch, making it live on GitHub Pages.

---

### 5. Architectural Rationale

- **Svelte over SvelteKit:** As noted in the `README.md`, this template was chosen to provide a minimal, Vite-centric starting point without the routing and other framework-level features inherent to SvelteKit. This allows for greater control and less overhead for a single-purpose application.
- **TypeScript Configuration:** The project uses triple-slash references (`/// <reference ... />`) for global type definitions (like `vite/client`) to avoid shutting out other ambient types, which can happen when using `compilerOptions.types`.
- **Static Data Handling:** The decision to fetch static CSVs at runtime (as opposed to converting them to JSON at build time) simplifies the build process. Since the dataset is not excessively large, the performance impact is minimal, and it allows the data to be updated without requiring a full application rebuild.
