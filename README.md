# Podcast Episode Explorer

A standalone, single-page web application that lets users explore podcast episodes based on a comprehensive tagging taxonomy. Each episode is pre-tagged along three dimensions: Format Tags, Theme Tags, and Track Tags.

## Features

- **Filtering System**: Filter episodes by format, theme, and track tags
- **Search Functionality**: Search episodes by keywords in title or description
- **Responsive Design**: Fully responsive on desktop, tablet, and mobile devices
- **Episode Details**: View full episode details in a modal
- **Audio Playback**: Listen to episodes directly from the application

## Tech Stack

- **Frontend Framework**: ReactJS with NextJS
- **Programming Languages**: TypeScript
- **Styling**: TailwindCSS
- **Deployment**: Static site generation for deployment on platforms like Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd trih-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Data Structure

The application loads episode data from a JSON file at build time. The data structure includes:

- **Episode Information**: Title, description, publication date, duration
- **Tagging Taxonomy**: Format tags, theme tags, and track tags
- **Media Links**: Links to audio files

## Updating the Tagging Taxonomy

The tagging taxonomy is defined in `app/lib/constants.ts`. To update the taxonomy:

1. Edit the appropriate array in `app/lib/constants.ts`:
   - `FORMAT_TAGS`: For format categories
   - `THEME_TAGS`: For thematic categories
   - `TRACK_TAGS`: For narrative tracks

2. Ensure that any new tags added to the taxonomy are also reflected in your episode data.

3. Rebuild the application to apply changes:
   ```bash
   npm run build
   # or
   yarn build
   ```

## Updating Episode Data

The application reads episode data from `app/lib/episodes.json`. To update the episode data:

1. If you have a new SQLite database export, convert it to JSON format.

2. Replace the contents of `app/lib/episodes.json` with the new data.

3. Ensure the JSON structure matches the expected format:
   ```typescript
   {
     id: number;
     title: string;
     description: string;
     cleaned_description: string;
     podcastLink: string;
     tags: string; // JSON string containing Format, Theme, and Track tags
     publishedDate: string;
     duration: string | null;
     audioUrl: string | null;
     episodeNumber: number | null;
   }
   ```

4. Rebuild the application to apply changes.

## Deployment

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

This generates a static export in the `out` directory, which can be deployed to any static hosting service.

### Deploying to Cloudflare Pages

1. Push your code to a GitHub repository.

2. In the Cloudflare Pages dashboard:
   - Create a new project
   - Connect to your GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Build output directory: `out`
     - Node.js version: 18 (or later)

3. Deploy the site.

4. For custom domains, configure them in the Cloudflare Pages dashboard.

## Customization

### Styling

The application uses TailwindCSS for styling. To customize the appearance:

1. Edit the TailwindCSS configuration in `tailwind.config.js`.
2. Modify component styles in their respective files.

### Layout

The main layout is defined in `app/page.tsx`. The sidebar and filtering components can be customized in their respective files in the `app/components` directory.

## Troubleshooting

- **Build Errors**: Ensure all dependencies are installed and that the data format in `episodes.json` matches the expected structure.
- **Filtering Issues**: Check that the tags in your episode data match the tags defined in `constants.ts`.
- **Display Problems**: For responsive design issues, check the TailwindCSS classes in the component files.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages)
