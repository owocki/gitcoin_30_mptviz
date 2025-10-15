import React, { useEffect, useState } from 'react';
import { Scene } from './components/Scene';
import { Controls } from './components/Controls';
import { useStore } from './store/useStore';
import { getConfigFromURL, copyShareableURL } from './utils/urlParams';

function App() {
  const { config, setConfig } = useStore();
  const [copySuccess, setCopySuccess] = useState(false);

  // Load config from URL on mount
  useEffect(() => {
    const urlConfig = getConfigFromURL();
    if (urlConfig) {
      setConfig(urlConfig);
    }
  }, [setConfig]);

  const handleShare = async () => {
    try {
      await copyShareableURL(config);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.shareButton}>
          <button onClick={handleShare} style={styles.button}>
            {copySuccess ? 'Copied!' : 'Copy Shareable Link'}
          </button>
        </div>
        <Controls />
      </div>
      <div style={styles.main}>
        <Scene />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden'
  },
  sidebar: {
    width: '320px',
    flexShrink: 0,
    overflowY: 'auto',
    backgroundColor: '#1a1d23',
    borderRight: '1px solid #3a3d45',
    display: 'flex',
    flexDirection: 'column'
  },
  main: {
    flex: 1,
    overflow: 'hidden'
  },
  shareButton: {
    padding: '15px 20px',
    borderBottom: '1px solid #3a3d45',
    backgroundColor: '#1a1d23'
  },
  button: {
    width: '100%',
    padding: '10px 16px',
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer'
  }
};

export default App;
