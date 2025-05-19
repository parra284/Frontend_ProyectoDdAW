import { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';
import Navbar from '../components/Navbar';
import axios from 'axios';
import MobilePanel from '../components/MobilePanel';
import ProductsFilters from './ProductsFilters';
import ShoppingCart from './ShoppingCart';
import ProductsSection from './ProductsSection';

const ProductsUser = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ location: '', category: '', stock: '', priceRange: '' });
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

  const handleSubmit = async () => {
    console.log(selectedProducts);
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
          <ProductsSection 
          filters={filters}
          searchQuery={searchQuery}
          cardButtons={cardButtons}
          onProductsLoaded={setProducts}
          />
        
      </div>
    </div>
  );
};

export default ProductsUser;