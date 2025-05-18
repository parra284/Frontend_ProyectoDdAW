import { useState, useEffect } from 'react';

/**
 * A responsive helper component that shows the current breakpoint
 * Useful for development and testing responsive layouts
 */
export default function ResponsiveHelper({ enabled = false }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only show in development mode or when enabled
  if (!enabled && process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  // Determine current breakpoint
  const getBreakpoint = (width) => {
    if (width < 640) return 'xs';
    if (width < 768) return 'sm';
    if (width < 1024) return 'md';
    if (width < 1280) return 'lg';
    if (width < 1536) return 'xl';
    return '2xl';
  };
  
  const currentBreakpoint = getBreakpoint(windowWidth);
  
  // More accessible colors with better contrast
  let bgColor, textColor;
  switch (currentBreakpoint) {
    case 'xs': bgColor = 'bg-secondary'; textColor = 'text-white'; break;
    case 'sm': bgColor = 'bg-orange-700'; textColor = 'text-white'; break;
    case 'md': bgColor = 'bg-tertiary'; textColor = 'text-black'; break;
    case 'lg': bgColor = 'bg-green-700'; textColor = 'text-white'; break;
    case 'xl': bgColor = 'bg-primary'; textColor = 'text-white'; break;
    case '2xl': bgColor = 'bg-purple-700'; textColor = 'text-white'; break;
    default: bgColor = 'bg-gray-700'; textColor = 'text-white';
  }
  
  return (
    <div 
      className="fixed bottom-0 left-0 z-50 opacity-80 hover:opacity-100 transition-opacity"
      role="status" 
      aria-live="polite"
      aria-label={`Current viewport width is ${windowWidth}px at breakpoint ${currentBreakpoint}`}
    >
      <div className={`${bgColor} ${textColor} text-xs px-2 py-1 rounded-tr focus-within:ring-2 focus-within:ring-white font-ginora`}>
        <div className="font-mono">
          <span className="font-bold">{currentBreakpoint}</span>
          <span className="ml-2">{windowWidth}px</span>
        </div>
      </div>
    </div>
  );
}
