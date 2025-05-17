import { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';
import Navbar from '../components/Navbar';

const ProductsUser = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ location: '' });
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        console.log(response);
        
        setProducts(response.data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSelection = (productId, quantity = 1) => {
    setSelectedProducts((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(quantity, getProductStock(productId)) }
            : item
        );
      }
      return [...prev, { productId, quantity: Math.min(quantity, getProductStock(productId)) }];
    });
    setShowCart(true);
  };

  const handleRemoveFromCart = (productId) => {
    setSelectedProducts((prev) => prev.filter((item) => item.productId !== productId));
  };

   const handleCartQuantityChange = (productId, newQuantity) => {
    setSelectedProducts((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, Math.min(newQuantity, getProductStock(productId))) }
          : item
      )
    );
  };

  const getProductById = (id) => products.find((p) => p.id === id);
  const getProductStock = (id) => getProductById(id)?.stock || 0;

  const cartTotal = selectedProducts.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = filters.location ? product.location === filters.location : true;
    return matchesSearch && matchesLocation;
  });

  const handleSubmit = async () => {
  if (selectedProducts.length === 0) {
    alert('Your cart is empty.');
    return;
  }
  try {
    await apiClient.post('/orders', {
      products: selectedProducts,
    });
    alert('Order created successfully!');
    setSelectedProducts([]); // Clear cart after order
    setShowCart(false);
  } catch (error) {
    console.error('Error creating order:', error);
    alert('Failed to create order.');
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-0">Products</h1>
          <div className="flex items-center space-x-2">
            <button
              className="relative bg-white border border-blue-600 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setShowCart((prev) => !prev)}
              title="View Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v7" />
              </svg>
              <span className="ml-1">Cart</span>
              {selectedProducts.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">{selectedProducts.length}</span>
              )}
            </button>
            <button
              className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </header>

        {/* Shopping Cart Drawer */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex justify-end">
            <div className="w-full max-w-md bg-white h-full shadow-lg p-6 overflow-y-auto relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setShowCart(false)}
                aria-label="Close cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
              {selectedProducts.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                <div>
                  <ul>
                    {selectedProducts.map((item) => {
                      const product = getProductById(item.productId);
                      if (!product) return null;
                      return (
                        <li key={item.productId} className="flex items-center justify-between py-2 border-b">
                          <div>
                            <span className="font-medium">{product.name}</span>
                            <div className="text-xs text-gray-500">${product.price} x</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className="px-2 py-1 bg-gray-200 rounded"
                              onClick={() =>
                                handleCartQuantityChange(item.productId, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >-</button>
                            <input
                              type="number"
                              min={1}
                              max={getProductStock(item.productId)}
                              value={item.quantity}
                              onChange={(e) =>
                                handleCartQuantityChange(item.productId, Number(e.target.value))
                              }
                              className="w-12 text-center border rounded"
                            />
                            <button
                              className="px-2 py-1 bg-gray-200 rounded"
                              onClick={() =>
                                handleCartQuantityChange(item.productId, item.quantity + 1)
                              }
                              disabled={item.quantity >= getProductStock(item.productId)}
                            >+</button>
                            <button
                              className="ml-2 text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveFromCart(item.productId)}
                              title="Remove"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    onClick={handleSubmit}
                  >
                    Checkout
                  </button>
                </div>
              )}
            </div>
            {/* Click outside to close */}
            <div className="flex-1" onClick={() => setShowCart(false)}></div>
          </div>
        )}

        {showFilters && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm transition-all duration-200 ease-in-out">
            <div className="sm:flex sm:space-x-4">
              <div className="mb-3 sm:mb-0 sm:flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <div className="sm:flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  name="location"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={filters.location}
                  onChange={handleFilterChange}
                >
                  <option value="">All Locations</option>
                  <option value="Punto Verde">Punto Verde</option>
                  <option value="Living Lab">Living Lab</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm sm:text-base text-gray-600">
            Total Items: <span className="font-medium">{filteredProducts.length}</span>
          </p>
          <div className="flex space-x-2">
            <button className="p-1.5 bg-gray-200 rounded hover:bg-gray-300" title="List view">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button className="p-1.5 bg-blue-100 rounded hover:bg-blue-200" title="Grid view">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 sm:h-48 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                />
                {product.stock <= 0 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 m-2 rounded">
                    SOLD OUT
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h2>
                <p className="text-gray-700 mb-2 font-medium">${product.price}</p>
                <p className="text-sm text-gray-600 mb-4">Stock: {product.stock}</p>
                {product.stock > 0 ? (
                  <button
                    className="w-full bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={() => handleProductSelection(product.id, 1)}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <button className="w-full bg-gray-400 text-white px-3 py-2 rounded-md cursor-not-allowed" disabled>
                    SOLD OUT
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            onClick={handleSubmit}
          >
            Submit Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsUser;
