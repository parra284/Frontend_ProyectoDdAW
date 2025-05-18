import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { showNotification } from '../components/NotificationSystem';
import apiClient from '../utils/apiClient';
import OrderStatusBadge from './components/OrderStatusBadge';
import NotificationSystem from '../components/NotificationSystem';
import PropTypes from 'prop-types';
import { logOrderAction } from '../utils/auditLogger';

// Inline OrderStatusTimeline component
const OrderStatusTimeline = ({ currentStatus }) => {
  // Define all possible statuses in order
  const statuses = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Delivered' },
  ];
  
  // Find the current status index
  const currentIndex = statuses.findIndex(status => status.key === currentStatus);
  
  // Handle cancelled orders separately
  if (currentStatus === 'cancelled') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <svg className="h-8 w-8 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <div>
            <h3 className="text-lg font-medium text-red-800">Order Cancelled</h3>
            <p className="text-sm text-red-600">This order has been cancelled and will not be processed further.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-4">
      <div className="flex items-center">
        {statuses.map((status, index) => (
          <React.Fragment key={status.key}>
            {/* Status circle */}
            <div className="relative">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  index <= currentIndex 
                    ? 'bg-primary border-primary' 
                    : 'bg-white border-gray-300'
                }`}
              >
                {index <= currentIndex ? (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-xs text-gray-500">{index + 1}</span>
                )}
              </div>
              
              {/* Status label */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-center whitespace-nowrap">
                <div className={`font-medium ${index <= currentIndex ? 'text-gray-900' : 'text-gray-500'}`}>
                  {status.label}
                </div>
              </div>
            </div>
            
            {/* Connecting line (except after last item) */}
            {index < statuses.length - 1 && (
              <div 
                className={`flex-auto border-t-2 transition duration-500 ease-in-out mx-1 ${
                  index < currentIndex 
                    ? 'border-primary' 
                    : 'border-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

OrderStatusTimeline.propTypes = {
  currentStatus: PropTypes.string.isRequired
};

// Inline OrderItemsList component
const OrderItemsList = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-gray-500 italic p-4 bg-gray-50 rounded-lg">
        No items in this order
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item, index) => (
            <tr key={item.productId || index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {item.imageUrl && (
                    <div className="flex-shrink-0 h-10 w-10 mr-3">
                      <img
                        className="h-10 w-10 rounded-md object-cover"
                        src={item.imageUrl}
                        alt={item.name}
                      />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.name}
                    </div>
                    {item.description && (
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                ${item.price?.toFixed(2) || '0.00'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                {item.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                ${(item.price * item.quantity).toFixed(2) || item.total?.toFixed(2) || '0.00'}
              </td>
            </tr>
          ))}
          <tr className="bg-gray-50">
            <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-900">
              Total
            </td>
            <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
              ${items.reduce((sum, item) => {
                const itemTotal = item.total || (item.price * item.quantity);
                return sum + itemTotal;
              }, 0).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

OrderItemsList.propTypes = {
  items: PropTypes.array
};

// Inline OrderActionButtons component
const OrderActionButtons = ({ 
  order, 
  userRole, 
  onUpdateStatus, 
  onCancelOrder, 
  isProcessing = false 
}) => {
  if (!order) return null;
  
  const isAdmin = userRole.toLowerCase() === 'admin';
  const isPOS = userRole.toLowerCase() === 'pos';
  const isCustomer = userRole.toLowerCase() === 'customer';
  
  // No actions for completed or cancelled orders
  if (order.status === 'completed' || order.status === 'cancelled') {
    return (
      <div className="text-sm text-gray-500">
        No actions available for {order.status} orders.
      </div>
    );
  }
  
  return (
    <div className="flex flex-wrap gap-3">
      {/* Admin & POS Users - Status progression buttons */}
      {(isAdmin || isPOS) && (
        <>
          {order.status === 'pending' && (
            <button
              onClick={() => onUpdateStatus('confirmed')}
              disabled={isProcessing}
              className="bg-primary hover:bg-primary/80 text-white py-2 px-4 rounded-lg shadow-sm disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Confirm Order'}
            </button>
          )}
          
          {(order.status === 'pending' || order.status === 'confirmed') && (
            <button
              onClick={() => onUpdateStatus('in_progress')}
              disabled={isProcessing}
              className="bg-primary hover:bg-primary/80 text-white py-2 px-4 rounded-lg shadow-sm disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Start Processing'}
            </button>
          )}
          
          {order.status === 'in_progress' && (
            <button
              onClick={() => onUpdateStatus('completed')}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-sm disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Complete Order'}
            </button>
          )}
          
          <button
            onClick={() => onCancelOrder()}
            disabled={isProcessing}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-sm disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Cancel Order'}
          </button>
        </>
      )}
      
      {/* Customer Actions */}
      {isCustomer && (
        <>
          {/* Customers can only cancel pending or confirmed orders */}
          {(order.status === 'pending' || order.status === 'confirmed') && (
            <button
              onClick={() => onCancelOrder()}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-sm disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Cancel Order'}
            </button>
          )}
          
          {/* Add "Track Delivery" button when applicable */}
          {order.status === 'in_progress' && order.trackingInfo && (
            <button
              onClick={() => window.open(order.trackingInfo.url, '_blank')}
              className="bg-primary hover:bg-primary/80 text-white py-2 px-4 rounded-lg shadow-sm"
            >
              Track Delivery
            </button>
          )}
        </>
      )}
    </div>
  );
};

OrderActionButtons.propTypes = {
  order: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
  onCancelOrder: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool
};

// Inline OrderAuditLog component
const OrderAuditLog = ({ orderId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  
  // Using useCallback to memoize the fetchOrderLogs function
  const fetchOrderLogs = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/audit-logs/orders/${orderId}`);
      setLogs(response.data.logs || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching order logs:', err);
      setError('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [orderId]);
  
  useEffect(() => {
    if (orderId) {
      fetchOrderLogs();
    }
  }, [orderId, fetchOrderLogs]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-sm text-red-600 py-2">
        {error}
      </div>
    );
  }
  
  if (!logs.length) {
    return (
      <div className="text-sm text-gray-500 italic py-2">
        No audit logs available for this order
      </div>
    );
  }
  
  // Only show the latest 3 logs when not expanded
  const visibleLogs = expanded ? logs : logs.slice(0, 3);
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">Order Activity Log</h3>
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-xs text-primary hover:text-primary/80"
        >
          {expanded ? 'Show Less' : `Show All (${logs.length})`}
        </button>
      </div>
      
      <div className="bg-white divide-y divide-gray-100">
        {visibleLogs.map((log, index) => (
          <div key={log.id || index} className="px-4 py-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3 mt-1">
                {log.action === 'status_change' && (
                  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                {log.action === 'order_created' && (
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {log.action === 'order_cancelled' && (
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {!['status_change', 'order_created', 'order_cancelled'].includes(log.action) && (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{log.description}</div>
                <div className="flex items-center mt-1">
                  <div className="text-xs text-gray-500">
                    by {log.userName || log.userId || 'System'} • {formatDate(log.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

OrderAuditLog.propTypes = {
  orderId: PropTypes.string.isRequired
};

export default function OrderDetailPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  
  const { orderId } = useParams();
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
  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/orders/${orderId}`);
      setOrder(response.data.order);
      setError(null);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.response?.data?.message || 'Failed to load order details');
      showNotification('Failed to load order details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setProcessingAction(true);
      await apiClient.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      
      // Log the action
      await logOrderAction(
        user.id || 'unknown',
        orderId,
        `Changed status from ${order.status} to ${newStatus}`
      );
      
      // Update local state
      setOrder(prev => ({ ...prev, status: newStatus, updatedAt: new Date().toISOString() }));
      
      showNotification(`Order status updated to ${newStatus}`, 'success');
    } catch (err) {
      console.error('Error updating order status:', err);
      showNotification('Failed to update order status', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      return;
    }
    
    try {
      setProcessingAction(true);
      await apiClient.patch(`/api/orders/${orderId}/status`, { status: 'cancelled' });
      
      // Log the action
      await logOrderAction(
        user.id || 'unknown',
        orderId,
        `Cancelled order`
      );
      
      // Update local state
      setOrder(prev => ({ ...prev, status: 'cancelled', updatedAt: new Date().toISOString() }));
      
      showNotification('Order has been cancelled', 'success');
    } catch (err) {
      console.error('Error cancelling order:', err);
      showNotification('Failed to cancel order', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const goBack = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar buttons={buttons} userRole={userRole} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar buttons={buttons} userRole={userRole} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error || 'Order not found'}</p>
            <div className="mt-4">
              <button 
                onClick={goBack}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar buttons={buttons} userRole={userRole} />
      <NotificationSystem position="bottom-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button 
              onClick={goBack}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Orders
            </button>
            <h1 className="text-2xl font-bebas text-primary mt-2">Order #{orderId.slice(0, 8)}</h1>
          </div>
          <OrderStatusBadge status={order.status} className="mt-2 sm:mt-0" />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Order Summary Section */}
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-bebas text-primary">Order Summary</h2>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{formatDate(order.createdAt || order.timestamp)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">{formatDate(order.updatedAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-medium text-lg">${order.totalPrice?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>
          
          {/* Order Timeline */}
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-bebas text-primary mb-3">Order Status</h2>
            <OrderStatusTimeline currentStatus={order.status} />
          </div>
          
          {/* Order Items */}
          <div className="px-6 py-5">
            <h2 className="text-lg font-bebas text-primary mb-3">Order Items</h2>
            <OrderItemsList items={order.items || []} />
          </div>
          
          {/* Customer Information (only visible to POS and admin) */}
          {['pos', 'admin'].includes(userRole.toLowerCase()) && order.userId && (
            <div className="px-6 py-5 border-t border-gray-200">
              <h2 className="text-lg font-bebas text-primary mb-3">Customer Information</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p><span className="font-medium">Customer ID:</span> {order.userId}</p>
                {order.customer && (
                  <>
                    <p><span className="font-medium">Name:</span> {order.customer.name} {order.customer.lastName}</p>
                    <p><span className="font-medium">Email:</span> {order.customer.email}</p>
                  </>
                )}
              </div>
            </div>
          )}
          
          {/* Order Activity Log (for admins and POS users) */}
          {['admin', 'pos'].includes(userRole.toLowerCase()) && (
            <div className="px-6 py-5 border-t border-gray-200">
              <h2 className="text-lg font-bebas text-primary mb-3">Order Activity</h2>
              <OrderAuditLog orderId={orderId} />
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="px-6 py-5 border-t border-gray-200 bg-gray-50">
            <OrderActionButtons 
              order={order}
              userRole={userRole} 
              onUpdateStatus={handleUpdateStatus}
              onCancelOrder={handleCancelOrder}
              isProcessing={processingAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
