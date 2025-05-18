import React from 'react';

const OrderStatusBadge = ({ status, className = '' }) => {
  // Define badge styles based on status
  const getBadgeStyles = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
      case 'in progress': // Handle different formats
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'canceled': // Handle different spellings
        return 'bg-red-100 text-red-800';
      case 'approved': // For payment approved status
        return 'bg-green-100 text-green-800';
      case 'denied': // For payment denied status
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status for display
  const formatStatus = () => {
    if (!status) return 'Unknown';
    
    // Handle special cases
    if (status.toLowerCase() === 'in_progress') return 'In Progress';
    
    // Capitalize first letter of each word
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeStyles()} ${className}`}>
      {formatStatus()}
    </span>
  );
};

export default OrderStatusBadge;
