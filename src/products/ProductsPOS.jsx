import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import RegisterProductModal from '../components/RegisterProductModal';
import { logProductDeletion } from '../utils/auditLogger';
import { showNotification } from '../components/NotificationSystem';
import Sidebar from '../components/Sidebar';
import ProductsSection from './ProductsSection';
import {
  deleteProduct as deleteProductApi,
  updateProduct as updateProductApi,
  registerProduct as registerProductApi
} from './productsService';

export default function ProductsPOS() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: '', availability: '', priceRange: '', location: '' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const navigate = useNavigate();

  const buttons = [
    {
      label: "Products",
      path: "/products"
    },
    {
      label: "Orders",
      path: "/orders"
    },
  ];

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

  // These handlers only handle API and notifications, not product state
  const handleDelete = async (reason, refetchProducts) => {
    if (!productToDelete) return;

    const id = productToDelete.id;
    const productName = productToDelete.name;
    setDeleteModalOpen(false);

    try {
      // Call the API to delete the product using the service
      await deleteProductApi(id);

      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id || '1';

      // Log the deletion to the audit system
      await logProductDeletion(userId, productToDelete, reason);

      showNotification(`Product "${productName}" removed successfully!`, 'success');
      setProductToDelete(null);

      // Refetch products in ProductsSection
      if (typeof refetchProducts === 'function') refetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      showNotification(`Failed to delete product: ${err.response?.data?.message || err.message}`, 'error');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleUpdate = async (id, updatedProduct, refetchProducts) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('User role:', user?.role);

      const response = await updateProductApi(id, updatedProduct);
      if (response.status === 200) {
        showNotification('Product updated successfully!', 'success');
        if (typeof refetchProducts === 'function') refetchProducts();
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

  const handleRegisterProduct = async (newProduct, refetchProducts) => {
    try {
      const response = await registerProductApi(newProduct);
      if (response.status === 201 || response.status === 200) {
        showNotification('Product registered successfully!', 'success');
        setRegisterModalOpen(false);
        if (typeof refetchProducts === 'function') refetchProducts();
      }
    } catch (err) {
      console.error('Error registering product:', err);
      showNotification(`Failed to register product: ${err.response?.data?.message || err.message}`, 'error');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const extraButtons = [
    {
      label: "Register Product",
      onClick: openRegisterModal,
      className: "inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  const cardButtons = [
  {
    label: "Update",
    className: "flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300",
    onClick: (product) => {
      // Call handleUpdate with the current product's id and updated fields
      handleUpdate(product.id, { price: product.price, stock: product.stock });
    }
  },
  {
    label: "Delete",
    className: "flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-300",
    onClick: (product) => {
      // Call initiateProductDelete with the current product
      initiateProductDelete(product);
    }
  }
];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar buttons={buttons} />
      <div className="max-w-7xl mx-auto">
        {/* Notification element - hidden by default */}
        <div id="notification" style={{ display: 'none' }} className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow-lg"></div>

        {/* Register Product Modal */}
        <RegisterProductModal
          isOpen={registerModalOpen}
          onCancel={closeRegisterModal}
          // Pass handler and let ProductsSection provide refetchProducts callback
          onConfirm={(newProduct, refetchProducts) => handleRegisterProduct(newProduct, refetchProducts)}
        />

        {/* Delete confirmation modal */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          product={productToDelete}
          onCancel={cancelDelete}
          // Pass handler and let ProductsSection provide refetchProducts callback
          onConfirm={(reason, refetchProducts) => handleDelete(reason, refetchProducts)}
        />

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar - Filters */}
          <Sidebar
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            filters={filters}
            handleFilterChange={handleFilterChange}
            clearFilters={() => setFilters({ category: '', availability: '', priceRange: '', location: '' })}
          />

          {/* Main Content */}
          <ProductsSection
            filters={filters}
            searchQuery={searchQuery}
            extraButtons={extraButtons}
            cardButtons={cardButtons}
          />
        </div>
      </div>
    </div>
  );
}