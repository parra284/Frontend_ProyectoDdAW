import React, { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';

const RecentOrders = ({ location }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/orders/${location}`);
        const approvedOrders = response.data
          .filter(order => order.status === 'approved')
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setOrders(approvedOrders);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [location]);

  if (loading) return <div className="text-primary font-ginora">Loading orders...</div>;
  if (error) return <div className="error font-ginora text-secondary">{error}</div>;

  return (
    <div className="recent-orders bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bebas text-primary mb-4">Recent Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500 font-ginora">No approved orders found for this location.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order.id} className="order-item border border-gray-200 p-3 rounded-lg">
              <div className="font-ginora">
                <strong className="text-primary">Order ID:</strong> {order.id}
              </div>
              <div className="font-ginora">
                <strong className="text-primary">Timestamp:</strong> {new Date(order.timestamp).toLocaleString()}
              </div>
              <div className="font-ginora">
                <strong className="text-primary">Items:</strong> {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
              </div>
              <div className="font-ginora">
                <strong className="text-primary">Status:</strong> 
                <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  {order.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentOrders;
