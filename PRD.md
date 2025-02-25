# Podcast Episode Explorer – Product Requirements Document (PRD)

## 1. Overview

### 1.1 Purpose

The Podcast Episode Explorer is a standalone, single-page web application that lets users explore podcast episodes based on a comprehensive tagging taxonomy. Each episode is pre-tagged along three dimensions:

- **Format Tags:** Indicates whether an episode is a standalone episode, part of a series, or part of a special club series.
- **Theme Tags:** One or more thematic categories (e.g., "Ancient & Classical Civilizations", "Military History & Battles", etc.).
- **Track Tags:** One or more narrative tracks (e.g., "Roman Track", "Modern Political History Track", etc.).

Each episode also includes a detailed description and a link to the podcast episode. Because the total number of episodes is under 1,000, the complete dataset is loaded at build time and all filtering is handled on the client side.

### 1.2 Data Source

The application will read all podcast episode records from a shared SQLite database maintained by an existing ingest system. The frontend project will retrieve the necessary data (for example, via a JSON export) at build time.

### 1.3 Tech Stack & Aesthetic

- **Frontend Framework:** ReactJS with NextJS  
- **Programming Languages:** JavaScript and TypeScript  
- **Styling:** TailwindCSS (loaded directly via CDN or through a build process)  
- **Interactivity:** Client-side filtering implemented in React  
- **Deployment:** The site will be statically generated and deployed to a static hosting provider such as Cloudflare Pages

The design will mirror the aesthetic of the Gitingest codebase—a minimalistic, layered design featuring subtle shadows, offset backgrounds, and large, bold filter buttons.

---

## 2. Functional Requirements

### 2.1 Data Model

Each podcast episode record includes the following fields:

- **ID:** Unique identifier  
- **Title:** Episode title  
- **Description:** Full episode description  
- **Podcast Link:** URL to the episode (opens in a new tab)  
- **Format Tag:** One value from:
  - Standalone Episodes  
  - Series Episodes  
  - Club Series  
- **Theme Tags:** One or more values (see taxonomy below)  
- **Track Tags:** One or more values (see taxonomy below)

#### Tagging Taxonomy

**Format Tags**  
- Standalone Episodes  
- Series Episodes  
- Club Series  

**Theme Tags**  
- Ancient & Classical Civilizations  
- Medieval & Renaissance Europe  
- Empire, Colonialism & Exploration  
- Modern Political History & Leadership  
- Military History & Battles  
- Cultural, Social & Intellectual History  
- Science, Technology & Economic History  
- Religious, Ideological & Philosophical History  
- Historical Mysteries, Conspiracies & Scandals  
- Regional & National Histories  

**Track Tags**  
- Roman Track  
- Medieval & Renaissance Track  
- Colonialism & Exploration Track  
- American History Track  
- Military & Battles Track  
- Modern Political History Track  
- Cultural & Social History Track  
- Science, Technology & Economic History Track  
- Religious & Ideological History Track  
- Historical Mysteries & Conspiracies Track  
- British History Track  
- Global Empires Track  
- World Wars Track  
- Ancient Civilizations Track  
- Regional Spotlight: Latin America Track  
- Regional Spotlight: Asia & the Middle East Track  
- Regional Spotlight: Europe Track  
- Regional Spotlight: Africa Track  
- Historical Figures Track  
- The RIHC Bonus Track  
- Archive Editions Track  
- Contemporary Issues Through History Track  

---

### 2.2 Filtering & Navigation

- **Filtering UI:**  
  - The page will feature large, clickable buttons for filtering by tags.
  - **Format Buttons:** Rendered as a segmented control (only one selection allowed).
  - **Theme & Track Buttons:** Allow multiple selections.
- **Client-Side Filtering:**  
  - All episode data is loaded at build time, and React handles filtering instantly in the browser.
- **Search:**  
  - A search bar filters episodes by keywords in the title or description.
- **Single-Page Experience:**  
  - The entire application is delivered as a single page with dynamic, client-side interactivity.

---

### 2.3 Episode Display

- **Episode Cards:**  
  - Episodes are shown in a responsive grid or list.
  - Each card displays:
    - **Title:** Prominently
    - **Truncated Description:** A brief snippet of the full description
    - **Tag Badges:** Visual badges for Format, Theme(s), and Track(s)
    - **"Listen" Button:** Opens the podcast link in a new tab
- **Optional Detail Modal:**  
  - Optionally, clicking a card may open a modal with the full description and all tags.

---

## 3. Non-Functional Requirements

### 3.1 Performance

- With fewer than 1,000 episodes loaded at build time, client-side filtering is instantaneous.
- The static generation process ensures fast load times and minimal latency.

### 3.2 Responsiveness & Accessibility

- The design is fully responsive on desktop, tablet, and mobile devices.
- Semantic HTML elements and ARIA roles are used to ensure accessibility.
- Filter buttons and episode cards are large, easily clickable, and meet accessibility standards for size and color contrast.

