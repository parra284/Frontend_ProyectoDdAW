import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const NotificationSystem = ({ position = 'bottom-right' }) => {
  const [notifications, setNotifications] = useState([]);
  
  // Position classes based on the position prop
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };
  
  // Listen for custom events to display notifications
  useEffect(() => {
    const handleNotification = (event) => {
      const { message, type = 'success', duration = 3000 } = event.detail;
      
      const id = Date.now().toString();
      
      setNotifications(prev => [...prev, { id, message, type, duration }]);
      
      // Auto dismiss after duration
      setTimeout(() => {
        dismissNotification(id);
      }, duration);
    };
    
    // Add event listener for custom notification events
    window.addEventListener('app-notification', handleNotification);
    
    // Clean up
    return () => {
      window.removeEventListener('app-notification', handleNotification);
    };
  }, []);
  
  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
    // Get type-specific styles
  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-secondary'; // Using our secondary color (red) for errors
      case 'warning':
        return 'bg-tertiary'; // Using our tertiary color (amber) for warnings
      case 'info':
        return 'bg-primary'; // Using our primary color (blue) for info
      default:
        return 'bg-gray-800';
    }
  };
    return (
    <div className={`fixed z-50 flex flex-col gap-2 ${positionClasses[position]}`}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getTypeStyles(notification.type)} text-white px-4 py-2 rounded-lg shadow-lg max-w-sm animate-fade-in flex items-center justify-between`}
          role="alert"
        >
          <span className="font-ginora">{notification.message}</span>
          <button 
            onClick={() => dismissNotification(notification.id)}
            className="ml-3 text-white"
            aria-label="Dismiss notification"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

NotificationSystem.propTypes = {
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right'])
};

// Helper function to show notifications from anywhere in the app
export const showNotification = (message, type = 'success', duration = 3000) => {
  window.dispatchEvent(
    new CustomEvent('app-notification', {
      detail: {
        message,
        type,
        duration
      }
    })
  );
};

export default NotificationSystem;
