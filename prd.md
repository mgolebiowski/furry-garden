## **Product Requirements Document: FurryGarden 🪴🐾**

Version: 1.0  
Date: May 21, 2025

### ---

**1\. Introduction**

FurryGarden is a frontend web application designed for home gardeners who own cats. It aims to provide a quick and easy way to identify plants that are safe or toxic to cats. Users can search a database of plants and view details to ensure their home and garden environment is pet-friendly.

### ---

**2\. Goals**

* **Primary Goal:** Enable users to easily search and identify safe and toxic plants for cats.  
* **Secondary Goal:** Provide a user-friendly interface that is accessible and pleasant to use.  
* **Business Goal:** Help cat owners create a safer environment for their pets, promoting responsible pet ownership.

### ---

**3\. Target Audience**

* Cat owners who are also home gardeners or plant enthusiasts.  
* Individuals looking to buy plants for a home with cats.  
* Veterinary staff or pet store employees as a quick reference (though not a primary diagnostic tool).

### ---

**4\. Functional Requirements**

#### **4.1. Plant Data Display**

* **FD-001:** The application must display lists of plants categorized as "Safe" and "Toxic".  
* **FD-002:** For each plant, the application must display the following information:  
  * Common Name  
  * Additional Names (if available)  
  * Latin Name  
  * Family  
  * Polish Name  
* **FD-003:** Clearly indicate whether a plant is safe or toxic.

#### **4.2. Search Functionality**

* **FD-004:** The application must feature a prominent search box.  
* **FD-005:** Users must be able to search for plants by:  
  * English Common Name  
  * Polish Name  
  * Latin Name  
* **FD-006:** The search must implement fuzzy search capabilities to account for typos and partial matches.  
* **FD-007:** Search results should update dynamically as the user types.  
* **FD-008:** Search results should clearly distinguish between safe and toxic plants.

#### **4.3. Localization**

* **FD-009:** The application interface must support English (en) and Polish (pl).  
* **FD-010:** The application must automatically detect the user's browser language preference and display the appropriate localization.  
* **FD-011:** A manual language switcher should be available for users to override the detected language.  
* **FD-012:** All UI text elements (labels, buttons, messages) must be localized.  
* **FD-013:** Plant names (common and Polish) are part of the data and will be displayed as per the data source; search should work across these localized names.

#### **4.4. Theme (Dark/Light Mode)**

* **FD-014:** The application must support a light theme and a dark theme.  
* **FD-015:** The application should ideally respect the user's operating system preference for light/dark mode.  
* **FD-016:** A manual toggle must be available for users to switch between light and dark modes.

### ---

**5\. Non-Functional Requirements**

#### **5.1. Performance**

* **NFR-001:** The application should load quickly, with initial content visible within 2 seconds on a standard broadband connection.  
* **NFR-002:** Search results should appear almost instantaneously (under 500ms) after user input stabilizes.  
* **NFR-003:** The application should be responsive and perform smoothly on modern desktop and mobile browsers.

#### **5.2. Usability**

* **NFR-004:** The interface must be intuitive and easy to navigate, even for non-technical users.  
* **NFR-005:** The design should be clean, modern, and visually appealing.  
* **NFR-006:** Important information (like toxicity status) should be highly visible.

#### **5.3. Accessibility**

* **NFR-007:** The application should aim to meet WCAG 2.1 Level AA accessibility standards. This includes keyboard navigation, sufficient color contrast, and ARIA attributes where appropriate.

#### **5.4. Maintainability & Scalability**

* **NFR-008:** Code should be well-structured, commented, and follow TypeScript best practices.  
* **NFR-009:** The application architecture should allow for easy updates to plant data and addition of new features in the future.

#### **5.5. Data Handling**

* **NFR-010:** The safe.csv and toxic.csv files, containing plant data (columns: common\_name, additional\_names, latin\_name, family, polish\_name), will be static.  
* **NFR-011:** **Decision:** The CSV data should be processed and included as part of the application build (e.g., converted to JSON or JavaScript objects). This ensures the data is immediately available on load without runtime fetching, simplifying deployment and improving performance.  
  * *Rationale:* The dataset is relatively small and static, making build-time inclusion efficient. This avoids network latency and potential fetching errors at runtime.

### ---

**6\. Technical Specifications**

* **Frontend Framework/Compiler:** Svelte  
* **Build Tool:** Vite  
* **Styling:** Tailwind CSS  
* **Programming Language:** TypeScript  
* **Fuzzy Search Library:** A suitable JavaScript library like Fuse.js or similar.  
* **Localization Library:** A Svelte-compatible i18n library (e.g., svelte-i18n).  
* **Deployment:** Static site hosting (e.g., Vercel, Netlify, GitHub Pages).

### ---

**7\. Data Source**

* Two CSV files: safe.csv and toxic.csv.  
* **Columns:**  
  1. common\_name (Text, English)  
  2. additional\_names (Text, English, comma-separated if multiple, can be empty)  
  3. latin\_name (Text, Scientific)  
  4. family (Text, Scientific)  
  5. polish\_name (Text, Polish)

### ---

**8\. User Interface (UI) / User Experience (UX) Sketch**

* **Main View:**  
  * Header: App Name ("FurryGarden"), Language Switcher, Dark/Light Mode Toggle.  
  * Search Bar: Prominently displayed.  
  * Content Area: Displays search results or categorized lists of plants. Plant cards show key info and a clear "Safe" ✅ / "Toxic" ☠️ indicator.  
* **Plant Details:** (Optional for v1, could be an expansion of the plant card or a modal)  
  * More detailed view if necessary, though all specified columns should fit on a card.

### ---

**9\. Future Considerations (Out of Scope for v1)**

* User accounts to save favorite plants or personal notes.  
* Image uploads for plants.  
* Integration with external plant databases or APIs for richer data.  
* Community features for users to share experiences or suggest new plants.  
* Push notifications for new plant additions or warnings.  
* Offline support (PWA capabilities).  
* More granular filtering options (e.g., by plant family, characteristics).

### ---

**10\. Open Questions**

* Are there specific icons preferred for "safe" and "toxic" indicators?  
* What is the exact format for "additional\_names" if multiple exist in the CSV (e.g., "Name1, Name2" or "Name1; Name2")? *Assumption: comma-separated as per initial description.*

---

