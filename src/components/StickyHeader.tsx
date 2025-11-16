"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";

export const StickyHeader = ({
  scrollToAlignmentIssues,
}: {
  scrollToAlignmentIssues: () => void;
}) => {
  const [showHeader, setShowHeader] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > window.innerHeight * 0.8;
      if (shouldShow !== showHeader) {
        setShowHeader(shouldShow);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showHeader]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-moss-900 backdrop-blur-sm border-b border-moss-500/20 transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="px-5 md:px-20 py-3 flex items-center justify-between gap-2">
        <h2 className="text-moss-100 font-mori font-semibold text-sm md:text-lg">
          aligneth.xyz
        </h2>

        {/* Desktop buttons */}
        <div className="hidden md:flex gap-3 md:gap-4">
          <a
            href="https://www.dropbox.com/scl/fi/2ew20lb31kz62cd87g3dc/Owocki-Scheling-Point_Nov102025-b.pdf?rlkey=pw1jgsemym4tu34hol8egnt0y&e=1&st=636ugx92&dl=0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm">Read the Rainbow Paper</Button>
          </a>
          <Button size="sm" onClick={scrollToAlignmentIssues}>
            View Alignment Issues
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-moss-100 hover:text-moss-300 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            // Close icon
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-moss-500/20 bg-moss-900/98 backdrop-blur-sm">
          <div className="px-4 py-4 flex flex-col gap-3">
            <a
              href="https://www.dropbox.com/scl/fi/2ew20lb31kz62cd87g3dc/Owocki-Scheling-Point_Nov102025-b.pdf?rlkey=pw1jgsemym4tu34hol8egnt0y&e=1&st=636ugx92&dl=0"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button size="sm" className="w-full">
                Read the Rainbow Paper
              </Button>
            </a>
            <Button
              size="sm"
              className="w-full"
              onClick={() => {
                scrollToAlignmentIssues();
                setMobileMenuOpen(false);
              }}
            >
              View Alignment Issues
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
