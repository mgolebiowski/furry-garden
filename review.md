
# Project Review: FurryGarden

This document provides a comprehensive review of the FurryGarden project, analyzing its current state against its requirements, identifying potential issues, and suggesting improvements. The review is based on the `prd.md`, `about.md`, and the provided source code.

---

### 1. Current Project State

The project is in a solid, functional state and successfully implements most of the core features outlined in the Product Requirements Document (PRD).

**What is working:**
- **Core Functionality:** The application correctly loads and displays lists of safe and toxic plants from CSV data.
- **Search:** A powerful fuzzy search is implemented using Fuse.js, allowing users to find plants by various names (Common, Latin, Polish).
- **Filtering:** Users can filter the plant list to show "All," "Safe," or "Toxic" plants.
- **Localization:** The UI successfully switches between English and Polish, with language detection from the browser as a default.
- **Responsive UI:** The application works well on both desktop and mobile, featuring a dedicated floating search/filter bar for smaller screens.
- **Theming:** The light/dark mode foundation is in place and respects system preferences by default.

---

### 2. Discrepancies & Missing Features

Some features specified in the PRD are either missing or implemented differently.

- **Missing: Manual Theme Toggle (FD-016)**
  - The `theme.ts` store is implemented, but there is no UI component (`<button>`) available for the user to manually switch between light and dark modes. This is a direct omission from the functional requirements.

- **Discrepancy: Data Handling (NFR-011)**
  - The PRD states: *"The CSV data should be processed and included as part of the application build (e.g., converted to JSON or JavaScript objects)."*
  - The current implementation in `src/services/plantData.ts` fetches the CSV files at **runtime** using the `fetch` API.
  - **Impact:** While functional, this contradicts the documented technical decision. Runtime fetching introduces a small performance cost (network latency) and a potential point of failure if the files cannot be loaded, whereas build-time inclusion would be faster and more reliable.

- **Missing: Visual Indicators for Toxicity (UI/UX Sketch)**
  - The PRD mentions using clear indicators like "Safe" ✅ / "Toxic" ☠️. The current UI uses colored text labels ("SAFE" / "TOXIC") but lacks the proposed icons, which would offer stronger visual cues.

---

### 3. Potential Bugs & Technical Issues

- **Redundant Data Directory:** The project contains two `data` directories: one at the root (`/data`) and one inside `/public` (`/public/data`). The application fetches from `/public/data`, making the root-level `data` directory redundant and potentially confusing for future maintenance.

- **Inconsistent Locale Identifiers:**
  - In `src/i18n.ts`, the Polish locale is registered with the short code: `register('pl', ...)`.
  - However, components like `PlantCard.svelte` and `LanguageSelector.svelte` check for and set the locale to the more specific `pl-PL`.
  - While `svelte-i18n` may handle this gracefully, it's an inconsistency that could lead to bugs. Using a single, consistent identifier (`pl-PL`) everywhere is recommended.

- **Brittle CSV Parsing:**
  - The custom regex-based CSV parser in `plantData.ts` is clever but may not be robust enough for all edge cases (e.g., fields containing escaped quotes `\"`). A dedicated library like `papaparse` would be a more resilient solution.

- **Missing UI for Data Fetching Errors:**
  - The `loadCSVData` function catches errors and logs them to the console, but the UI does not inform the user of the failure. The application will perpetually show the "Loading..." message, which is a poor user experience.

---

### 4. Proposed Improvements

#### **Technical Improvements**

1.  **Align Data Handling with PRD:**
    - Create a script (e.g., in the `scripts` directory) to pre-process the CSV files into JSON during a pre-build step. This script could be run manually or integrated into the `npm run build` command.
    - Modify `plantData.ts` to directly `import` the generated JSON files, eliminating runtime fetching and parsing.

2.  **Implement Theme Toggle:**
    - Create a `ThemeToggle.svelte` component that uses the `theme` store from `src/stores/theme.ts`.
    - Add this component to the header in `App.svelte` to fulfill requirement FD-016.

3.  **Refactor Project Structure:**
    - Remove the redundant `data` directory from the project root to avoid confusion.

4.  **Standardize Locale Codes:**
    - Change `register('pl', ...)` to `register('pl-PL', ...)` in `src/i18n.ts` to match its usage throughout the app.

5.  **Improve Reactive Logic in `App.svelte`:**
    - The reactive logic for filtering plants (`$: if (!isLoading && (searchQuery || activeFilter))`) is slightly imperative. It could be refactored to be more declarative and easier to read:
      ```svelte
      // In App.svelte
      $: filteredPlants = (() => {
        if (isLoading) return [];
        const searchResults = searchQuery.trim() ? searchPlants(searchQuery) : allPlants;
        return activeFilter === 'all' ? searchResults : filterPlantsBySafety(searchResults, activeFilter === 'safe');
      })();
      ```

#### **Product & UX Improvements**

1.  **Enhance Visual Cues:**
    - Add the `✅` and `☠️` icons next to the "Safe" and "Toxic" labels in `PlantCard.svelte` as suggested in the PRD.

2.  **Improve Search Experience:**
    - Highlight the matched characters or words within the search results. Fuse.js provides match indices that can be used to wrap matched text in a `<mark>` tag for styling.

3.  **Add a Descriptive App Title:**
    - Change the Polish app title in `src/locales/pl.json` from `"💐 💕 🐾"` to something more descriptive, like `"Koci Ogród"`.
    - Update the `<title>` tag in `index.html` to reflect the app's name, which is better for accessibility and SEO.

4.  **Provide User Feedback on Errors:**
    - If runtime data fetching is kept, add a state to `App.svelte` to track loading errors and display a user-friendly message (e.g., "Could not load plant data. Please try again later.") instead of an infinite loading indicator.
