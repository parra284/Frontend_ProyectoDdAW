import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const UserProductPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

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

  const handleProductSelection = (productId, quantity) => {
    setSelectedProducts((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/orders', {
        products: selectedProducts,
        posId: 'example-pos-id', // Replace with actual POS ID
      });
      alert('Order created successfully!');
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
          <button
            className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </header>

        {showFilters && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm transition-all duration-200 ease-in-out">
            <div className="sm:flex sm:space-x-4">
              <div className="mb-3 sm:mb-0 sm:flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search products..."
                />
              </div>
              <div className="sm:flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="">All Categories</option>
                  <option value="coffee">Coffee</option>
                  <option value="tea">Tea</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm sm:text-base text-gray-600">Total Items: <span className="font-medium">{products.length}</span></p>
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
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-40 sm:h-48 object-cover" 
                  onError={(e) => {e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}}
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

        {products.length === 0 && (
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

export default UserProductPage;
