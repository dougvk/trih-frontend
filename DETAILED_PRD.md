# Podcast Episode Explorer - Detailed Product Requirements Document (PRD)

## 1. Executive Summary

The Podcast Episode Explorer is a comprehensive mobile and web application designed to help users discover, explore, and interact with podcast episodes through multiple interfaces. The application features a sophisticated tagging system, powerful search capabilities, and AI-powered features that allow users to ask questions about podcast content and engage in conversations with an AI assistant about the podcast material.

### 1.1 Product Vision

To create the ultimate companion application for podcast listeners that enables deep exploration of podcast content through intuitive filtering, semantic search, and AI-powered interactions, making the wealth of knowledge contained in podcasts more accessible and useful.

### 1.2 Target Audience

- Podcast enthusiasts who want to explore episodes based on specific topics or themes
- Researchers looking for specific information within podcast content
- Casual listeners who want to discover new episodes based on their interests
- Users who want to extract insights from podcast content without listening to entire episodes

## 2. System Architecture

### 2.1 High-Level Architecture

The system consists of a cross-platform mobile and web application:

1. **Frontend Application**
   - Expo-based mobile application with React Native and TypeScript
   - Cross-platform support for iOS, Android, and web
   - Client-side filtering and search capabilities
   - Integration with external vector search API for semantic search
   - OpenAI API integration for AI-powered features

### 2.2 Deployment Architecture

- **Frontend**: 
  - Mobile: Published to App Store (iOS) and Google Play Store (Android)
  - Web: Deployed as a Progressive Web App (PWA)
  - Development builds via Expo Go app for testing

## 3. Data Model

### 3.1 Episode Data Structure

```typescript
interface Episode {
  id: number;
  guid: string;
  title: string;
  description: string;
  cleanedDescription: string;
  link: string;
  publishedDate: string;
  duration: string;
  audioUrl: string;
  episodeNumber: number | null;
  formatTags: string[];
  themeTags: string[];
  trackTags: string[];
  cleaningStatus: string;
  cleaningTimestamp: string;
  createdAt: string;
  updatedAt: string;
}
```

### 3.2 Tagging Taxonomy

#### 3.2.1 Format Tags
- Standalone Episodes
- Series Episodes
- Bonus Episodes

#### 3.2.2 Theme Tags
The application uses a comprehensive set of thematic categories to classify episode content:

- Ancient & Classical Civilizations
- Medieval History
- Empire & Colonialism
- Modern Political History & Leadership
- Military History & Battles
- Social & Cultural History
- Science & Technology
- Religious & Philosophical History
- Historical Mysteries
- Regional & National Histories
- General History

#### 3.2.3 Track Tags
Track tags represent narrative paths or content series that span multiple episodes:

- Roman Track
- Medieval Track
- American History Track
- British History Track
- Military & Battles Track
- Modern Political History Track
- Social History Track
- Science & Technology Track
- Religious History Track
- Historical Mysteries Track
- Global Empires Track
- World Wars Track
- Ancient Civilizations Track
- Regional Spotlight Tracks:
  - Latin America Track
  - Asia & Middle East Track
  - European History Track
  - African History Track
- Historical Figures Track
- The RIHC Bonus Track
- Archive Track
- Contemporary History Track

#### 3.2.4 Tag Implementation

Tags are implemented as string arrays in the episode data structure:

```typescript
interface Episode {
  // Other fields...
  formatTags: string[];
  themeTags: string[];
  trackTags: string[];
}
```

The application dynamically extracts unique theme and track tags from all episodes:

```typescript
// Extract unique theme tags from all episodes
export const allThemeTags = Array.from(
  new Set(allEpisodes.flatMap(episode => episode.themeTags))
).sort();

// Extract unique track tags from all episodes
export const allTrackTags = Array.from(
  new Set(allEpisodes.flatMap(episode => episode.trackTags))
).sort();
```

Tags are visually distinguished in the UI with different styling:
- Format tags: Orange background with dark border
- Theme tags: Light gray background with dark border
- Track tags: White background with dark border

### 3.3 Data Sources

- **Episode Metadata**: Loaded from a JSON file at build time
- **Transcript Data**: Accessed via external APIs for semantic search capabilities

## 4. Feature Specifications

### 4.1 Episode Explorer (Main Page)

#### 4.1.1 Filtering System
- **Format Filter**: Single-selection filter for episode format (Standalone, Series, Bonus)
- **Theme Filter**: Multi-selection filter for thematic categories
- **Track Filter**: Multi-selection filter for narrative tracks
- **Search**: Text-based search across episode titles and descriptions

#### 4.1.2 UI Components
- **Navigation**: Tab-based navigation for main app sections
- **Episode Cards**: Display of filtered episodes with key information
- **Episode Detail Screen**: Detailed view of selected episodes with full description and metadata
- **Responsive Design**: Native UI components optimized for both mobile devices and web

