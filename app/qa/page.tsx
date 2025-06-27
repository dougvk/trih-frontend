'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { OpenAI } from 'openai';
import ReactMarkdown from 'react-markdown';
import EpisodeCard from '../components/EpisodeCard';
import EpisodeModal from '../components/EpisodeModal';
import { allEpisodes, type Episode } from '../lib/db';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

// Define types for the API response
interface SearchResult {
  podcast_title: string;
  chunk_id: string;
  text: string;
  score: number;
}

interface ApiResponse {
  query: string;
  results: SearchResult[];
}

export default function QAPage() {
  const [query, setQuery] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [relevantEpisodes, setRelevantEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  const saveApiKey = () => {
    if (apiKey.trim()) {
      // Store API key in session storage (not localStorage) for better security
      // It will be cleared when the browser is closed
      sessionStorage.setItem('openai_api_key', apiKey.trim());
      setIsApiKeySet(true);
      setShowApiKeyInput(false);
    }
  };

  const clearApiKey = () => {
    sessionStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsApiKeySet(false);
  };

  // Check if API key exists in session storage on component mount
  useEffect(() => {
    const storedApiKey = sessionStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsApiKeySet(true);
    }
  }, []);

  // Function to find matching episodes based on fuzzy title matching
  const findMatchingEpisodes = (searchResults: SearchResult[]): Episode[] => {
    // Extract unique podcast titles from search results
    const podcastTitles = [...new Set(searchResults.map(result => result.podcast_title))];
    
    console.log("API Podcast Titles:", podcastTitles);
    console.log("Total episodes in database:", allEpisodes.length);
    
    // Find matching episodes using fuzzy matching
    const matchedEpisodes: Episode[] = [];
    
    podcastTitles.forEach(apiTitle => {
      console.log("Processing API title:", apiTitle);
      
      // Clean up the API title more aggressively
      let cleanedApiTitle = apiTitle
        .replace(/\.txt$/, '') // Remove .txt extension
        .replace(/^\d+_/, '') // Remove leading numbers and underscore
        .replace(/ copy$/, '') // Remove trailing "copy"
        .trim();
      
      console.log("Cleaned API title:", cleanedApiTitle);
      
      // Normalize punctuation for better matching
      const normalizeTitle = (title: string) => {
        return title
          .toLowerCase()
          .replace(/[,:;!?'"]/g, '') // Remove punctuation
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
      };
      
      const normalizedApiTitle = normalizeTitle(cleanedApiTitle);
      
      // Find the best matching episode
      let bestMatch: Episode | undefined;
      let highestScore = 0;
      
      allEpisodes.forEach(episode => {
        const normalizedEpisodeTitle = normalizeTitle(episode.title);
        
        // Calculate a similarity score
        let score = 0;
        
        // Check for exact normalized title match
        if (normalizedEpisodeTitle === normalizedApiTitle) {
          score += 100;
        }
        
        // Extract significant words (longer than 3 characters)
        const getSignificantWords = (text: string) => {
          return text.split(/\s+/).filter(word => word.length > 3);
        };
        
        const apiWords = getSignificantWords(normalizedApiTitle);
        const episodeWords = getSignificantWords(normalizedEpisodeTitle);
        
        // Calculate word overlap score
        const commonWords = apiWords.filter(word => episodeWords.includes(word));
        const wordOverlapRatio = commonWords.length / Math.max(apiWords.length, episodeWords.length);
        score += wordOverlapRatio * 50;
        
        // Check for specific pattern matches
        // Handle "Part X" pattern
        const partMatch = /part\s*(\d+)/i.exec(cleanedApiTitle);
        if (partMatch) {
          const partNum = partMatch[1];
          if (episode.title.toLowerCase().includes(`part ${partNum}`) || 
              episode.title.toLowerCase().includes(`part${partNum}`)) {
            score += 20;
          }
        }
        
        // Check for title containment (bidirectional)
        if (normalizedEpisodeTitle.includes(normalizedApiTitle) || 
            normalizedApiTitle.includes(normalizedEpisodeTitle)) {
          score += 30;
        }
        
        // Bonus for matching key topic words
        const keyTopics = ['boudicca', 'boudica', 'roman', 'britain', 'conquest', 'celtic', 'language'];
        keyTopics.forEach(topic => {
          if (normalizedApiTitle.includes(topic) && normalizedEpisodeTitle.includes(topic)) {
            score += 10;
          }
        });
        
        // Log high-scoring potential matches for debugging
        if (score > 15) {
          console.log(`Potential match: "${episode.title}" with score ${score}`);
        }
        
        if (score > highestScore) {
          highestScore = score;
          bestMatch = episode;
        }
      });
      
      // Use a lower threshold to ensure we find matches
      if (bestMatch && highestScore > 15) {
        console.log("Found match:", bestMatch.title, "with score:", highestScore);
        if (!matchedEpisodes.some(e => e.guid === bestMatch!.guid)) {
          matchedEpisodes.push(bestMatch);
        }
      } else {
        console.log("No match found with sufficient score for:", cleanedApiTitle);
      }
    });
    
    console.log("Total matched episodes:", matchedEpisodes.length);
    return matchedEpisodes;
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    // Check if API key is set
    const storedApiKey = sessionStorage.getItem('openai_api_key');
    if (!storedApiKey) {
      setError('Please set your OpenAI API key first.');
      setShowApiKeyInput(true);
      return;
    }
    
    setIsLoading(true);
    setAnswer('');
    setError('');
    setRelevantEpisodes([]);
    
    try {
      // Step 1: Get relevant context from the vector search API
      const apiUrl = `https://trih-vector-service.dougsprivateapi.work/query?search=${encodeURIComponent(query)}&top_k=20`;
      const apiResponse = await fetch(apiUrl);
      
      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`);
      }
      
      const apiData: ApiResponse = await apiResponse.json();
      
      // Step 2: Find matching episodes and sort by date (newest first)
      const matchedEpisodes = findMatchingEpisodes(apiData.results);
      const sortedEpisodes = [...matchedEpisodes].sort((a, b) => {
        const dateA = new Date(a.publishedDate);
        const dateB = new Date(b.publishedDate);
        return dateB.getTime() - dateA.getTime();
      });
      setRelevantEpisodes(sortedEpisodes);
      
      // Step 3: Combine all relevant text chunks
      const contextText = apiData.results
        .map((result: SearchResult) => `From podcast "${result.podcast_title}":\n${result.text}`)
        .join('\n\n');
      
      // Step 4: Use OpenAI to generate an answer based on the context
      const openai = new OpenAI({
        apiKey: storedApiKey,
        dangerouslyAllowBrowser: true // Note: In production, you should use a server-side API route
      });
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that answers questions based on podcast transcripts. Use only the provided context to answer the question. If the context doesn't contain relevant information, say that you don't have enough information. Format your answers using markdown for better readability."
          },
          {
            role: "user",
            content: `Based on the following podcast transcript excerpts, please answer this question: "${query}"\n\nContext:\n${contextText}`
          }
        ],
        temperature: 0.7,
      });
      
      setAnswer(completion.choices[0].message.content || "Sorry, I couldn't generate an answer.");
    } catch (err) {
      console.error('Error:', err);
      setError(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <main>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ask Questions About Podcasts</h2>
          </div>
          
          {/* API Key Management */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">OpenAI API Key</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {isApiKeySet 
                    ? "API key is set (stored in session storage only)" 
                    : "You need to provide your OpenAI API key to use this feature"}
                </p>
              </div>
              <div>
                {isApiKeySet ? (
                  <button
                    onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                  >
                    {showApiKeyInput ? 'Hide' : 'Change Key'}
                  </button>
                ) : null}
                {isApiKeySet ? (
                  <button
                    onClick={clearApiKey}
                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Clear Key
                  </button>
                ) : (
                  <button
                    onClick={() => setShowApiKeyInput(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Set API Key
                  </button>
                )}
              </div>
            </div>
            
            {showApiKeyInput && (
              <div className="mt-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#0f172a] dark:bg-gray-700 rounded-xl translate-y-2 translate-x-2"></div>
                  <div className="relative z-10 flex rounded-xl overflow-hidden border-3 border-[#0f172a] dark:border-gray-700">
                    <input
                      type="password"
                      placeholder="Enter your OpenAI API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-grow px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                    />
                    <button
                      onClick={saveApiKey}
                      disabled={!apiKey.trim()}
                      className="px-4 py-2 bg-[#374151] text-white font-medium focus:outline-none disabled:opacity-50 rounded-r-xl"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  Your API key is stored in session storage and will be cleared when you close your browser.
                </p>
              </div>
            )}
          </div>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border-3 border-red-500 rounded-xl p-4 mb-8">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
          
          {/* Search Input */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-[#0f172a] dark:bg-gray-700 rounded-xl translate-y-2 translate-x-2"></div>
            <div className="relative z-10 flex items-center border-3 border-[#0f172a] dark:border-gray-700 rounded-xl overflow-hidden">
              <input
                type="text"
                placeholder="Ask a question about the podcasts..."
                className="flex-grow px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                disabled={isLoading || !isApiKeySet}
              />
              <button
                onClick={handleSearch}
                disabled={isLoading || !query.trim() || !isApiKeySet}
                className="px-6 py-3 bg-[#374151] dark:bg-gray-600 text-white font-medium focus:outline-none disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
          
          {/* Results */}
          {answer && (
            <div className="mt-8">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-[#0f172a] dark:bg-gray-700 rounded-xl translate-y-2 translate-x-2"></div>
                <div className="relative z-10 bg-white dark:bg-gray-800 border-3 border-[#0f172a] dark:border-gray-700 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Answer</h3>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(answer);
                        // Optional: Add a temporary visual feedback
                        const button = document.activeElement;
                        if (button instanceof HTMLElement) {
                          const originalText = button.innerHTML;
                          button.innerHTML = 'Copied!';
                          setTimeout(() => {
                            button.innerHTML = originalText;
                          }, 1000);
                        }
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
                      title="Copy as Markdown"
                    >
                      <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">Copy as Markdown</span>
                    </button>
                  </div>
                  <div className="prose max-w-none text-gray-900 dark:text-gray-100">
                    <ReactMarkdown
                      components={{
                        p: ({...props}) => <p className="mb-4 text-gray-900 dark:text-gray-100" {...props} />,
                        h1: ({...props}) => <h1 className="text-xl font-bold mt-6 mb-4 text-gray-900 dark:text-gray-100" {...props} />,
                        h2: ({...props}) => <h2 className="text-lg font-bold mt-5 mb-3 text-gray-900 dark:text-gray-100" {...props} />,
                        h3: ({...props}) => <h3 className="text-base font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100" {...props} />,
                        ul: ({...props}) => <ul className="list-disc pl-5 mb-4 text-gray-900 dark:text-gray-100" {...props} />,
                        ol: ({...props}) => <ol className="list-decimal pl-5 mb-4 text-gray-900 dark:text-gray-100" {...props} />,
                        li: ({...props}) => <li className="mb-1 text-gray-900 dark:text-gray-100" {...props} />,
                        blockquote: ({...props}) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-900 dark:text-gray-100" {...props} />,
                      }}
                    >
                      {answer}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
              
              {relevantEpisodes.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Related Episodes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {relevantEpisodes.map(episode => (
                      <EpisodeCard
                        key={episode.guid}
                        episode={episode}
                        onClick={() => setSelectedEpisode(episode)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {selectedEpisode && (
            <EpisodeModal
              episode={selectedEpisode}
              onClose={() => setSelectedEpisode(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
