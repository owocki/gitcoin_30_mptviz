import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Scene } from "../components/Scene";
import { Controls } from "../components/Controls";
import { useStore } from "../store/useStore";
import { getConfigFromURL, copyShareableURL } from "../utils/urlParams";
import { Button } from "../components/button";

// Mobile detection utility
const isMobileDevice = () => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768
  );
};

// Mobile Warning Component
const MobileWarning = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-moss-900 p-5">
      <div className="max-w-[500px] text-center bg-moss-900 p-10 rounded-xl border border-[#3a3d45]">
        <h2 className="text-[28px] font-bold text-white mb-5 bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
          Desktop Required
        </h2>
        <p className="text-base text-[#a8adb7] mb-8 leading-relaxed">
          This visualization tool requires a desktop browser for the best
          experience. Please visit this page on a desktop computer.
        </p>
        <button
          onClick={() => navigate("/")}
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
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const navigate = useNavigate();
  const location = useLocation();

  // Check for mobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
      console.error("Failed to copy URL:", error);
    }
  };

  if (isMobile) {
    return <MobileWarning />;
  }

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden bg-moss-900
      `}
    >
      <div
        className={`w-80 flex-shrink-0 overflow-y-auto flex flex-col 
          bg-moss-900 border-r border-[#3a3d45]
        `}
      >
        <div className="p-4 flex flex-col gap-3">
          <Button size="sm" onClick={() => navigate("/")} className="w-full">
            Back to Homepage
          </Button>
          <Button size="sm" className="w-full" onClick={handleShare}>
            {copySuccess ? "✓ Copied!" : "📋 Copy Share Link"}
          </Button>
          <Button
            size="sm"
            className="w-full"
            onClick={() => navigate("/stacked")}
          >
            Stack Multiple Fields
          </Button>
        </div>
        <Controls />
      </div>
      <div className={`flex-1 overflow-hidden bg-moss-900`}>
        <Scene />
      </div>
    </div>
  );
}
