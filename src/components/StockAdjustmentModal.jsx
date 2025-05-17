import { useState, useEffect } from 'react';
import axios from 'axios';
import { logStockAdjustment } from '../utils/auditLogger';

/**
 * Modal component for adjusting product stock levels
 * Supports both single product and batch adjustments
 */
const StockAdjustmentModal = ({ 
  isOpen, 
  onClose, 
  product, 
  products, 
  isBatch = false, 
  onStockUpdated 
}) => {
  const [quantity, setQuantity] = useState(0);
  const [adjustmentType, setAdjustmentType] = useState('add'); // 'add' or 'subtract'
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Reset form when modal opens with new product(s)
  useEffect(() => {
    if (isOpen) {
      setQuantity(0);
      setAdjustmentType('add');
      setReason('');
      setError(null);
      setAllSelected(false);
      setSearchQuery('');
      setFilterCategory('');
      
      if (isBatch && products) {
        setSelectedProducts([]);
      }
    }
  }, [isOpen, product, products, isBatch]);

  // Don't show modal if it's not open or if we don't have required data
  if (!isOpen) return null;
  if (!isBatch && !product) return null;
  if (isBatch && !products) return null;

  // Get unique categories for batch filter
  const categories = isBatch 
    ? [...new Set(products.filter(p => p.category).map(p => p.category))]
    : [];

  // Filter products based on search query and category filter
  const filteredProducts = isBatch 
    ? products.filter(p => {
        const matchesSearch = searchQuery 
          ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
          : true;
          
        const matchesCategory = filterCategory
          ? p.category === filterCategory
          : true;
          
        return matchesSearch && matchesCategory;
      })
    : [];
    
  // Handler for toggling selection of all products in batch mode
  const handleToggleAllProducts = () => {
    if (allSelected) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
    setAllSelected(!allSelected);
  };

  // Handler for toggling individual product selection
  const handleToggleProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!quantity || quantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for this adjustment');
      return;
    }

    // Calculate final quantity change
    const finalQuantity = adjustmentType === 'add' ? quantity : -quantity;
    
    try {
      setLoading(true);
      setError(null);

      if (isBatch) {
        // Ensure at least one product is selected for batch operations
        if (selectedProducts.length === 0) {
          setError('Please select at least one product');
          setLoading(false);
          return;
        }

        // Call API to update stock in batch
        const response = await axios.post(
          'http://localhost:3000/api/products/inventory/batch-update',
          { 
            items: selectedProducts.map(id => ({
              id,
              quantity: finalQuantity
            })),
            reason: reason
          }
        );

        if (response.status === 200 && response.data.products) {
          // Log each stock adjustment
          for (const updatedProduct of response.data.products) {
            const originalProduct = products.find(p => p.id === updatedProduct.id);
            if (originalProduct) {
              await logStockAdjustment(
                '1', // TODO: Replace with actual user ID
                originalProduct,
                finalQuantity,
                reason
              );
            }
          }

          // Update UI and close modal
          onStockUpdated(response.data.products);
          onClose();
        }
      } else {
        // Single product update
        const response = await axios.patch(
          `http://localhost:3000/api/products/${product.id}/stock`,
          { 
            quantity: finalQuantity,
            reason: reason
          }
        );

        if (response.status === 200 && response.data.product) {
          // Log the stock adjustment
          await logStockAdjustment(
            '1', // TODO: Replace with actual user ID
            product,
            finalQuantity,
            reason
          );

          // Update UI and close modal
          const updatedProduct = response.data.product;
          onStockUpdated(updatedProduct);
          onClose();
        }
      }
    } catch (err) {
      console.error('Error adjusting stock:', err);
      setError(err.response?.data?.message || 'Failed to adjust stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 overflow-y-auto z-50">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${isBatch ? 'sm:max-w-4xl' : 'sm:max-w-lg'} sm:w-full`}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {isBatch ? 'Batch Inventory Adjustment' : `Adjust Inventory for ${product?.name}`}
                </h3>
                
                {error && (
                  <div className="mt-3 mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Single product adjustment */}
                {!isBatch && product && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-4">
                      Current stock: <span className="font-medium">{product.stock}</span>
                      {product.lowStockThreshold && (
                        <> (Low stock threshold: <span className="font-medium">{product.lowStockThreshold}</span>)</>
                      )}
                    </p>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Adjustment Type
                        </label>
                        <div className="flex">
                          <button 
                            type="button"
                            className={`flex-1 py-2 px-3 rounded-l-md border ${adjustmentType === 'add' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300'}`}
                            onClick={() => setAdjustmentType('add')}
                          >
                            Add Inventory
                          </button>
                          <button 
                            type="button"
                            className={`flex-1 py-2 px-3 rounded-r-md border ${adjustmentType === 'subtract' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300'}`}
                            onClick={() => setAdjustmentType('subtract')}
                          >
                            Remove Inventory
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          id="quantity"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                          min="1"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                          Reason
                        </label>
                        <select
                          id="reason"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        >
                          <option value="">Select a reason...</option>
                          <option value="Restock">Restock</option>
                          <option value="Damaged">Damaged</option>
                          <option value="Expired">Expired</option>
                          <option value="Returned">Returned</option>
                          <option value="Correction">Inventory Correction</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {reason === 'Other' && (
                        <div className="mb-4">
                          <label htmlFor="customReason" className="block text-sm font-medium text-gray-700 mb-1">
                            Specify Reason
                          </label>
                          <input
                            type="text"
                            id="customReason"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter specific reason"
                          />
                        </div>
                      )}

                      <div className="mt-6 flex justify-between">
                        {adjustmentType === 'add' ? (
                          <p className="text-sm text-gray-600">New stock will be: <span className="font-medium">{product.stock + quantity}</span></p>
                        ) : (
                          <p className="text-sm text-gray-600">New stock will be: <span className="font-medium">{Math.max(0, product.stock - quantity)}</span></p>
                        )}
                      </div>
                    </form>
                  </div>
                )}

                {/* Batch product adjustment */}
                {isBatch && products && (
                  <div className="mt-4">
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                          Search Products
                        </label>
                        <input
                          type="text"
                          id="search"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Search by name or SKU"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      <div className="md:col-span-1">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                          Filter by Category
                        </label>
                        <select
                          id="category"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                        >
                          <option value="">All Categories</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Selection
                        </label>
                        <button 
                          type="button"
                          onClick={handleToggleAllProducts}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {allSelected ? 'Deselect All' : 'Select All Products'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-6 bg-gray-50 rounded-md max-h-40 overflow-y-auto">
                      {filteredProducts.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No products match your search criteria
                        </div>
                      ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th scope="col" className="px-3 py-2 w-8">
                                <input
                                  type="checkbox"
                                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                  checked={selectedProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                                  onChange={handleToggleAllProducts}
                                />
                              </th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                              </th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SKU
                              </th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                              </th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Current Stock
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                              <tr 
                                key={product.id}
                                className={`${selectedProducts.includes(product.id) ? 'bg-blue-50' : 'hover:bg-gray-50'} cursor-pointer`}
                                onClick={() => handleToggleProduct(product.id)}
                              >
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <input
                                    type="checkbox"
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    checked={selectedProducts.includes(product.id)}
                                    onChange={() => {}} // Handled by row click
                                    onClick={(e) => e.stopPropagation()} // Prevent double-toggle
                                  />
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{product.sku || 'N/A'}</div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{product.category || 'Uncategorized'}</div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{product.stock}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Adjustment Type
                          </label>
                          <div className="flex">
                            <button 
                              type="button"
                              className={`flex-1 py-2 px-3 rounded-l-md border ${adjustmentType === 'add' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300'}`}
                              onClick={() => setAdjustmentType('add')}
                            >
                              Add Inventory
                            </button>
                            <button 
                              type="button"
                              className={`flex-1 py-2 px-3 rounded-r-md border ${adjustmentType === 'subtract' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300'}`}
                              onClick={() => setAdjustmentType('subtract')}
                            >
                              Remove Inventory
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="batch-quantity" className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            id="batch-quantity"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                            min="1"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label htmlFor="batch-reason" className="block text-sm font-medium text-gray-700 mb-1">
                          Reason
                        </label>
                        <select
                          id="batch-reason"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        >
                          <option value="">Select a reason...</option>
                          <option value="Bulk Restock">Bulk Restock</option>
                          <option value="Inventory Count">Inventory Count</option>
                          <option value="Bulk Adjustment">Bulk Adjustment</option>
                          <option value="Data Migration">Data Migration</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {reason === 'Other' && (
                        <div className="mt-4">
                          <label htmlFor="batchCustomReason" className="block text-sm font-medium text-gray-700 mb-1">
                            Specify Reason
                          </label>
                          <input
                            type="text"
                            id="batchCustomReason"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter specific reason"
                          />
                        </div>
                      )}

                      <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              You are about to {adjustmentType === 'add' ? 'add' : 'remove'} <span className="font-medium">{quantity}</span> units {adjustmentType === 'add' ? 'to' : 'from'} <span className="font-medium">{selectedProducts.length}</span> selected products.
                            </p>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || (isBatch && selectedProducts.length === 0)}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                adjustmentType === 'add' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-yellow-600 hover:bg-yellow-700'
              } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                loading || (isBatch && selectedProducts.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Updating...' : 'Confirm Adjustment'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;