### 3.3 Maintainability

- The stack is **ReactJS, NextJS, JavaScript, TypeScript, and TailwindCSS**.
- Code follows best practices for this stack.
- UI components (filter buttons, episode cards, search bar) are modular and reusable.
- The tagging taxonomy is maintained in a centralized location for easy updates.

---

## 4. Style Guidelines & Sample CSS Snippets

To recreate the layered, minimalistic style of the Gitingest website using TailwindCSS, consider these snippets:

### 4.1 Layered Card Effect

```jsx
<div className="relative">
  {/* Background layer */}
  <div className="absolute inset-0 bg-gray-900 rounded-xl translate-y-2 translate-x-2"></div>
  {/* Foreground card */}
  <div className="relative z-10 bg-[#fff4da] rounded-xl border-3 border-gray-900 p-8">
    {/* Episode card content */}
  </div>
</div>

4.2 Big, Clickable Filter Button

<button
  className="px-6 py-3 bg-[#ffc480] border-3 border-gray-900 rounded font-bold text-gray-900 hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-200"
>
  Standalone Episodes
</button>

4.3 Page Layout & Background

<div className="bg-[#FFFDF8] min-h-screen flex flex-col">
  <Header />  {/* Navigation */}
  <main className="flex-1 w-full max-w-4xl mx-auto p-4">
    {/* Filtering controls and episode cards */}
  </main>
  <Footer />
</div>

These TailwindCSS snippets can be integrated into your React components to achieve the desired layered, modern aesthetic.

5. Implementation Phases

To help a coding helper with limited context work step by step, the implementation is divided into three focused phases. Each phase references earlier sections of this document so you know where to look for specific details.

Phase One: Data Integration and Static Data Embedding
	•	Data Integration:
	•	(See Section 2.1: Data Model and Tagging Taxonomy)
	•	Develop a module that reads all podcast episode records from the shared SQLite database (or its JSON export).
	•	The database is located in ./episodes.db
	•	Verify that each record (ID, Title, Description, Podcast Link, Format, Theme, and Track tags) is correctly retrieved.
	•	Test: Write unit tests or log a sample of records to ensure proper data retrieval.
	•	Static Data Embedding:
	•	In the Next.js page’s getStaticProps (refer to Section 2.2: Filtering & Navigation), load the entire dataset and pass it as props to the main page component.
	•	Test: Confirm that the page props include the complete list of episodes.

Phase Two: Building UI Components and Client-Side Filtering
	•	UI Components:
	•	Build the following components as described in Sections 2.2 and 2.3:
	•	Header and Footer: For navigation and overall page structure.
	•	FilterButtons Component: Renders large, clickable buttons for Format, Theme, and Track filters.
	•	EpisodeCard Component: Displays each episode’s title, truncated description, tag badges, and a “Listen” button.
	•	SearchBar Component: Provides a search input to filter episodes by keywords.
	•	Test: Write component tests (using Jest/React Testing Library) to ensure each component renders correctly with sample data.
	•	Client-Side Filtering Logic:
	•	Implement React state to track selected filters and search keywords.
	•	Develop filtering functions that filter the episode data (provided via getStaticProps) and dynamically update the displayed EpisodeCard components.
	•	Test: Manually test the filtering by clicking filter buttons and entering search terms; write tests to simulate these interactions.
	•	Style Integration:
	•	Apply the TailwindCSS snippets provided in Section 4 to achieve the layered card effect and bold filter button styles.

Phase Three: Final Integration, Responsiveness, and Build Script
	•	Responsive Layout and Styling:
	•	Use TailwindCSS responsive utilities to ensure the design is fully responsive (see Section 4 for style guidelines).
	•	Refine the layout of the header, filter buttons, episode cards, and search bar so that they adapt gracefully to different screen sizes.
	•	Test: Manually verify responsiveness on desktop, tablet, and mobile devices.
	•	Final Integration and Build Script:
	•	Integrate all UI components into the main Next.js page as described in Sections 2.2 and 2.3.
	•	Verify that all episode data is embedded and that filtering works seamlessly.
	•	Run the build script to output the production site.
	•	Test: Run the build script and inspect the production output to ensure all assets, HTML, and JavaScript are correctly generated.
	•	Deployment Preparation:
	•	Document how to update the tagging taxonomy, rebuild the site, and deploy updates to the chosen static hosting platform (e.g., Cloudflare Pages).

6. Summary

This PRD outlines the development of a separate Podcast Episode Explorer project using ReactJS, NextJS, JavaScript, TypeScript, and TailwindCSS. The application is a static, single-page app that reads all podcast episode data from a shared SQLite database at build time. Users can filter episodes by Format, Theme, and Track using large, clickable buttons. Client-side filtering is performed instantly without additional API calls. The design mirrors the layered, minimalistic aesthetic of the Gitingest website using provided TailwindCSS snippets. The detailed Implementation Phases break down the work into focused, testable stages to ensure a step-by-step development process.