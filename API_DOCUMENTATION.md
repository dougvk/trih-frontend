# Query API Documentation

## Endpoint Details

- **URL**: `/query`
- **Method**: GET
- **Purpose**: Searches for relevant podcast transcript chunks based on a semantic query

## Query Parameters

1. **`search`** (required)
   - The search query text you want to find in the podcast transcripts
   - Example: `?search=artificial intelligence in healthcare`

2. **`top_k`** (optional)
   - Number of results to return
   - Default: 10
   - Example: `?search=AI&top_k=5`

3. **`podcast`** (optional)
   - Filter results to a specific podcast title
   - Example: `?search=climate change&podcast=Science Weekly`

## Response Format

The API returns a JSON response with the following structure:

```json
{
  "query": "your search query",
  "results": [
    {
      "podcast_title": "Podcast Name",
      "chunk_id": "unique_chunk_identifier",
      "text": "The actual transcript text that matched your query...",
      "score": 0.87654 // Similarity score (higher is better)
    },
    // More results...
  ]
}
```

## Error Responses

- **400 Bad Request**: If the required `search` parameter is missing
  ```json
  {
    "error": "Missing required parameter: search"
  }
  ```

- **500 Internal Server Error**: If there's a server-side error processing the query
  ```json
  {
    "error": "Error processing query: [error details]"
  }
  ```

## Implementation Notes

1. The API uses vector embeddings to perform semantic search, meaning it can find conceptually related content even if the exact words don't match.

2. Results are sorted by relevance (similarity score).

3. The backend uses either OpenAI embeddings or local embeddings depending on server configuration.

4. The service is designed to handle hundreds of podcast transcripts efficiently.

## Example Usage

For your frontend, you might implement a search function like this:

```javascript
async function searchTranscripts(query, topK = 10, podcastFilter = null) {
  let url = `/query?search=${encodeURIComponent(query)}&top_k=${topK}`;
  
  if (podcastFilter) {
    url += `&podcast=${encodeURIComponent(podcastFilter)}`;
  }
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      return data.results;
    } else {
      throw new Error(data.error || 'Unknown error occurred');
    }
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
}
```

# Q&A and Chat System Implementation

## Overview

The Podcast Episode Explorer application features two AI-powered interfaces: a Q&A system and a Chat system. Both systems leverage the vector search API and OpenAI's API to provide intelligent interactions with podcast content.

## Common Components Between Q&A and Chat

### External APIs Used

1. **Vector Search API**
   - **Endpoint**: `https://trih-vector-service.dougsprivateapi.work/query`
   - **Purpose**: Finds semantically relevant podcast transcript chunks
   - **Implementation**: Used to retrieve context for answering questions

2. **OpenAI API**
   - **Purpose**: Generates AI responses based on retrieved context
   - **Model**: GPT-4o
   - **Authentication**: User-provided API key (stored in session storage)
   - **Implementation**: Direct client-side integration using OpenAI SDK

### API Key Management

Both systems share the same API key management approach:
- API keys are stored in **session storage** only (cleared when browser is closed)
- Users can set, change, and clear their API key
- No server-side storage of API keys for security reasons

### Episode Matching Logic

Both systems implement fuzzy matching to associate transcript chunks with episodes:
- Extracts unique podcast titles from search results
- Cleans titles (removes numbers, "copy", etc.)
- Applies a scoring system based on:
  - Exact title matches
  - Partial title matches
  - Word-by-word matches
  - Special case handling (e.g., Charlemagne episodes)
- Returns episodes that exceed a score threshold

## Q&A System Implementation

### Data Flow

1. **User Input Phase**:
   - User enters a question
   - System validates OpenAI API key availability

2. **Context Retrieval Phase**:
   - `GET` request to vector search API with query parameter
   - Request format: `/query?search={question}&top_k=20`
   - System receives relevant transcript chunks

3. **Episode Matching Phase**:
   - System matches transcript chunks to episodes using fuzzy matching
   - Relevant episodes are identified and stored