### 4.2 Q&A System

#### 4.2.1 Functionality
- **Question Input**: Allow users to ask natural language questions about podcast content
- **Semantic Search**: Query external vector search API to find relevant transcript chunks
- **AI Answer Generation**: Use OpenAI's API to generate answers based on relevant transcript chunks
- **Episode Recommendations**: Display episodes related to the user's query
- **API Key Management**: Secure handling of user's OpenAI API key (session storage only)

#### 4.2.2 UI Components
- **Question Input**: Text input field for user questions
- **Answer Display**: Markdown-rendered display of AI-generated answers
- **Episode Cards**: Display of relevant episodes
- **Loading States**: Visual feedback during API calls
- **Error Handling**: Clear error messages for API failures

### 4.3 Chat System

#### 4.3.1 Functionality
- **Conversational Interface**: Allow users to have ongoing conversations about podcast content
- **Context Retention**: Maintain conversation history for contextual responses
- **Semantic Search Integration**: Find relevant transcript chunks for each user message
- **AI Response Generation**: Generate contextually relevant responses using OpenAI's API
- **Episode Recommendations**: Display episodes related to the conversation

#### 4.3.2 UI Components
- **Chat Interface**: Message bubbles for user and assistant messages
- **Message Input**: Text input field for user messages
- **Episode Cards**: Display of relevant episodes
- **Auto-scrolling**: Automatically scroll to the latest message
- **Loading States**: Visual feedback during API calls

### 4.4 Audio Playback

- **Embedded Player**: Allow users to listen to episodes directly within the application
- **Episode Links**: Provide links to original podcast episodes

### 4.5 Dark Mode

- **Theme Toggle**: Allow users to switch between light and dark themes
- **Persistent Preference**: Remember user's theme preference

## 5. API Specifications

### 5.1 Vector Search API

#### 5.1.1 Endpoint
- **URL**: `https://trih-vector-service.dougsprivateapi.work/query`
- **Method**: GET
- **Description**: External API that provides semantic search capabilities for podcast transcripts

#### 5.1.2 Parameters
- **search** (required): The search query text
- **top_k** (optional): Number of results to return (default: 10)
- **podcast** (optional): Filter results to a specific podcast title

#### 5.1.3 Response Format
```json
{
  "query": "search query",
  "results": [
    {
      "podcast_title": "Podcast Name",
      "chunk_id": "unique_chunk_identifier",
      "text": "The actual transcript text that matched the query",
      "score": 0.87654
    },
    // More results...
  ]
}
```

#### 5.1.4 Security Considerations
- API requests are made client-side
- No sensitive credentials are required for this API
- HTTPS is used for all API communication

### 5.2 OpenAI API Integration

#### 5.2.1 Models
- **GPT-4o**: Used for generating answers and chat responses

#### 5.2.2 Implementation
- Client-side integration using the OpenAI JavaScript SDK
- User-provided API key stored in session storage for security
- API keys are never stored in the codebase or committed to version control
- Prompt engineering to generate high-quality, contextually relevant responses

## 6. Non-Functional Requirements

### 6.1 Performance

- **Load Time**: Initial page load under 2 seconds on standard connections
- **Filtering Speed**: Near-instantaneous client-side filtering
- **API Response Time**: Vector search API responses under 3 seconds
- **AI Generation Time**: AI responses generated within 10 seconds

### 6.2 Security

- **API Key Handling**: OpenAI API keys stored only in session storage, never in localStorage or cookies
- **HTTPS**: All communication over secure HTTPS connections
- **No Server-Side Storage**: User data not stored on servers

### 6.3 Accessibility

- **Native Accessibility**: Utilize React Native's accessibility APIs
- **Screen Reader Compatibility**: Support for VoiceOver (iOS) and TalkBack (Android)
- **Color Contrast**: Meets WCAG 2.1 AA standards for color contrast
- **Accessible Navigation**: Support for assistive technologies across platforms

### 6.4 Responsiveness

- **Native Mobile Design**: Optimized for iOS and Android devices
- **Adaptive Web Layout**: Responsive design for web deployment
- **Touch-Friendly**: Native touch interactions for mobile users

### 6.5 Internationalization

- **Language Support**: English-only in the initial version
- **Extensible Design**: Architecture allows for future language additions

## 7. Technical Specifications

### 7.1 Frontend Technologies

- **Framework**: Expo SDK 50+
  - Ensures compatibility with both mobile and PWA deployments
  - Provides unified development experience across platforms
- **Language**: TypeScript 5+
  - Enforces strict type-checking and modern JavaScript practices
  - Improves code quality and developer experience
