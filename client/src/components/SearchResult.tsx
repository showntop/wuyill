import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/core';
import CalculationResult from './CalculationResult';
import FileSearchResult from './FileSearchResult';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import AISearchResult from './AISearchResult';
import { Message } from '@/lib/types';
import {useChat} from '@/hooks/useChat';

interface SearchResultProps {
  query: string;
  results: string[];
  resultType: number;
  messages: Message[];
  onEnter: (question: string) => void;
}

const SearchResult = (props :SearchResultProps) => {
  const { query, results, messages, resultType, onEnter } = props;
  const handleChat = useChat();

  // const [messages, setMessages] = useState<Message[]>([]);

  // const aiSearch = async (query: string) => {
  //   let messageIndex: number | null = null;
  //   let updateMessages = (messages: any) => setMessages(prevMessages => {
  //     return [...messages];
  //   });
  //   try {
  //     const url = 'http://wuyill.com/api/search';
  //     await fetchEventSource(url, {
  //         method: 'post',
  //         headers: {
  //             'Content-Type': 'application/json',
  //             'Accept': 'text/event-stream',
  //         },
  //         body: JSON.stringify({
  //             model: 'gpt-4o',
  //             source: '',
  //             profile: '',
  //             isSearch: true,
  //             isShadcnUI: false,
  //             messages: [
  //                 {
  //                     id: 'VJbyFRGT4m',
  //                     content: query,
  //                     role: 'user',
  //                     attachments: [],
  //                     type: 'search',
  //                 },
  //             ],
  //         }),
  //         openWhenHidden: true,
  //         onerror(err) {
  //             // setLoadingText('error'+err.message);
  //             throw err;
  //         },
  //         async onopen(response) {
  //             if (response.ok && response.status === 200) {
  //             } else if (response.status === 429) {
  //               // setIsLoading(false);
  //               // setLoadingText('429');
  //             } else if (response.status === 403) {
  //               // setIsLoading(false);
  //               // setLoadingText('403');
  //             } else if (response.status === 400) {
  //               // setIsLoading(false);
  //               // setLoadingText('400');
  //             } else {
  //               // setIsLoading(false);
  //               // setLoadingText(`Received unexpected status code: ${response.status}`);
  //               console.error(`Received unexpected status code: ${response.status}`);
  //             }
  //         },
  //         onclose() {
  //           // setIsLoading(false);
  //           // setLoadingText('');
  //         },
  //         onmessage(msg) {
  //             const { clear, answer, status, sources, images, related, videos, error, title } = JSON.parse(msg.data);
  //             if (clear) {
  //                 // accumulatedMessage = '';
  //                 // updateMessages(accumulatedMessage);
  //             }
  //             if (error) {
  //                 return;
  //             }
  //             if (status) {
  //                 // setLoadingText(status);
  //             }

  //             if (messageIndex === null || !messages[messageIndex]) {
  //               messageIndex = messages.length;
  //               updateMessages([...messages, {
  //                 role: 'assistant',
  //                 query: query,
  //                 content: answer,
  //                 sources: sources,
  //                 type: 'stream'
  //               }]);
  //             }
  //             console.log("sources ", sources);
      
  //             messages[messageIndex] = {
  //               id: 'VJbyFRGT4m',
  //               role: 'assistant',
  //               query: query,
  //               sources: sources || (messages[messageIndex] || { sources: [] }).sources,
  //               content: (messages[messageIndex] || { content: '' }).content + answer,
  //               type: 'stream'
  //             };
  //             updateMessages([...messages]);
  //         },
  //     });
  //   } catch (e) {
  //   }
  // };

  useEffect(() => {
    console.log("resultType:",resultType);
    if (resultType !== 4) {
      return;
    }
    const updateWindow = async () => {
      await getCurrentWindow().setSize(new LogicalSize(750, 500));
      
      // if (results.length > 0 && results[0] !== '') {
      //   const firstResult = document.getElementById(results[0]);
      //   firstResult?.classList.add('searchResultFocused');
      //   firstResult?.focus();
      // }
    };
    
    updateWindow();
    // aiSearch(query);
    
  }, [resultType]);

  const containerRef = useRef(null);

  // useEffect(() => {
  //   const updateWindow = async () => {
  //     const height = containerRef.current?.clientHeight;
  //     await getCurrentWindow().setSize(new LogicalSize(750, height));
      
  //     if (results.length > 0 && results[0] !== '') {
  //       const firstResult = document.getElementById(results[0]);
  //       firstResult?.classList.add('searchResultFocused');
  //       firstResult?.focus();
  //     }
  //   };
    
  //   updateWindow();
  // }, [results]);

  const searchResultClicked = async (event: any) => {
    console.log(event)
    handleChat();
    // await invoke('open_command', { path: event.target.id });
    // await invoke('open_window', { path: event.target.id });
    // const searchBarInput = document.getElementById('searchBarInput');
    // if (searchBarInput) searchBarInput.value = '';
    // await getCurrentWindow().hide();
  };

  // const handleKeydown = async (event: any) => {
  //   if (event.keyCode === 38 || event.keyCode === 40) {
  //     const current = document.activeElement;
  //     const items = [...document.getElementsByClassName('searchResult')];
  //     const currentIndex = items.indexOf(current);
  //     let newIndex;

  //     if (currentIndex === -1) {
  //       newIndex = 0;
  //     } else {
  //       if (event.keyCode === 38) {
  //         newIndex = (currentIndex + items.length - 1) % items.length;
  //       } else {
  //         newIndex = (currentIndex + 1) % items.length;
  //       }
  //     }

  //     if (current && items[newIndex]) {
  //       items[newIndex].classList.add('searchResultFocused');
  //       current.classList.remove('searchResultFocused');
  //       current.blur();
  //       items[newIndex].focus();
  //     }
  //   } else if (event.key === 'Enter') {
  //     const current = document.activeElement;
  //     current?.click();
  //   } else {
  //     const searchBarInput = document.getElementById('searchBarInput');
  //     searchBarInput?.focus();
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('keydown', handleKeydown);
  //   return () => window.removeEventListener('keydown', handleKeydown);
  // }, []);

  const styles = {
    searchResultFocused: {
      background: 'var(--highlight-overlay)',
      outline: 0,
      borderRadius: '8px'
    }
  };

  return (
    <div className="searchResults" ref={containerRef}>
      { 
        (resultType <= 2) ? (
          results.slice(0, 5).map((result: string) => (
            <FileSearchResult
              key={result}
              filePath={result}
              onClick={searchResultClicked}
              resultType={resultType}
            />
          ))
        ) : resultType === 3 ? (
          <CalculationResult results={results} />
        ) : resultType === 4 ? (
          [...messages].reverse().map((message, index) => (
            <React.Fragment key={index}>
              <AISearchResult message={message} onSelect={searchResultClicked} />
              {index < messages.length - 1 && <hr className="my-2 border-gray-200" />}
            </React.Fragment>
          ))
        ) : <div>null</div>
      }
      <style>
        {`
          .searchResultFocused {
            background: var(--highlight-overlay) !important;
            outline: 0 !important;
            border-radius: 8px;
          }
        `}
      </style>
    </div>
  );
};

export default SearchResult;