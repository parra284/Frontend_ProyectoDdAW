import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import {
  fetchProducts as fetchProductsApi
} from "./productsService";

export default function ProductsSection({ filters, searchQuery, extraButtons, cardButtons }) {
  const itemsPerPage = 5;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState([]); // Add state for cart
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Fetch products when filters or searchQuery change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProductsApi(filters, searchQuery);
        setProducts(products);
        setError(null);
        setCurrentPage(1);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters, searchQuery]);

  // Function to handle adding products to the cart
  const handleAddToCart = (product) => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const { name, lastName, email } = user;

    const cartItem = {
      ...product,
      user: { name, lastName, email },
      quantity: 1, // Default quantity
    };

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, cartItem];
    });
  };

  // Function to handle payment
  const handlePayment = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: cart,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate payment.');
      }

      const { paymentLink, orderId } = await response.json();
      setOrderId(orderId);
      window.location.href = paymentLink; // Redirect to PayU
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  // Filtering (if needed, but API already filters)
  const filteredProducts = products;

  // Pagination
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-gray-600 font-ginora">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-secondary p-4 rounded mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-red-700 text-sm font-ginora">Error: {typeof error === "string" ? error : error?.message || "An unknown error occurred"}</p>
          </div>
        </div>
      </div>
    );
  }

  // Add a basic shopping cart interface
  return (
    <div className="lg:w-3/4 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bebas text-primary mb-2 sm:mb-0">
          Products ({filteredProducts.length})
        </h1>
        <div className="flex flex-row gap-2">
          {extraButtons && extraButtons.map((btn, idx) => (
            <button
              key={idx}
              className={btn.className}
              onClick={btn.onClick}
              type="button"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shopping Cart Section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-bebas text-primary mb-4">Shopping Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <span>{item.name} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handlePayment}
          >
            Proceed to Payment
          </button>
        </div>
      </div>

      {/* Existing Product List */}
      {filteredProducts.length === 0 ? (
        <div className="bg-gray-50 p-6 text-center rounded-md border border-gray-200">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              setProducts={setProducts}
              cardButtons={cardButtons}
            >
              <button
                className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </ProductCard>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              &larr;
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium
                  ${currentPage === index + 1 
                    ? 'bg-blue-600 text-white border-blue-600 z-10' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              &rarr;
            </button>
          </nav>
        </div>
      )}

      {showPaymentConfirmation && (
        <PaymentConfirmation
          orderId={orderId}
          onClose={() => setShowPaymentConfirmation(false)}
        />
      )}
    </div>
  );
}

export function PaymentConfirmation({ orderId, onClose }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order status.");
        }
        const data = await response.json();
        setStatus(data.status);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [orderId]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-md">
          <p className="text-gray-600">Loading payment status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-md">
          <p className="text-red-600">Error: {error}</p>
          <button
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Payment Status</h2>
        <p className={status === "approved" ? "text-green-600" : "text-red-600"}>
          {status === "approved" ? "Your payment was successful!" : "Your payment was rejected."}
        </p>
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}