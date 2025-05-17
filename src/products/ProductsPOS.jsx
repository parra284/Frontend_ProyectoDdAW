import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import RegisterProductModal from '../components/RegisterProductModal';
import { logProductDeletion } from '../utils/auditLogger';
import apiClient from '../utils/apiClient';
import { showNotification } from '../components/NotificationSystem';

export default function ProductsPOS() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: '', availability: '', priceRange: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 5;  
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          category: filters.category,
          availability: filters.availability,
          priceRange: filters.priceRange,
          location: filters.location,
          keyword: searchQuery,
        });
        
        const response = await apiClient.get(`/products?${queryParams}`);
        const data = response.data;
        
        if (!Array.isArray(data.products)) throw new Error('Invalid data format');
        setProducts(data.products);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const openRegisterModal = () => setRegisterModalOpen(true);
  const closeRegisterModal = () => setRegisterModalOpen(false);

  const initiateProductDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setProductToDelete(null);
    setDeleteModalOpen(false);
  };  
  const handleDelete = async (reason) => {
    if (!productToDelete) return;
    
    const id = productToDelete.id;
    const productName = productToDelete.name;
    setDeleteModalOpen(false);

    try {
      setLoading(true);
        // Call the API to delete the product using apiClient
      await apiClient.delete(`/products/${id}`);

      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id || '1';  // Use the authenticated user's ID if available
      
      // Log the deletion to the audit system
      await logProductDeletion(userId, productToDelete, reason);

      // Update the products list in state
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
        // Show success message using notification system
      showNotification(`Product "${productName}" removed successfully!`, 'success');
      
      setProductToDelete(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      showNotification(`Failed to delete product: ${err.response?.data?.message || err.message}`, 'error');
      
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };  
  const handleUpdate = async (id, updatedProduct) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Debug info
      console.log('User role:', user?.role);
      
      const response = await apiClient.put(
        `/products/${id}`,
        updatedProduct
      );
        if (response.status === 200) {
        showNotification('Product updated successfully!', 'success');
        
        setProducts((prevProducts) =>
          prevProducts.map((product) => (product.id === id ? { ...product, ...updatedProduct } : product))
        );
      }
    } catch (error) {
      console.error('Error updating product:', error);
      
      if (error.response && error.response.status === 401) {
        showNotification('Authentication required. Please log in again.', 'error');
        navigate('/login');
      } else if (error.response && error.response.status === 403) {
        showNotification('You do not have permission to update products.', 'error');
      } else {
        showNotification('Failed to update product. Please try again.', 'error');
      }
    }
  };

  const handleRegisterProduct = async (newProduct) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/products', newProduct);
      if (response.status === 201 || response.status === 200) {
        setProducts((prev) => [...prev, response.data.product]);
        showNotification('Product registered successfully!', 'success');
        setRegisterModalOpen(false);
      }
    } catch (err) {
      console.error('Error registering product:', err);
      showNotification(`Failed to register product: ${err.response?.data?.message || err.message}`, 'error');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => {
        return (
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (filters.category ? product.category === filters.category : true) &&
          (filters.availability ? product.availability === filters.availability : true) &&
          (filters.priceRange ? product.price <= filters.priceRange : true) &&
          (filters.location ? product.location === filters.location : true)
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-700 text-sm">Error: {typeof error === 'string' ? error : error?.message || 'An unknown error occurred'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        {/* Notification element - hidden by default */}
        <div id="notification" style={{ display: 'none' }} className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow-lg"></div>
        
        <RegisterProductModal
          isOpen={registerModalOpen}
          onCancel={closeRegisterModal}
          onConfirm={handleRegisterProduct}
        />

        {/* Delete confirmation modal */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          product={productToDelete}
          onCancel={cancelDelete}
          onConfirm={handleDelete}
        />
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-md">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">POS Admin</h1>          <nav className="flex space-x-2 sm:space-x-4">
            <button className="px-3 py-1 sm:px-4 sm:py-2 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm sm:text-base font-medium">
              Products
            </button>
            <button 
              onClick={() => navigate('/inventory')}
              className="px-3 py-1 sm:px-4 sm:py-2 hover:bg-white hover:bg-opacity-20 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm sm:text-base font-medium"
            >
              Inventory
            </button>
            <button 
              onClick={() => navigate('/audit-logs')}
              className="px-3 py-1 sm:px-4 sm:py-2 hover:bg-white hover:bg-opacity-20 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm sm:text-base font-medium"
            >
              Audit Logs
            </button>
            <button className="px-3 py-1 sm:px-4 sm:py-2 hover:bg-white hover:bg-opacity-20 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm sm:text-base font-medium">
              Orders
            </button>
          </nav>
        </header>

        <div className="flex flex-col lg:flex-row">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden p-4 bg-white border-b">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
          
          {/* Sidebar - Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-1/4 bg-gradient-to-b from-blue-500 to-blue-600 p-4 sm:p-6 text-white`}>
            <h2 className="text-lg font-bold mb-4">Filters</h2>
            <div className="mb-4">
              <label className="block text-sm mb-1 font-medium">Search</label>
              <input
                value={searchQuery}
                onChange={handleSearch}
                className="w-full p-2 rounded text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                placeholder="Search..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1 font-medium">Location</label>
              <select
                name="location"
                className="w-full p-2 rounded text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                onChange={handleFilterChange}
                value={filters.location}
              >
                <option value="">All</option>
                <option value="Punto Verde">Punto Verde</option>
                <option value="Living Lab">Living Lab</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1 font-medium">Category</label>
              <select 
                name="category" 
                className="w-full p-2 rounded text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none" 
                onChange={handleFilterChange}
                value={filters.category}
              >
                <option value="">All</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home">Home</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1 font-medium">Availability</label>
              <select 
                name="availability" 
                className="w-full p-2 rounded text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none" 
                onChange={handleFilterChange}
                value={filters.availability}
              >
                <option value="">All</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1 font-medium">Price Range</label>
              <div className="flex items-center">
                <span>$0</span>
                <input
                  name="priceRange"
                  type="range"
                  className="w-full mx-2"
                  min="0" 
                  max="1000"
                  value={filters.priceRange || 0}
                  onChange={(e) => handleFilterChange({ target: { name: 'priceRange', value: e.target.value } })}
                />
                <span>${filters.priceRange || 0}</span>
              </div>
            </div>
            <button 
              className="w-full bg-white text-blue-600 py-2 rounded font-medium hover:bg-gray-100 transition-colors mt-2 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setFilters({ category: '', availability: '', priceRange: '', location: '' })}
            >
              Clear Filters
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">Products ({filteredProducts.length})</h1>
              <button
                className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                onClick={openRegisterModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Register Product
              </button>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="bg-gray-50 p-6 text-center rounded-md border border-gray-200">
                <p className="text-gray-500">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200">
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-40 sm:h-48 object-cover" 
                        onError={(e) => {e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}}
                      />
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {product.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-bold mb-2 line-clamp-1">{product.name}</h2>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="text-sm">
                          <span className="block text-gray-500">Price</span>
                          <span className="font-medium">${product.price}</span>
                        </div>
                        <div className="text-sm">
                          <span className="block text-gray-500">Stock</span>
                          <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock > 0 ? product.stock : 'Out of stock'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 border-t pt-3">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Update Price ($)</label>
                            <input
                              type="number"
                              className="w-full p-1.5 text-sm border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
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
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Update Stock</label>
                            <input
                              type="number"
                              className="w-full p-1.5 text-sm border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
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
                        </div>
                      </div>
                      
                      <div className="mt-3 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                        <button
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                          onClick={() => handleUpdate(product.id, { price: product.price, stock: product.stock })}
                        >
                          Save Changes
                        </button>                        <button
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                          onClick={() => initiateProductDelete(product)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}