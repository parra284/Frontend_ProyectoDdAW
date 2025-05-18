import { useState, useEffect } from 'react';
import axios from 'axios';
import { collection, onSnapshot, query } from 'firebase/firestore';
import db from '../utils/firebaseConfig';
import Navbar from '../components/Navbar';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import StockAdjustmentModal from '../components/StockAdjustmentModal';
import NotificationSystem, { showNotification } from '../components/NotificationSystem';

const InventoryDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [productToAdjust, setProductToAdjust] = useState(null);
  const [isBatchAdjustment, setIsBatchAdjustment] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: '', stockStatus: '' });
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(60);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [inventoryStats, setInventoryStats] = useState({
    totalProducts: 0,
    outOfStock: 0,
    lowStock: 0,
    inStock: 0,
    totalStockValue: 0
  });
  // Function to fetch products and inventory statistics
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const response = await axios.get('http://localhost:3000/api/products');
      if (response.status === 200 && response.data.products) {
        setProducts(response.data.products);
        setLastUpdate(new Date());
      }

      // Fetch inventory statistics
      const statsResponse = await axios.get('http://localhost:3000/api/products/inventory/statistics');
      if (statsResponse.status === 200 && statsResponse.data.statistics) {
        setInventoryStats(statsResponse.data.statistics);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching inventory data:', err);
      setError('Failed to load inventory data.');
    } finally {
      setLoading(false);
    }
  };

  // Set up initial data loading
  useEffect(() => {
    fetchProducts();
    
    // Set up auto-refresh if enabled
    let refreshTimer;
    if (autoRefresh) {
      refreshTimer = setInterval(() => {
        fetchProducts();
      }, refreshInterval * 1000);
    }
    
    return () => {
      if (refreshTimer) clearInterval(refreshTimer);
    };
  }, [autoRefresh, refreshInterval]);
  
  // Handle opening the stock adjustment modal for a single product
  const openStockAdjustmentModal = (product) => {
    setProductToAdjust(product);
    setIsBatchAdjustment(false);
    setStockModalOpen(true);
  };
  
  // Handle opening the stock adjustment modal for batch operations
  const openBatchStockAdjustmentModal = () => {
    setProductToAdjust(null);
    setIsBatchAdjustment(true);
    setStockModalOpen(true);
  };
  
  // Handle stock update from the modal
  const handleStockUpdated = (updatedProducts) => {
    // If it's an array, multiple products were updated
    if (Array.isArray(updatedProducts)) {
      setProducts(prevProducts => {
        const updatedProductMap = new Map(
          updatedProducts.map(product => [product.id, product])
        );
        
        return prevProducts.map(product => 
          updatedProductMap.has(product.id) 
            ? updatedProductMap.get(product.id) 
            : product
        );
      });
      
      showNotification(`${updatedProducts.length} products updated successfully`, 'success');
    } 
    // If it's a single product update
    else if (updatedProducts) {
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === updatedProducts.id ? updatedProducts : p
        )
      );
      
      showNotification(`${updatedProducts.name} stock updated successfully`, 'success');
    }
  };
  
  // Handle product deletion
  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/products/${productToDelete.id}`);
      setProducts(products.filter(product => product.id !== productToDelete.id));
      showNotification('Product deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting product:', err);
      showNotification(`Failed to delete product: ${err.message}`, 'error');
    } finally {
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const initiateProductDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setProductToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleProductAdded = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !filters.category || product.category === filters.category;
    
    const matchesStock = !filters.stockStatus || 
      (filters.stockStatus === 'in-stock' && product.stock > 0) ||
      (filters.stockStatus === 'low-stock' && product.stock > 0 && product.stock <= 10) ||
      (filters.stockStatus === 'out-of-stock' && product.stock === 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(products.map(product => product.category).filter(Boolean))];
  
  // Calculate inventory statistics
  const totalProducts = products.length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const inStockCount = products.filter(p => p.stock > 10).length;
  
  // Format date for display
  const formatDateTime = (date) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  // Function to handle product deletion
  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${productId}`);
      setProducts(products.filter(product => product.id !== productId));
      logProductDeletion(productId);
      showNotification('Product deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting product:', err);
      showNotification(`Failed to delete product: ${err.message}`, 'error');
    } finally {
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Notification System */}
      <NotificationSystem position="bottom-right" />
      
      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        product={productToDelete}
        onCancel={cancelDelete}
        onConfirm={handleDelete}
      />
      
      <NotificationSystem />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">        <header className="mb-6">          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bebas text-primary mb-2 md:mb-0">
              Inventory Dashboard
            </h1>
            <div className="flex items-center space-x-3">
              <a 
                href="/audit-logs" 
                className="text-primary hover:text-secondary text-sm font-ginora"
              >
                View Deletion History
              </a>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${networkStatus === 'online' ? 'bg-green-100 text-green-800' : 
                  networkStatus === 'offline' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'}`}>
                <span className={`h-2 w-2 rounded-full mr-1.5
                  ${networkStatus === 'online' ? 'bg-green-500' : 
                    networkStatus === 'offline' ? 'bg-red-500' : 
                    'bg-yellow-500'}`}></span>
                {networkStatus === 'online' ? 'Online' : 
                  networkStatus === 'offline' ? 'Offline' : 
                  'Server Error'}
              </span>              <button 
                onClick={() => fetchProducts()}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium font-ginora rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={loading}
                aria-label="Refresh inventory data"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Last updated: {formatDateTime(lastUpdate)}
          </p>
        </header>

        {/* Inventory stats overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{totalProducts}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">In Stock</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{inStockCount}</div>
                    <div className="ml-2 text-sm text-gray-500">
                      ({Math.round((inStockCount / totalProducts) * 100)}%)
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Low Stock</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{lowStockCount}</div>
                    <div className="ml-2 text-sm text-gray-500">
                      ({Math.round((lowStockCount / totalProducts) * 100)}%)
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Out of Stock</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{outOfStockCount}</div>
                    <div className="ml-2 text-sm text-gray-500">
                      ({Math.round((outOfStockCount / totalProducts) * 100)}%)
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-refresh and filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 font-ginora">
                  Search Products
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="search"
                    id="search"
                    className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-lg font-ginora"
                    placeholder="Search by name, SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 font-ginora">
                  Category
                </label>
                <select
                  id="category"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg font-ginora"
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="stockStatus" className="block text-sm font-medium text-gray-700 font-ginora">
                  Stock Status
                </label>
                <select
                  id="stockStatus"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg font-ginora"
                  value={filters.stockStatus}
                  onChange={(e) => setFilters({...filters, stockStatus: e.target.value})}
                >
                  <option value="">All Stock Status</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <div className="flex items-center h-full mt-6">
                  <div className="flex items-center">
                    <input
                      id="auto-refresh"
                      name="auto-refresh"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                    />
                    <label htmlFor="auto-refresh" className="ml-2 block text-sm text-gray-900">
                      Auto-refresh
                    </label>
                  </div>
                  
                  {autoRefresh && (
                    <div className="ml-4 flex items-center">
                      <label htmlFor="refresh-interval" className="block text-sm text-gray-700">
                        Interval:
                      </label>
                      <select
                        id="refresh-interval"
                        className="ml-2 block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={refreshInterval}
                        onChange={(e) => setRefreshInterval(Number(e.target.value))}
                      >
                        <option value="15">15s</option>
                        <option value="30">30s</option>
                        <option value="60">1m</option>
                        <option value="300">5m</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <div className="flex items-center justify-end h-full mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({ category: '', stockStatus: '' });
                    }}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-ginora rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error handling */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error Loading Inventory Data
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => fetchProducts()}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-ginora rounded-lg shadow-sm text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary/50"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && !error && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading inventory data...</span>
          </div>
        )}

        {/* Products inventory table */}
        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No products match your current filter criteria.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              SKU
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Stock
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <img 
                                      className="h-10 w-10 rounded-full object-cover"
                                      src={product.image || 'https://via.placeholder.com/150'} 
                                      alt={product.name}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                      }}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                      {product.name}
                                    </div>
                                    {product.description && (
                                      <div className="text-xs text-gray-500 max-w-xs truncate">
                                        {product.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{product.sku || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {product.category ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {product.category}
                                  </span>
                                ) : (
                                  <span className="text-sm text-gray-500">Uncategorized</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">${product.price}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="font-medium">{product.stock}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {product.stock === 0 ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                    Out of Stock
                                  </span>
                                ) : product.stock <= 10 ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Low Stock
                                  </span>
                                ) : (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    In Stock
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button
                                  onClick={() => initiateProductDelete(product)}
                                  className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                                  title="Remove product"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {deleteModalOpen && productToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={() => handleDeleteProduct(productToDelete.id)}
          product={productToDelete}
        />
      )}
      <NewProductForm onProductAdded={handleProductAdded} />
    </div>
  );
};

export default InventoryDashboard;
