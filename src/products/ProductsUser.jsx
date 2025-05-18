import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import apiClient from '../utils/apiClient';
import Navbar from '../components/Navbar';
import axios from 'axios';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ResponsiveHelper from '../components/ResponsiveHelper';

const ProductsUser = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ location: '' });
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user')) || {}; // Retrieve user info
  const userRole = user.role || 'guest'; // Default to 'guest' if no role is found;

  const buttons = [
    {
      label: "Products",
      path: "/products",
      roles: ["user"]
    },
    {
      label: "Cart",
      path: "/cart",
      roles: ["user"]
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/products');
        setProducts(response.data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300);

  const handleMapLocationClick = (e) => {
    const { lat, lng } = e.latlng;
    setFilters((prev) => ({ ...prev, location: `${lat},${lng}` }));
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
  };

  const getProductById = (id) => products.find((p) => p.id === id);
  const getProductStock = (id) => getProductById(id)?.stock || 0;

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <ResponsiveContainer className="p-4">
      <Navbar buttons={buttons} userRole={userRole} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bebas text-primary mb-3 sm:mb-0">Products</h1>
          <div className="flex items-center space-x-2">            <button
              className="relative bg-white border border-primary text-primary px-3 py-1.5 rounded-lg hover:bg-primary/10 transition duration-200 text-sm font-ginora focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setShowCart((prev) => !prev)}
              title="View Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v7" />
              </svg>
              <span className="ml-1">Cart</span>
              {selectedProducts.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full px-1.5">{selectedProducts.length}</span>
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
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm transition-all duration-200 ease-in-out">
            <div className="sm:flex sm:space-x-4">
              <div className="mb-3 sm:mb-0 sm:flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search products..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Location</label>
              <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                style={{ height: '300px', width: '100%' }}
                onClick={handleMapLocationClick}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                {filters.location && (
                  <Marker
                    position={filters.location.split(',').map(Number)}
                  />
                )}
              </MapContainer>
            </div>
          </div>
        )}


        <div className="flex justify-between items-center mb-4">
          <p className="text-sm sm:text-base text-gray-600">
            Total Items: <span className="font-medium">{filteredProducts.length}</span>
          </p>
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
      </div>
      <ResponsiveHelper enabled={true} />
    </ResponsiveContainer>
  );
};

export default ProductsUser;
