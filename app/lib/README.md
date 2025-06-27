# Episodes Data Configuration

## Setup

1. Copy `episodes.sample.json` to `episodes.json`:
   ```bash
   cp app/lib/episodes.sample.json app/lib/episodes.json
   ```

2. Replace the sample data with your podcast episodes data.

## Data Structure

The `episodes.json` file should contain an array of episode objects with the following structure:

### Required Fields:
- `guid` (string): Unique identifier for the episode
- `title` (string): Episode title
- `cleaned_description` (string): Cleaned episode description
- `published_date` (string): RFC 2822 formatted date
- `audio_url` (string): URL to the audio file
- `tags` (object): Must contain:
  - `Format` (string[]): Format categories
  - `Theme` (string[]): Theme categories
  - `Track` (string[]): Track categories
  - `episode_number` (number | null): Episode number

### Optional Fields:
- `description` (string): Original description (defaults to cleaned_description)
- `link` (string): Episode webpage URL
- `duration` (string): Duration in HH:MM:SS format
- `cleaning_status` (string): Status of data cleaning
- `cleaning_timestamp` (string): When data was cleaned
- `created_at` (string): Creation timestamp
- `updated_at` (string): Last update timestamp

## Taxonomy Structure

The application expects a three-level taxonomy hierarchy:
- **Format**: High-level episode format (e.g., "Interview Episodes", "Series Episodes")
- **Theme**: Content themes (e.g., "Wine Regions", "History", "Technology")
- **Track**: Specific tracks or series (e.g., "Burgundy", "Medieval Track")

The taxonomy values are extracted dynamically from the episodes data, so you can use any values that make sense for your podcast.

## Note

The `episodes.json` file is gitignored to protect private podcast data. Make sure to keep a backup of your episodes data separately.