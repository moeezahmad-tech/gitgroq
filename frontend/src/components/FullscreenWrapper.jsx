'use client';

import { useState, useEffect, useCallback } from 'react';
import { Maximize2, X } from 'lucide-react';

function FullscreenWrapper({ children, title }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };

    document.addEventListener('keydown', handleKey);
    // Prevent body scroll when fullscreen
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  return (
    <>
      {/* Normal view with fullscreen button */}
      <div className="relative">
        <button
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 z-40 p-2 rounded-lg bg-gray-800/90 border border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors backdrop-blur-sm"
          title="Enter fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        {children}
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-gray-950 flex flex-col overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
            <h2 className="text-lg font-semibold text-gray-200">{title}</h2>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Exit fullscreen (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content fills remaining space */}
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </div>
      )}
    </>
  );
}

export default FullscreenWrapper;
