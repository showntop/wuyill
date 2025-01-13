// desktop/Verve/src/routes/App/lib/SearchResult.jsx
import React, { useEffect, useState, useRef } from 'react';
import { memo, useMemo } from 'react';
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import AISearchResult from './AISearchResult';
import { Message } from '../lib/types';
// import FileSearchResult from './FileSearchResult';

const SearchResult = memo((props: { messages: (any)[], resultType: number, onSelect: (question: string) => void; }) => {
  const { messages, resultType, onSelect } = props;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      const updateWindowSize = async () => {
        const currentWindow = await getCurrentWindow();
        await currentWindow.setSize(new LogicalSize(800, 600)); // 设置为你需要的尺寸
      };
      updateWindowSize();
      if (containerRef.current) { // 聚焦
        containerRef.current.classList.add('searchResultFocused');
      }
    }
  }, [messages]); 


  return (
    <div className="searchResult overflow-y-auto" ref={containerRef}>
      {[...messages].reverse().map((message, index) => (
        <React.Fragment key={index}>
          <AISearchResult message={message as Message} onSelect={onSelect} />
          {index < messages.length - 1 && <hr className="my-2 border-gray-200" />}
        </React.Fragment>
      ))}
    </div>
  );
});

export default SearchResult;