import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Scene } from '../components/Scene';
import { Controls } from '../components/Controls';
import { useStore } from '../store/useStore';
import { getConfigFromURL, copyShareableURL } from '../utils/urlParams';

// Mobile detection utility
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768;
};

// Mobile Warning Component
const MobileWarning = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#0f1114] p-5">
      <div className="max-w-[500px] text-center bg-[#1a1d23] p-10 rounded-xl border border-[#3a3d45]">
        <h2 className="text-[28px] font-bold text-white mb-5 bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
          Desktop Required
        </h2>
        <p className="text-base text-[#a8adb7] mb-8 leading-relaxed">
          This visualization tool requires a desktop browser for the best experience.
          Please visit this page on a desktop computer.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 border-none rounded-md text-white text-base font-semibold cursor-pointer transition-colors"
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
};

export function CreatePage() {
  const { config, setConfig } = useStore();
  const [copySuccess, setCopySuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const navigate = useNavigate();
  const location = useLocation();

  // Check for mobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load config from URL on mount
  useEffect(() => {
    const urlConfig = getConfigFromURL();
    if (urlConfig) {
      setConfig(urlConfig);
    }
  }, [setConfig, location.search]);

  const handleShare = async () => {
    try {
      await copyShareableURL(config);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  if (isMobile) {
    return <MobileWarning />;
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${darkMode ? 'bg-[#0a0c10]' : 'bg-white'}`}>
      <div className={`w-80 flex-shrink-0 overflow-y-auto flex flex-col ${
        darkMode
          ? 'bg-[#1a1d23] border-r border-[#3a3d45]'
          : 'bg-[#f5f5f5] border-r border-[#ddd]'
      }`}>
        <div className={`p-4 ${
          darkMode
            ? 'border-b border-[#3a3d45] bg-[#1a1d23]'
            : 'border-b border-[#ddd] bg-[#f5f5f5]'
        }`}>
          <button
            onClick={() => navigate('/')}
            className="w-full px-4 py-2.5 bg-gray-600 hover:bg-gray-700 border-none rounded text-white text-sm font-medium cursor-pointer transition-colors"
          >
            Back to Homepage
          </button>
          <button
            onClick={handleShare}
            className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 border-none rounded text-white text-sm font-medium cursor-pointer mt-2.5 transition-colors"
          >
            {copySuccess ? '✓ Copied!' : '📋 Copy Share Link'}
          </button>
          <button
            onClick={() => navigate('/stacked')}
            className="w-full px-4 py-2.5 bg-gray-600 hover:bg-gray-700 border-none rounded text-white text-sm font-medium cursor-pointer mt-2.5 transition-colors"
          >
            Stack Multiple Fields
          </button>
        </div>
        <Controls />
      </div>
      <div className={`flex-1 overflow-hidden ${darkMode ? 'bg-[#0a0c10]' : 'bg-white'}`}>
        <Scene darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      </div>
    </div>
  );
}
