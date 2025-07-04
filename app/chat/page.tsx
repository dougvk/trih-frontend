'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { OpenAI } from 'openai';
import ReactMarkdown from 'react-markdown';
import EpisodeCard from '../components/EpisodeCard';
import EpisodeModal from '../components/EpisodeModal';
import { allEpisodes, type Episode } from '../lib/db';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

// Define types for the API response and chat messages
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

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function ChatPage() {
  // State management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [relevantEpisodes, setRelevantEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  
  // Ref for the chat container
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Ref for auto-scrolling to the bottom of the chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // API Key management functions
  const saveApiKey = () => {
    if (apiKey.trim()) {
      // Store API key in session storage (not localStorage) for better security
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

  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      // Scroll only the chat container, not the whole page
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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

  // Function to handle sending a new message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Check if API key is set
    const storedApiKey = sessionStorage.getItem('openai_api_key');
    if (!storedApiKey) {
      setError('Please set your OpenAI API key first.');
      setShowApiKeyInput(true);
      return;
    }
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');
    
    try {
      // Removing the unused variable to fix the build error
      // const conversationHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
      
      // Step 1: Get relevant context from the vector search API
      const apiUrl = `https://trih-vector-service.dougsprivateapi.work/query?search=${encodeURIComponent(inputMessage)}&top_k=20`;
      const apiResponse = await fetch(apiUrl);
      
      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`);
      }
      
      const apiData: ApiResponse = await apiResponse.json();
      
      // Step 2: Find matching episodes
      const matchedEpisodes = findMatchingEpisodes(apiData.results);
      setRelevantEpisodes(prevEpisodes => {
        // Combine previous and new episodes, removing duplicates
        const combinedEpisodes = [...prevEpisodes];
        matchedEpisodes.forEach(episode => {
          if (!combinedEpisodes.some(e => e.guid === episode.guid)) {
            combinedEpisodes.push(episode);
          }
        });
        // Sort by date (newest first)
        return combinedEpisodes.sort((a, b) => {
          const dateA = new Date(a.publishedDate);
          const dateB = new Date(b.publishedDate);
          return dateB.getTime() - dateA.getTime();
        });
      });
      
      // Step 3: Combine all relevant text chunks
      const contextText = apiData.results
        .map((result: SearchResult) => `From podcast "${result.podcast_title}":\n${result.text}`)
        .join('\n\n');
      
      // Step 4: Use OpenAI to generate a response based on the context and conversation history
      const openai = new OpenAI({
        apiKey: storedApiKey,
        dangerouslyAllowBrowser: true // Note: In production, you should use a server-side API route
      });
      
      // Prepare messages for OpenAI API - using proper types
      const systemMessage = {
        role: "system" as const,
        content: "You are a helpful assistant that answers questions based on podcast transcripts. Use the provided context to answer questions and maintain a conversational tone. Remember the conversation history to provide coherent responses. Format your answers using markdown for better readability."
      };
      
      // Convert previous messages to the format expected by OpenAI API
      const previousMessages = messages.slice(-10).map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      }));
      
      const userPrompt = {
        role: "user" as const,
        content: `Based on the following podcast transcript excerpts and our conversation so far, please respond to my latest message: "${inputMessage}"\n\nContext:\n${contextText}`
      };
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [systemMessage, ...previousMessages, userPrompt],
        temperature: 0.7,
      });
      
      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: completion.choices[0].message.content || "Sorry, I couldn't generate a response.",
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (err) {
      console.error('Error:', err);
      setError(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I'm sorry, I encountered an error: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear the chat history
  const clearChat = () => {
    setMessages([]);
    setRelevantEpisodes([]);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <main>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Chat with Podcasts</h2>
            {messages.length > 0 && (
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    // Format the entire conversation in markdown
                    const formattedConversation = messages.map(msg => {
                      const sender = msg.role === 'user' ? 'You' : 'AI Assistant';
                      const time = new Date(msg.timestamp).toLocaleTimeString();
                      return `## ${sender} (${time})\n\n${msg.content}\n\n`;
                    }).join('---\n\n');
                    
                    navigator.clipboard.writeText(formattedConversation);
                    
                    // Visual feedback
                    const button = document.activeElement;
                    if (button instanceof HTMLElement) {
                      const originalText = button.innerHTML;
                      button.innerHTML = 'Copied!';
                      setTimeout(() => {
                        button.innerHTML = originalText;
                      }, 1000);
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center"
                >
                  <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                  Copy All as MD
                </button>
                <button
                  onClick={clearChat}
                  className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                >
                  Clear Chat
                </button>
              </div>
            )}
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
          
          {/* Chat Messages */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[#0f172a] dark:bg-gray-700 rounded-xl translate-y-2 translate-x-2"></div>
            <div 
              ref={chatContainerRef}
              className="relative z-10 bg-white dark:bg-gray-800 border-3 border-[#0f172a] dark:border-gray-700 rounded-xl p-4 min-h-[400px] max-h-[600px] overflow-y-auto"
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <p className="text-center mb-2">Start chatting about the podcasts!</p>
                  <p className="text-center text-sm">Ask questions about episodes, topics, or historical figures.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`max-w-3/4 ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
                    >
                      <div className={`relative p-4 rounded-xl ${
                        message.role === 'user' 
                          ? 'bg-blue-100 dark:bg-blue-900 border-3 border-blue-500 dark:border-blue-700' 
                          : 'bg-gray-100 dark:bg-gray-700 border-3 border-[#0f172a] dark:border-gray-600'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {message.role === 'user' ? 'You' : 'AI Assistant'}
                          </div>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(message.content);
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
                            <span className="text-xs">Copy MD</span>
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
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="mr-auto">
                      <div className="relative p-4 rounded-xl bg-gray-100 dark:bg-gray-700 border-3 border-[#0f172a] dark:border-gray-600">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-300 animate-bounce" style={{ animationDelay: '100ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-300 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>
          
          {/* Message Input */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-[#0f172a] dark:bg-gray-700 rounded-xl translate-y-2 translate-x-2"></div>
            <div className="relative z-10 flex items-center border-3 border-[#0f172a] dark:border-gray-700 rounded-xl overflow-hidden">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                disabled={isLoading || !isApiKeySet}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim() || !isApiKeySet}
                className="px-6 py-3 bg-[#374151] dark:bg-gray-600 text-white font-medium focus:outline-none disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
          
          {/* Relevant Episodes Section */}
          {relevantEpisodes.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Related Episodes</h2>
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
