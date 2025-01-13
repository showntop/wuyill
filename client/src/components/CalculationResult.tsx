import React from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';

const CalculationResult = ({ results }) => {
  const copyAnswer = async () => {
    await navigator.clipboard.writeText(results[0]);
  };

  const searchResultClicked = async (event) => {
    if (event.keyCode !== 13) return;
    await copyAnswer();
    const searchBarInput = document.getElementById('searchBarInput');
    searchBarInput.value = '';
    await getCurrentWindow().hide();
  };

  return (
    <div className="result">
      <button
        className="calculation-button"
        id={results[0]}
        onKeyDown={searchResultClicked}
      >
        <p>{results[0]}</p>
      </button>
    </div>
  );
};

// CSS can be moved to a separate CSS file
const styles = {
  result: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: 'none',
    borderRadius: '8px',
    width: '726px',
    height: '43px',
    backgroundColor: 'var(--highlight-overlay)',
    marginTop: '7px',
    marginLeft: '12px',
  },
  calculationButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
  },
  paragraph: {
    margin: 0,
    padding: 0,
    color: 'var(--primary-text-color)',
    fontSize: '16px',
  },
};

export default CalculationResult;