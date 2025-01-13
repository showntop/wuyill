'use client';

import React, { useState } from 'react';
import { getFileName, getTruncatedFilePath, getIcon } from '@/lib/utils';

interface FileSearchResultProps {
  filePath: string;
  resultType: number;
  onClick: (e:any) => void;
}

const FileSearchResult: React.FC<FileSearchResultProps> = ({ filePath, resultType, onClick }) => {
  const [fallbackSrc, setFallbackSrc] = useState<string>('');

  
  const handleIconLoad = async () => {
    const { icon, fallbackIcon } = await getIcon(getFileName(filePath).replace(/.app$/, ''));
    return { icon, fallbackIcon };
  };

  return (
    <button onClick={onClick} className="searchResult" id={filePath}>
      <div className="resultContent">
        <React.Suspense fallback={<span className="icon" />}>
          <IconImage filePath={filePath} onError={setFallbackSrc} fallbackSrc={fallbackSrc} />
        </React.Suspense>
        <p className="fileName" style={{color: 'black'}}>
          {getFileName(filePath).replace(/.app$/, '')}
        </p>
      </div>
      {resultType === 2 && (
        <div className="resultPathDiv">
          <p className="resultPathText">
            {getTruncatedFilePath(filePath)}
          </p>
        </div>
      )}
      <style >{`
        .resultPathDiv {
          position: relative;
          right: 0%;
        }

        .resultPathText {
          font-family: Helvetica;
          font-style: normal;
          font-weight: 500;
          font-size: 12px;
          line-height: 20px;
          margin: 0;
          color: var(--secondary-text-color);
          width: 250px;
          text-align: right;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .searchResult {
          margin-top: 7px;
          margin-left: 12px;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 0px 12px;
          width: 726px;
          height: 43px;
          background: transparent;
          border: none;
          border-radius: 8px;
          flex: none;
          order: 1;
          flex-grow: 0;
        }

        .resultContent {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex: none;
          order: 0;
          flex-grow: 0;
          margin-right: auto;
        }

        .icon {
          display: inline-flex;
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }

        .fileName {
          font-family: Helvetica;
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          margin: 0;
          color: var(--primary-text-color);
          text-align: left;
          width: 250px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </button>
  );
};

// 分离的图标组件用于处理异步加载
const IconImage: React.FC<{
  filePath: string;
  onError: (fallback: string) => void;
  fallbackSrc: string;
}> = ({ filePath, onError, fallbackSrc }) => {
  const [iconSrc, setIconSrc] = React.useState<string>('');

  React.useEffect(() => {
    const loadIcon = async () => {
      const { icon, fallbackIcon } = await getIcon(getFileName(filePath).replace(/.app$/, ''));
      setIconSrc(icon);
    };
    loadIcon();
  }, [filePath]);

  return (
    <img
      className="icon"
      src={fallbackSrc || iconSrc}
      alt=""
      onError={ async (e) => {
        const { fallbackIcon } = await getIcon(getFileName(filePath).replace(/.app$/, ''));
        onError(fallbackIcon);
      }}
    />
  );
};

export default FileSearchResult;