import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import Navbar from "../components/Navbar";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/orders"); // Adjust endpoint if needed
        setOrders(response.data.orders || []);
      } catch (err) {
        setError("Failed to fetch orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const confirmOrder = async (id) => {
    try {
      const response = await apiClient.patch(`/orders/${id}/status`,
        {
          status: "confirmed"
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: response.data.order.status } : order
        )
      );

    } catch (error) {
      console.error("Failed to confirm order:", error);
      alert("Failed to confirm order");
    }
  }

  const buttons = [
    {
      label: "Products",
      action: () => navigate("/products")
    },
    {
      label: "Orders",
      action: () => navigate("/orders")
    },
  ];

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4 space-y-6">
      <Navbar 
      buttons={buttons}
      />
      <div className="mt-15">
      {orders.length === 0 && <p>No orders found.</p>}
      {orders.map((order) => (
        <div
          key={order.id}
          className="border rounded-2xl shadow-md p-4 bg-white"
        >
          <h2 className="text-xl font-semibold mb-2">Order #{order.id}</h2>
          <p className="text-sm text-gray-600 mb-4">
            User: {order.userId} | Status:{" "}
            <span
              className={
                order.status === "pending"
                  ? "text-yellow-500"
                  : "text-green-600"
              }
            >
              {order.status}
            </span>
          </p>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × ${item.price}
                  </p>
                </div>
                <p className="font-semibold">${item.total}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-lg font-bold">
              Total: ${order.totalPrice.toLocaleString()}
            </p>
            {order.status === "pending" && (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={() => confirmOrder(order.id)}
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Orders;
