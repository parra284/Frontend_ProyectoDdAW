import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { showNotification } from '../components/NotificationSystem';
import apiClient from '../utils/apiClient';
import OrderStatusBadge from './components/OrderStatusBadge';
import NotificationSystem from '../components/NotificationSystem';
import PropTypes from 'prop-types';

// Inline OrderFilters component
const OrderFilters = ({ filters, onFilterChange, userRole }) => {
  const isAdmin = userRole.toLowerCase() === 'admin';
  // isPOS variable is only used for conditional rendering if needed

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];
  
  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 3 Months' },
    { value: '365days', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];
  
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' }
  ];
  
  // Additional filter options for admin/POS users
  const locationOptions = isAdmin ? [
    { value: '', label: 'All Locations' },
    { value: 'store1', label: 'Store #1' },
    { value: 'store2', label: 'Store #2' },
    { value: 'online', label: 'Online' }
  ] : [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        {/* Status Filter */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Date Range Filter */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Time Period
          </label>
          <select
            id="date-filter"
            value={filters.dateRange}
            onChange={(e) => onFilterChange('dateRange', e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {dateRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Sort Order */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="sort-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sort-filter"
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Location Filter (Admin only) */}
        {isAdmin && (
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              id="location-filter"
              value={filters.location || ''}
              onChange={(e) => onFilterChange('location', e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {locationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {/* Clear Filters button */}
      {(filters.status || filters.dateRange !== '30days' || filters.sortBy !== 'newest' || filters.location) && (
        <div className="mt-4 text-right">
          <button 
            onClick={() => {
              onFilterChange('status', '');
              onFilterChange('dateRange', '30days');
              onFilterChange('sortBy', 'newest');
              if (isAdmin) onFilterChange('location', '');
            }}
            className="text-sm text-primary hover:text-primary/80 underline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

OrderFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired
};

// Inline OrdersList component
const OrdersList = ({ orders, userRole, onStatusUpdate, onViewDetails }) => {
  const isAdmin = userRole.toLowerCase() === 'admin';
  const isPOS = userRole.toLowerCase() === 'pos';
  const isCustomer = userRole.toLowerCase() === 'customer';

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow-sm rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            {(isAdmin || isPOS) && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
            )}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map(order => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  #{order.id.slice(0, 8)}
                </div>
              </td>
              
              {(isAdmin || isPOS) && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.customer ? `${order.customer.name} ${order.customer.lastName}` : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.customer?.email || 'No email provided'}
                  </div>
                </td>
              )}
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatDate(order.createdAt || order.timestamp)}
                </div>
              </td>
              
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {(order.items || []).length} items
                </div>
                <div className="text-xs text-gray-500 truncate max-w-xs">
                  {(order.items || []).map(item => `${item.name} (${item.quantity})`).join(', ')}
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  ${order.totalPrice?.toFixed(2) || '0.00'}
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <OrderStatusBadge status={order.status} />
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onViewDetails(order.id)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  View
                </button>
                
                {/* Status update options for POS or Admin */}
                {(isAdmin || isPOS) && order.status !== 'completed' && order.status !== 'cancelled' && (
                  <div className="inline-block relative group">
                    <button className="text-primary hover:text-primary/80">
                      Update Status
                    </button>
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        {order.status !== 'confirmed' && (
                          <button
                            onClick={() => onStatusUpdate(order.id, 'confirmed')}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            Confirm Order
                          </button>
                        )}
                        
                        {(order.status === 'confirmed' || order.status === 'pending') && (
                          <button
                            onClick={() => onStatusUpdate(order.id, 'in_progress')}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            Mark In Progress
                          </button>
                        )}
                        
                        {order.status === 'in_progress' && (
                          <button
                            onClick={() => onStatusUpdate(order.id, 'completed')}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            Complete Order
                          </button>
                        )}
                        
                        <button
                          onClick={() => onStatusUpdate(order.id, 'cancelled')}
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Cancel button for customers */}
                {isCustomer && (order.status === 'pending' || order.status === 'confirmed') && (
                  <button
                    onClick={() => onStatusUpdate(order.id, 'cancelled')}
                    className="text-red-600 hover:text-red-900"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

OrdersList.propTypes = {
  orders: PropTypes.array.isRequired,
  userRole: PropTypes.string.isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '30days',
    sortBy: 'newest'
  });
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = user.role || 'guest';

  const buttons = [
    {
      label: "Products",
      path: "/products",
      roles: ["POS", "user"]
    },
    {
      label: "Orders",
      path: "/orders",
      roles: ["POS", "user", "admin"]
    },
  ];

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      
      // Different endpoints based on user role
      let endpoint = '/api/orders';
      if (userRole.toLowerCase() === 'customer') {
        endpoint = '/api/orders/customer';
      }
      
      // Add query parameters for filtering
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.dateRange) queryParams.append('dateRange', filters.dateRange);
      
      const response = await apiClient.get(`${endpoint}?${queryParams.toString()}`);
      
      setOrders(response.data.orders || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
      showNotification('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, userRole]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await apiClient.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      showNotification(`Order status updated to ${newStatus}`, 'success');
      
      // Update the order in the UI without refetching all orders
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } 
            : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      showNotification('Failed to update order status', 'error');
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const sortOrders = (ordersToSort) => {
    return [...ordersToSort].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.timestamp);
      const dateB = new Date(b.createdAt || b.timestamp);
      
      if (filters.sortBy === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  };

  const filteredOrders = orders.filter(order => {
    // If no status filter is applied, show all orders
    if (!filters.status) return true;
    
    // Otherwise filter by status
    return order.status === filters.status;
  });

  const sortedOrders = sortOrders(filteredOrders);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar buttons={buttons} userRole={userRole} />
      <NotificationSystem position="bottom-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bebas text-primary">Order Management</h1>
          <p className="text-gray-600 font-ginora mt-2">
            {userRole.toLowerCase() === 'customer' 
              ? 'View and track your orders' 
              : 'Manage and process customer orders'}
          </p>
        </div>
        
        <OrderFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          userRole={userRole}
        />
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <button 
              onClick={fetchOrders} 
              className="mt-2 text-sm text-red-700 underline"
            >
              Try Again
            </button>
          </div>
        ) : sortedOrders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9" />
            </svg>
            <h3 className="mt-2 text-lg font-bebas text-primary">No Orders Found</h3>
            <p className="mt-1 text-gray-500 font-ginora">
              {filters.status 
                ? `No orders with status "${filters.status}" found.` 
                : "You don't have any orders yet."}
            </p>
            {filters.status && (
              <button
                className="mt-3 text-sm text-blue-600 underline"
                onClick={() => handleFilterChange('status', '')}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <OrdersList 
            orders={sortedOrders} 
            userRole={userRole} 
            onStatusUpdate={handleStatusUpdate}
            onViewDetails={handleViewDetails}
          />
        )}
      </div>
    </div>
  );
}
