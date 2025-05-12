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
        const response = await axios.get('https://back-db.vercel.app/api/products');
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

    <div className="p-4">
      <Navbar />
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Products</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </header>

      {showFilters && (
        <div className="mb-4">
          <input
            className="w-full p-2 border rounded mb-2"
            placeholder="Search products..."
          />
          <select className="w-full p-2 border rounded">
            <option value="">All Categories</option>
            <option value="coffee">Coffee</option>
            <option value="tea">Tea</option>
          </select>
        </div>
      )}

      <p className="mb-4">Total Items: {products.length}</p>

      {/* Updated grid layout for responsiveness */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <img src={product.image} alt={product.name} className="w-full h-32 object-cover mb-2" />
            <h2 className="text-lg font-bold mb-2">{product.name}</h2>
            <p className="mb-2">Price: ${product.price}</p>
            <p className="mb-2">Stock: {product.stock > 0 ? product.stock : 'SOLD OUT'}</p>
            {product.stock > 0 ? (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => handleProductSelection(product.id, 1)}
              >
                Add to Cart
              </button>
            ) : (
              <button className="bg-gray-400 text-white px-4 py-2 rounded" disabled>
                SOLD OUT
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        onClick={handleSubmit}
      >
        Submit Order
      </button>
    </div>
  );
};

export default UserProductPage;
