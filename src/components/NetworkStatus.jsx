import React, { useState, useEffect } from 'react';

/**
 * A component that displays the current network status and provides
 * retry functionality when offline or encountering errors
 */
const NetworkStatus = ({ status = 'online', onRetry, showRetry = true, className = '' }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Determine the current status (prioritizing explicit props over browser online status)
  const currentStatus = status !== 'online' ? status : isOnline ? 'online' : 'offline';
  
  // Style based on status
  const getStatusStyle = () => {
    switch (currentStatus) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'offline':
        return 'bg-red-100 text-secondary border-secondary/30';
      case 'server-error':
        return 'bg-tertiary/20 text-tertiary border-tertiary/30';
      case 'loading':
        return 'bg-primary/10 text-primary border-primary/30';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Icon based on status
  const getStatusIcon = () => {
    switch (currentStatus) {
      case 'online':
        return (
          <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'offline':
        return (
          <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m13.5 2.5a5 5 0 010 7.07m-7.07 0a5 5 0 010-7.07" />
          </svg>
        );
      case 'server-error':
        return (
          <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'loading':
        return (
          <svg className="animate-spin h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Status text
  const getStatusText = () => {
    switch (currentStatus) {
      case 'online':
        return 'Connected';
      case 'offline':
        return 'Offline';
      case 'server-error':
        return 'Server Error';
      case 'loading':
        return 'Loading';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <div className={`rounded-md border ${getStatusStyle()} ${className}`}>
      <div className="p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            {getStatusIcon()}
          </div>
          <div className="ml-2 flex-1 md:flex md:justify-between">
            <p className="text-sm">
              {getStatusText()}
            </p>
            {showRetry && currentStatus !== 'online' && onRetry && (
              <p className="mt-1 md:mt-0 md:ml-6">
                <button
                  onClick={onRetry}
                  className="text-sm font-medium underline hover:text-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  type="button"
                >
                  Retry
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;
