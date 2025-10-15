import React, { useEffect, useState } from 'react';
import { Scene } from './components/Scene';
import { Controls } from './components/Controls';
import { StackedScene } from './components/StackedScene';
import { Gallery } from './components/Gallery';
import { useStore } from './store/useStore';
import { getConfigFromURL, copyShareableURL, copyPreviewImageURL } from './utils/urlParams';

// Mobile detection utility
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768;
};

function App() {
  const { config, setConfig } = useStore();
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyPreviewSuccess, setCopyPreviewSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState<'gallery' | 'create' | 'stacked'>('gallery');
  const [isMobile, setIsMobile] = useState(isMobileDevice());

  // Check for mobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle hash-based routing
  useEffect(() => {
    const updatePage = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      console.log('[App] Hash:', hash);

      // Route based on hash
      if (hash === 'stacked' || hash.startsWith('stacked?')) {
        console.log('[App] Routing to stacked view');
        setCurrentPage('stacked');
      } else if (hash === 'create' || hash.startsWith('create?') || hash.startsWith('?')) {
        console.log('[App] Routing to create view');
        setCurrentPage('create');
      } else {
        console.log('[App] Routing to gallery view');
        setCurrentPage('gallery');
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

  // Load config from URL on mount (for create view)
  useEffect(() => {
    if (currentPage === 'create') {
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

  // Render gallery view (home page)
  if (currentPage === 'gallery') {
    return <Gallery />;
  }

  // Mobile warning component
  const MobileWarning = () => (
    <div style={styles.mobileWarning}>
      <div style={styles.mobileWarningContent}>
        <h2 style={styles.mobileWarningTitle}>Desktop Required</h2>
        <p style={styles.mobileWarningText}>
          This visualization tool requires a desktop browser for the best experience.
          Please visit this page on a desktop computer.
        </p>
        <button
          onClick={() => window.location.hash = ''}
          style={styles.mobileWarningButton}
        >
          Back to Gallery
        </button>
      </div>
    </div>
  );

  // Render stacked view
  if (currentPage === 'stacked') {
    if (isMobile) {
      return <MobileWarning />;
    }
    return <StackedScene />;
  }

  // Render create view
  if (isMobile) {
    return <MobileWarning />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.shareButton}>
          <button
            onClick={() => window.location.hash = ''}
            style={{ ...styles.button, backgroundColor: '#6c757d' }}
          >
            Back to Gallery
          </button>
          <button onClick={handleShare} style={{ ...styles.button, marginTop: '10px' }}>
            {copySuccess ? '✓ Copied!' : '📋 Copy Share Link'}
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
  },
  mobileWarning: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#0f1114',
    padding: '20px'
  },
  mobileWarningContent: {
    maxWidth: '500px',
    textAlign: 'center',
    backgroundColor: '#1a1d23',
    padding: '40px',
    borderRadius: '12px',
    border: '1px solid #3a3d45'
  },
  mobileWarningTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  mobileWarningText: {
    fontSize: '16px',
    color: '#a8adb7',
    marginBottom: '30px',
    lineHeight: '1.6'
  },
  mobileWarningButton: {
    padding: '12px 32px',
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer'
  }
};

export default App;