- **UI Library**: React Native 0.73+
  - Uses the latest React Native conventions and APIs
  - Provides native UI components for mobile platforms
- **Styling**: styled-components with React Native StyleSheet
  - Enables component-based styling with theme support
  - Maintains performance through StyleSheet optimizations
- **State Management**: React Hooks and Context API
  - Provides efficient state management without external dependencies
  - Simplifies component logic and promotes code reuse
- **Markdown Rendering**: React Native Markdown packages
  - Renders formatted text content in native components

### 7.2 Version Enforcement

To ensure consistent development and deployment across environments, the following version requirements must be strictly enforced:

```json
{
  "dependencies": {
    "expo": "^50.0.0",
    "react": "18.2.0",
    "react-native": "^0.73.0",
    "typescript": "^5.0.0",
    "styled-components": "^6.0.0"
  }
}
```

All developers must use the specified minimum versions to prevent compatibility issues. The package.json and appropriate lockfiles should be maintained to enforce these requirements.

### 7.3 Development Environment

- **Node.js**: v18+
- **Package Manager**: npm or yarn
- **Build Tool**: Expo EAS Build
- **Development**: Expo Go for rapid iteration
- **Deployment**: 
  - EAS Build for app store submissions
  - Expo Web for web deployment

## 8. User Experience Design

### 8.1 Design System

- **Color Palette**:
  - Primary: #ffc480 (Orange)
  - Background: #FFFDF8 (Light Cream)
  - Card Background: #fff4da (Warm Cream)
  - Text: #1a202c (Dark Gray)
  - Accent: #3182ce (Blue)

- **Typography**:
  - Headings: System fonts (San Francisco for iOS, Roboto for Android)
  - Body: System fonts, regular
  - Monospace for code blocks

- **Components**:
  - Cards with native shadow effects
  - Native buttons with custom styling
  - Platform-specific input fields
  - Tab navigation with icons

### 8.2 User Flows

#### 8.2.1 Episode Discovery Flow
1. User lands on main page
2. User applies filters and/or search terms
3. User browses filtered episode cards
4. User clicks on an episode card to view details
5. User can listen to the episode or visit the original link

#### 8.2.2 Q&A Flow
1. User navigates to Q&A page
2. User enters OpenAI API key (if not already set)
3. User asks a question about podcast content
4. System retrieves relevant transcript chunks
5. System generates an AI answer
6. User views answer and related episodes

#### 8.2.3 Chat Flow
1. User navigates to Chat page
2. User enters OpenAI API key (if not already set)
3. User starts a conversation about podcast content
4. System maintains conversation context
5. System retrieves relevant transcript chunks for each message
6. System generates contextual AI responses
7. User views responses and related episodes

## 9. Development Roadmap

### 9.1 Phase 1: Core Functionality (Completed)
- Episode explorer with filtering system
- Basic search functionality
- Episode detail view
- Responsive design

### 9.2 Phase 2: AI Integration (Completed)
- Q&A system integration
- Vector search API integration
- OpenAI API integration
- Episode recommendations

### 9.3 Phase 3: Enhanced Features (Completed)
- Chat system
- Dark mode
- Audio playback
- Performance optimizations

## 10. Metrics and Success Criteria

### 10.1 Key Performance Indicators (KPIs)
- **User Engagement**: Average session duration
- **Feature Usage**: Percentage of users using Q&A and Chat features
- **Search Effectiveness**: Search-to-click ratio
- **Episode Discovery**: Number of unique episodes viewed per session
- **AI Quality**: User satisfaction with AI-generated answers

### 10.2 Success Criteria
- **Engagement**: Average session duration > 5 minutes
- **Feature Adoption**: >30% of users try Q&A or Chat features
- **Performance**: 95th percentile page load time < 3 seconds
- **Usability**: Task completion rate > 90% for core user flows

## 11. Appendix

### 11.1 Glossary

- **Format Tags**: Categories indicating the format of an episode (Standalone, Series, Bonus)
- **Theme Tags**: Categories indicating the thematic content of an episode
- **Track Tags**: Categories indicating the narrative track or series an episode belongs to
- **Vector Search**: Semantic search using vector embeddings of text
- **Transcript Chunks**: Segments of podcast transcripts used for search and AI features

### 11.2 References

- Expo Documentation: https://docs.expo.dev/
- React Native Documentation: https://reactnative.dev/docs
- OpenAI API Documentation: https://platform.openai.com/docs/api-reference
- Cloudflare Pages Documentation: https://developers.cloudflare.com/pages

### 11.3 Revision History

- **v1.0**: Initial PRD based on existing codebase analysis
- **v1.1**: Added detailed API specifications and user flows
- **v1.2**: Expanded technical specifications and non-functional requirements
- **v1.3**: Updated high-level architecture to use Expo and updated deployment architecture for mobile app stores
