'use client';

import React, { useEffect, useRef } from 'react';
// import TextareaAutosize from 'react-textarea-autosize';

interface Props {
    handleSearch: (key: string, attachments?: string[]) => void;
    handleInput: (e: any) => void;
    showSourceSelection?: boolean;
    showIndexButton?: boolean;
    showModelSelection?: boolean;
    showWebSearch?: boolean;
    loading?: boolean;
    loadingText?: string;
}

function SearchBar({
    handleSearch,
    handleInput,
    showSourceSelection = true,
    showIndexButton = true,
    showModelSelection = true,
    showWebSearch = false,
    loading = false,
    loadingText = '加载中...',
}: Props) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
    //   inputRef.current.focus();
    }
  }, []);

  const handleInputKeydown = (e: any) => {
      if (e.code === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          console.log(e.target.value);
          if (e.target?.value) {
              handleSearch(e.target.value);
          }
      }
      
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: translateY(-50%) rotate(0deg); }
            100% { transform: translateY(-50%) rotate(360deg); }
          }
        `}
      </style>
      <div className='searchBar'>
        {/* <TextareaAutosize className="search-bar"
                    // value={content}
                    // placeholder={t('search-tip')}
                    placeholder={'ffff'}
                    minRows={3}
                    maxRows={10}
                    aria-label="Search"
                    onKeyDown={handleInputKeydown}
                    // onChange={(e) => setContent(e.target.value)}
        ></TextareaAutosize> */}
      <form action="" id="search-bar-form" style={
        {
          width: '750px',
          height: '56px',
          background: 'var(--secondary-bg-color)',
          borderRadius: '10px',
          border: 'none',
          position: 'relative'
        }
      }>
        <input
          type="text"
          placeholder="search"
          id="search-bar-input"
          ref={inputRef}
          spellCheck="false"
          onKeyDown={handleInputKeydown}
          onInput={handleInput}
          style={{
            width: '100%',
            height: '56px',
            borderRadius: '8px 8px 0px 0px',
            background: 'var(--dark-overlay)',
            paddingLeft: '16px',
            border: 'none',
            borderBottom: '1px solid var(--highlight-overlay)',
            fontFamily: 'Helvetica',
            fontStyle: 'normal',
            color: 'var(--primary-text-color)',
            fontWeight: 500,
            fontSize: '18px',
            lineHeight: '20px',
            outline: 'none',
          }}
        />
        {loading && (
            <>
                <div 
                    style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '20px',
                        height: '20px',
                        border: '2px solid var(--highlight-overlay)',
                        borderTop: '2px solid var(--primary-text-color)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                    }}
                />
                <div style={{
                    position: 'absolute',
                    right: '8px',
                    top: 'calc(50% + 16px)',
                    fontSize: '8px',
                    color: 'var(--primary-text-color)',
                    transform: 'translateY(0)',
                }}>
                    {loadingText}
                </div>
            </>
        )}
      </form>
      
    </div>
    </>
  );
}

export default SearchBar;