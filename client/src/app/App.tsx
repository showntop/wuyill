'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { fetchEventSource } from '@microsoft/fetch-event-source';

import "./App.css";
import useEscape from '@/hooks/useEscape';
import {useChat} from '@/hooks/useChat';
import { Message } from '@/lib/types';
import SearchBar from '@/components/SearchBar';
import SearchResult from '@/components/SearchResult';

function App() {
  useEscape();
  // 使用 useState 来管理状态
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [resultType, setResultType] = useState(0);

  const aiSearch = async (query: string) => {
    let messageIndex: number | null = null;
    let updateMessages = (messages: any) => setMessages(prevMessages => {
      return [...messages];
    });
    try {
      const url = 'http://wuyill.com/api/search';
      await fetchEventSource(url, {
          method: 'post',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'text/event-stream',
          },
          body: JSON.stringify({
              model: 'gpt-4o',
              source: '',
              profile: '',
              isSearch: true,
              isShadcnUI: false,
              messages: [
                  {
                      id: 'VJbyFRGT4m',
                      content: query,
                      role: 'user',
                      attachments: [],
                      type: 'search',
                  },
              ],
          }),
          openWhenHidden: true,
          onerror(err) {
              // setLoadingText('error'+err.message);
              throw err;
          },
          async onopen(response) {
              if (response.ok && response.status === 200) {
              } else if (response.status === 429) {
                // setIsLoading(false);
                // setLoadingText('429');
              } else if (response.status === 403) {
                // setIsLoading(false);
                // setLoadingText('403');
              } else if (response.status === 400) {
                // setIsLoading(false);
                // setLoadingText('400');
              } else {
                // setIsLoading(false);
                // setLoadingText(`Received unexpected status code: ${response.status}`);
                console.error(`Received unexpected status code: ${response.status}`);
              }
          },
          onclose() {
            // setIsLoading(false);
            // setLoadingText('');
          },
          onmessage(msg) {
              console.log("message data:", msg.data);
              const { clear, answer, status, sources, images, related, videos, error, title } = JSON.parse(msg.data);
              if (clear) {
                  // accumulatedMessage = '';
                  // updateMessages(accumulatedMessage);
              }
              if (error) {
                  return;
              }
              if (status) {
                  setLoadingText(status);
              }

              if (messageIndex === null || !messages[messageIndex]) {
                messageIndex = messages.length;
                updateMessages([...messages, {
                  role: 'assistant',
                  query: query,
                  content: answer,
                  sources: sources,
                  type: 'stream'
                }]);
              }
              console.log("sources ", sources);
      
              messages[messageIndex] = {
                id: 'VJbyFRGT4m',
                role: 'assistant',
                query: query,
                sources: sources || (messages[messageIndex] || { sources: [] }).sources,
                content: (messages[messageIndex] || { content: '' }).content + answer,
                type: 'stream'
              };
              updateMessages([...messages]);
          },
      });
    } catch (e) {
    }
  };

  const stableHandleSearch = (key: string, attachments?: string[]) => {
    console.log(`Searching for ${key}`);
    // setResultType(4);
    setQuery(key);
    aiSearch(key);
  }

  const handleInput = async (event: any) => {
    if (event.target.value === '') {
      setResults([]);
      setLoadingText('app');
      return;
    }
    if (event.target.value.startsWith('/')) {
      // this signifies a full drive search. Searches in /Users folder
      setLoadingText('Press Enter to search');
      return;
    }
    localSearch(event.target.value);
  };

  const localSearch = async (searchPrompt: string) => {
    setLoadingText('Loading...');
    const data: any = await invoke('handle_input', {
      input: searchPrompt,
    });
    console.log(data);
    const results: string[] = data[0];
    const resultType: number = data[2];
    const executionTime: number = data[1];
    setResultType(resultType);
    console.log("resultType:",resultType);
    if (results.length === 0) {
      setLoadingText('No results found');
      return;
    }
    setResults(results);
    if (resultType === 3) {
      setLoadingText('Copy Answer ⏎');
      return;
    }
    setLoadingText(`~ ${Math.floor(executionTime * 1000)} ms`);
  };

  const sendSelectedQuestion = useCallback(
    async (question: string) => {
        // sendMessage(question, null);
        setTimeout(() => {
            // scrollToBottom();
        }, 500);
    },
    [],
  );

  return (
    <div className="appContainer">
      <SearchBar handleSearch={stableHandleSearch} handleInput={handleInput} loading={isLoading} loadingText={loadingText} />
      <SearchResult onEnter={sendSelectedQuestion} query={query} messages={messages} results={results} resultType={resultType} />
      {/* <SearchFooter text={footerText} /> */}
    </div>
  );
}

export default App;