4. **Answer Generation Phase**:
   - System combines transcript chunks as context
   - OpenAI API call with:
     - System prompt defining assistant behavior
     - User prompt containing question and context
   - Model generates comprehensive answer

5. **Response Display Phase**:
   - Answer rendered with markdown support
   - Relevant episodes displayed as clickable cards

### Example API Call

```typescript
// Vector Search Call
const apiUrl = `https://trih-vector-service.dougsprivateapi.work/query?search=${encodeURIComponent(query)}&top_k=20`;
const apiResponse = await fetch(apiUrl);
const apiData: ApiResponse = await apiResponse.json();

// OpenAI API Call
const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant that answers questions based on podcast transcripts..."
    },
    {
      role: "user",
      content: `Based on the following podcast transcript excerpts, please answer this question: "${query}"\n\nContext:\n${contextText}`
    }
  ],
  temperature: 0.7,
});
```

## Chat System Implementation

### Data Flow

1. **Conversation Management**:
   - System maintains chat message history
   - Each message has: id, role, content, and timestamp
   - Messages are displayed in chronological order
   - Auto-scrolling to latest message implemented

2. **Message Processing**:
   - User sends a message
   - System validates OpenAI API key availability
   - User message added to chat history

3. **Context Retrieval Phase**:
   - `GET` request to vector search API with latest message as query
   - Request format: `/query?search={message}&top_k=10`
   - System receives relevant transcript chunks

4. **Episode Matching Phase**:
   - System matches transcript chunks to episodes
   - New relevant episodes are added to existing relevant episodes
   - Duplicates are removed

5. **Response Generation Phase**:
   - System combines transcript chunks as context
   - OpenAI API call includes:
     - System prompt for conversational behavior
     - Up to 10 previous messages for conversation history
     - Latest user message with context
   - Model generates contextual response considering conversation history

6. **UI Interactions**:
   - User can continue the conversation
   - User can view episode details
   - User can clear conversation history

### Example API Call

```typescript
// Vector Search Call
const apiUrl = `https://trih-vector-service.dougsprivateapi.work/query?search=${encodeURIComponent(inputMessage)}&top_k=10`;
const apiResponse = await fetch(apiUrl);
const apiData: ApiResponse = await apiResponse.json();

// Prepare messages for OpenAI API
const systemMessage = {
  role: "system",
  content: "You are a helpful assistant that answers questions based on podcast transcripts..."
};

// Convert previous messages to the format expected by OpenAI API
const previousMessages = messages.slice(-10).map(msg => ({
  role: msg.role as "user" | "assistant",
  content: msg.content
}));

// OpenAI API Call
const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [systemMessage, ...previousMessages, userPrompt],
  temperature: 0.7,
});
```

## Implementation Differences Between Q&A and Chat

| Feature | Q&A System | Chat System |
|---------|-----------|-------------|
| **Interaction Model** | Single question and answer | Ongoing conversation |
| **Context Handling** | Only current question | Maintains conversation history |
| **OpenAI Messages** | System prompt + current question | System prompt + conversation history + current message |
| **UI Components** | Single answer display | Chat bubbles for conversation |
| **Relevant Episodes** | Refreshed with each question | Accumulated across conversation |
| **Message Structure** | Simple question/answer | Messages with timestamps and roles |
| **Vector Search Usage** | `top_k=20` (more context) | `top_k=10` (balancing context and speed) |

## Performance Considerations

1. **Client-Side Processing**:
   - All API interactions happen directly from the client
   - API key is exposed in client code (mitigated by session storage)
   - Consider server-side proxy in production

2. **Response Time Optimization**:
   - Chat history limited to 10 previous messages
   - Relevant transcript chunks limited by `top_k` parameter
   - Episode matching optimized for speed

3. **Error Handling**:
   - Graceful handling of API failures
   - Informative error messages for users
   - Recovery mechanisms for failed requests
