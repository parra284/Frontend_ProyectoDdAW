import { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import apiClient from '../utils/apiClient';
import Navbar from '../components/Navbar';
import axios from 'axios';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ResponsiveHelper from '../components/ResponsiveHelper';
import MobilePanel from '../components/MobilePanel';
import ShoppingCart from './ShoppingCart';
import ProductDetailPage from './ProductDetailPage';
import NotificationSystem, { showNotification } from '../components/NotificationSystem';
import ProductsSection from './ProductsSection';

const ProductsUser = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ 
    location: '',
    category: '',
    priceRange: '', 
    availability: ''
  });
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isRetrying, setIsRetrying] = useState(false);
  const [sortOption, setSortOption] = useState('name');

  const user = JSON.parse(localStorage.getItem('user')) || {}; // Retrieve user info
  const userRole = user.role || 'guest'; // Default to 'guest' if no role is found;
  const buttons = [
    {
      label: "Products",
      path: "/products",
      roles: ["user"]
    },
    {
      label: "Inventory",
      path: "/inventory-consultation",
      roles: ["user"]
    },
    {
      label: "Cart",
      path: "/cart",
      roles: ["user"]
    },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setIsRetrying(false);
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.location) queryParams.append('location', filters.location);
      if (searchQuery) queryParams.append('keyword', searchQuery);
      if (filters.availability === 'in-stock') queryParams.append('inStock', 'true');
      if (filters.priceRange) queryParams.append('maxPrice', filters.priceRange);
      
      const response = await axios.get(`http://localhost:3000/api/products?${queryParams}`);
      setProducts(response.data.products);
      
      // Extract unique categories for filter dropdown
      const uniqueCategories = [...new Set(response.data.products
        .filter(p => p.category)
        .map(p => p.category))];
      setCategories(uniqueCategories);
      
      // Extract unique locations for filter dropdown
      const uniqueLocations = [...new Set(response.data.products
        .filter(p => p.location)
        .map(p => p.location))];
      setLocations(uniqueLocations);
      
      setError(null);
      
      // Show success notification if retrying
      if (isRetrying) {
        showNotification('Inventory data refreshed successfully', 'success');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      const errorMsg = err.response?.data?.error || 'Failed to load inventory data. Please try again later.';
      setError(errorMsg);
      
      if (isRetrying) {
        showNotification('Failed to refresh inventory data', 'error');
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [filters, searchQuery]); // fetchProducts is defined in component scope, no need to include in deps

  const handleSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const clearFilters = () => {
    setFilters({ 
      location: '',
      category: '',
      priceRange: '', 
      availability: ''
    });
    setSearchQuery('');
    setSortOption('name');
  };

  const handleProductSelection = (productId, quantity = 1) => {
    setSelectedProducts((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(item.quantity + quantity, getProductStock(productId)) }
            : item
        );
      }
      return [...prev, { productId, quantity: Math.min(quantity, getProductStock(productId)) }];
    });
    
    // Show notification when adding to cart
    showNotification('Product added to cart', 'success');
  };

  const getProductById = (id) => products.find((p) => p.id === id);
  const getProductStock = (id) => {
    const product = getProductById(id);
    return product ? (product.stockLevel || product.stock || 0) : 0;
  };

  // View product details
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowDetail(true);
  };

  // Close product details view
  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedProduct(null);
  };

  const handleRetry = () => {
    setIsRetrying(true);
    fetchProducts();
  };

  const handleSubmit = async () => {
    console.log(selectedProducts);
    

    if (selectedProducts.length === 0) {
      showNotification('Your cart is empty', 'warning');
      return;
    }
    try {
      await apiClient.post('/orders', {
        products: selectedProducts,
      });
      showNotification('Order created successfully!', 'success');
      setSelectedProducts([]); // Clear cart after order
      setShowCart(false);
    } catch (error) {
      console.error('Error creating order:', error);
      showNotification('Failed to create order', 'error');
    }
  };

  // Sort products based on selected option
  const getSortedProducts = () => {
    switch(sortOption) {
      case 'price-low':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...products].sort((a, b) => b.price - a.price);
      case 'stock-high':
        return [...products].sort((a, b) => 
          (b.stockLevel || b.stock || 0) - (a.stockLevel || a.stock || 0));
      case 'stock-low':
        return [...products].sort((a, b) => 
          (a.stockLevel || a.stock || 0) - (b.stockLevel || b.stock || 0));
      case 'name':
      default:
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  if (loading) {
    return (
      <ResponsiveContainer className="p-4">
        <Navbar buttons={buttons} userRole={userRole} />
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
            <p className="text-gray-600 font-ginora">Loading inventory data...</p>
          </div>
        </div>
      </ResponsiveContainer>
    );
  }

  if (error) {
    return (
      <ResponsiveContainer className="p-4">
        <Navbar buttons={buttons} userRole={userRole} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="bg-red-50 border-l-4 border-secondary p-6 rounded-lg shadow-md mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-red-800 font-bebas">Error Loading Inventory Data</h3>
                <p className="text-red-700 text-sm font-ginora mt-1">{error}</p>
                <div className="mt-4">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    );
  }

  // If showing product detail view
  if (showDetail && selectedProduct) {
    return (
      <ResponsiveContainer className="p-4">
        <Navbar buttons={buttons} userRole={userRole} />
        <ProductDetailPage 
          product={selectedProduct} 
          onAccept={handleCloseDetail}
          onAddToCart={(productId) => {
            handleProductSelection(productId, 1);
            handleCloseDetail();
          }}
        />
      </ResponsiveContainer>
    );
  }

  const sortedProducts = getSortedProducts();

  const cardButtons = [
  {
    label: "Add to Cart",
    className: "flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300",
    onClick: (product) => {
      // Call handleUpdate with the current product's id and updated fields
      handleProductSelection(product.id, 1);
    },
    canDisable: true,
  }
];

  return (
    <ResponsiveContainer className="p-4">
      <Navbar buttons={buttons} userRole={userRole} />
      <NotificationSystem position="bottom-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bebas text-primary mb-3 sm:mb-0">Inventory Consultation</h1>
          <div className="flex items-center space-x-2">
            <button
              className="relative bg-white border border-primary text-primary px-3 py-1.5 rounded-lg hover:bg-primary/10 transition duration-200 text-sm font-ginora focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setShowCart((prev) => !prev)}
              title="View Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v7" />
              </svg>
              <span className="ml-1">Cart</span>
              {selectedProducts.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full px-1.5 min-w-[1.25rem] text-center">{selectedProducts.length}</span>
              )}
            </button>
            <button
              className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button
              className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
              onClick={handleRetry}
              title="Refresh inventory data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </header>

        {/* Shopping Cart Drawer */}
        {showCart && (
          <MobilePanel
          onClose={() => setShowCart(false)}
          children = {
            <ShoppingCart
              products={products}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              onClose={() => setShowCart(false)}
              onSubmit={handleSubmit}
            />
          }
          />
        )}

        {showFilters && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out">
            <h2 className="text-lg font-bebas text-primary mb-4">Search & Filter Options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search products..."
                    onChange={(e) => handleSearch(e.target.value)}
                    value={searchQuery}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select
                  name="availability"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={filters.availability}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  name="location"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={filters.location}
                  onChange={handleFilterChange}
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (Up to $)</label>
                <div className="flex items-center">
                  <input
                    type="range"
                    name="priceRange"
                    min="0"
                    max="1000"
                    step="50"
                    className="w-full"
                    value={filters.priceRange || 0}
                    onChange={handleFilterChange}
                  />
                  <span className="ml-2 text-gray-700">${filters.priceRange || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap items-center justify-between gap-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="stock-high">Stock: High to Low</option>
                  <option value="stock-low">Stock: Low to High</option>
                </select>
              </div>
              
              <button
                onClick={clearFilters}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        )}
          <ProductsSection 
          filters={filters}
          searchQuery={searchQuery}
          cardButtons={cardButtons}
          onProductsLoaded={setProducts}
          />
        
      </div>
      <ResponsiveHelper enabled={true} />
    </ResponsiveContainer>
  );
};

export default ProductsUser;
