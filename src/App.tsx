import React, { useEffect, useState } from 'react';
import { Scene } from './components/Scene';
import { Controls } from './components/Controls';
import { StackedScene } from './components/StackedScene';
import { useStore } from './store/useStore';
import { getConfigFromURL, copyShareableURL, copyPreviewImageURL } from './utils/urlParams';

function App() {
  const { config, setConfig } = useStore();
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyPreviewSuccess, setCopyPreviewSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState<'single' | 'stacked'>('single');

  // Handle hash-based routing
  useEffect(() => {
    const updatePage = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      console.log('[App] Hash:', hash);

      // Route to stacked view if hash is 'stacked'
      if (hash === 'stacked' || hash.startsWith('stacked?')) {
        console.log('[App] Routing to stacked view');
        setCurrentPage('stacked');
      } else {
        console.log('[App] Routing to single view');
        setCurrentPage('single');
      }
    };

    updatePage();
    window.addEventListener('hashchange', updatePage);
    window.addEventListener('popstate', updatePage);

    return () => {
      window.removeEventListener('hashchange', updatePage);
      window.removeEventListener('popstate', updatePage);
    };
  }, []);

  // Load config from URL on mount (for single view)
  useEffect(() => {
    if (currentPage === 'single') {
      const urlConfig = getConfigFromURL();
      if (urlConfig) {
        setConfig(urlConfig);
      }
    }
  }, [setConfig, currentPage]);

  const handleShare = async () => {
    try {
      await copyShareableURL(config);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleCopyPreviewURL = async () => {
    try {
      await copyPreviewImageURL(config);
      setCopyPreviewSuccess(true);
      setTimeout(() => setCopyPreviewSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy preview URL:', error);
    }
  };

  // Render stacked view
  if (currentPage === 'stacked') {
    return <StackedScene />;
  }

  // Render single view
  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.shareButton}>
          <button onClick={handleShare} style={styles.button}>
            {copySuccess ? 'Copied!' : 'Copy Shareable Link'}
          </button>
          <button
            onClick={() => window.location.hash = 'stacked'}
            style={{ ...styles.button, backgroundColor: '#6c757d', marginTop: '10px' }}
          >
            Stack Multiple Fields
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
