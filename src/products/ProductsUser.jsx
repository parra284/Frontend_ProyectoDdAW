import { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';
import Navbar from '../components/Navbar';
import axios from 'axios';
import MobilePanel from '../components/MobilePanel';
import ProductsFilters from './ProductsFilters';
import ShoppingCart from './ShoppingCart';

const ProductsUser = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ location: '' });
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const buttons = [
    {
      label: "Cart",
      action: () => setShowCart(true)
    },
    {
      label: "Filters",
      action: () => setShowFilters(true)
    },
  ];

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

  const clearFilters = () => {
    setFilters({ category: '', availability: '', priceRange: '', location: '' });
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
      buttons={buttons}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 mt-15">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-0">Products</h1>

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
          <MobilePanel 
          onClose={() => setShowFilters(false)}
          children={
            <ProductsFilters 
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            filters={filters}
            handleFilterChange={handleFilterChange}
            clearFilters={clearFilters}
            />
          }
          />
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
    </div>
  );
};

export default ProductsUser;
