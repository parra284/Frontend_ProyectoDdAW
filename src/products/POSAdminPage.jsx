import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function POSAdminPage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: '', availability: '', priceRange: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          category: filters.category,
          availability: filters.availability,
          priceRange: filters.priceRange,
          keyword: searchQuery,
        });
        const response = await fetch(`https://back-db.vercel.app/api/products?${queryParams}`);
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
        const data = await response.json();
        if (!Array.isArray(data.products)) throw new Error('Invalid data format');
        setProducts(data.products);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://back-db.vercel.app/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));

      alert('Product deleted successfully!');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleUpdate = async (id, updatedProduct) => {
    try {
      const response = await axios.put(`https://back-db.vercel.app/api/products/${id}`, updatedProduct);
      if (response.status === 200) {
        alert('Product updated successfully!');
        setProducts((prevProducts) =>
          prevProducts.map((product) => (product.id === id ? { ...product, ...updatedProduct } : product))
        );
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => {
        return (
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (filters.category ? product.category === filters.category : true) &&
          (filters.availability ? product.availability === filters.availability : true) &&
          (filters.priceRange ? product.price <= filters.priceRange : true)
        );
      })
    : [];

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="p-4">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="p-4">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white p-4 flex justify-between">
          <h1 className="text-xl font-bold">POS Admin</h1>
          <nav>
            <button className="mr-4">Products</button>
            <button>Orders</button>
          </nav>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/4 bg-blue-500 p-4 text-white">
            <h2 className="text-lg font-bold">Filters</h2>
            <input
              value={searchQuery}
              onChange={handleSearch}
              className="w-full p-2 mt-2 rounded"
              placeholder="Search..."
            />
            <div className="mt-4">
              <label>Category</label>
              <select name="category" className="w-full p-2 mt-2 rounded" onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home">Home</option>
              </select>
            </div>
            <div className="mt-4">
              <label>Availability</label>
              <select name="availability" className="w-full p-2 mt-2 rounded" onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
            <div className="mt-4">
              <label>Price</label>
              <input
                name="priceRange"
                type="range"
                className="w-full mt-2"
                onChange={(e) => handleFilterChange({ target: { name: 'priceRange', value: e.target.value } })}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="w-3/4 p-4">
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="border p-4 rounded shadow">
                  <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded" />
                  <h2 className="text-lg font-bold mt-2">{product.name}</h2>
                  <p>Category: {product.category}</p>
                  <p>Price: ${product.price}</p>
                  <p>Availability: {product.availability}</p>
                  <p>Location: {product.location}</p>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={product.price}
                      onChange={(e) =>
                        setProducts((prevProducts) =>
                          prevProducts.map((p) =>
                            p.id === product.id ? { ...p, price: parseFloat(e.target.value) } : p
                          )
                        )
                      }
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={product.stock}
                      onChange={(e) =>
                        setProducts((prevProducts) =>
                          prevProducts.map((p) =>
                            p.id === product.id ? { ...p, stock: parseInt(e.target.value, 10) } : p
                          )
                        )
                      }
                    />
                  </div>
                  <button
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => handleUpdate(product.id, { price: product.price, stock: product.stock })}
                  >
                    Save Changes
                  </button>
                  <button
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <button
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => alert('Register a new product')}
            >
              + Register product
            </button>
            <div className="mt-4 flex justify-center">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 mx-1 ${
                    currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}