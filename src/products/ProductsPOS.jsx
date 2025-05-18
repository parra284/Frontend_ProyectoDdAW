import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import RegisterProductModal from '../components/RegisterProductModal';
import { showNotification } from '../components/NotificationSystem';
import Sidebar from '../components/Sidebar';
import ProductsSection from './ProductsSection';
import { deleteProduct as deleteProductApi, updateProduct as updateProductApi, registerProduct as registerProductApi } from './productsService';

export default function ProductsPOS() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: '', availability: '', priceRange: '', location: '' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')) || {}; // Retrieve user info
  const userRole = user.role || 'guest'; // Default to 'guest' if no role is found;

  const buttons = [
    {
      label: "Products",
      path: "/products",
      roles: ["POS", "user"]
    },
    {
      label: "Orders",
      path: "/orders",
      roles: ["POS"]
    },
  ];

  const handleSearch = (e) => {
    console.log(e);
    
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

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
      await deleteProductApi(id);
      showNotification(`${productName} deleted successfully.`, 'success');
      if (refetchProducts) refetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification(`Failed to delete ${productName}: ${error.message}`, 'error');
    } finally {
      setProductToDelete(null);
    }
  };

  const handleUpdate = async (id, updatedProduct, refetchProducts) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('User role:', user?.role);
      
      // Check if user is authenticated before making API call
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        showNotification('You must be logged in to update products.', 'error');
        navigate('/login');
        return;
      }

      const response = await updateProductApi(id, updatedProduct);
      if (response.status === 200) {
        showNotification('Product updated successfully!', 'success');
        if (typeof refetchProducts === 'function') refetchProducts();
      }
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.response && error.response.status === 401) {
        // The interceptor in apiClient should handle the 401 and redirect if token refresh fails
        // But we'll add this as a backup
        showNotification('Authentication required. Please log in again.', 'error');
        // Don't navigate here, let the apiClient interceptor handle it
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
  const openRegisterModal = () => setRegisterModalOpen(true);
  const extraButtons = [
    {
      label: "Register Product",
      onClick: openRegisterModal,
      className: "inline-flex items-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-ginora transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a 1 0 110 2h-3v3a 1 0 11-2 0v-3H6a 1 0 110-2h3V6a 1 0 011-1z" clipRule="evenodd" />
        </svg>
      )
    }
  ];  const cardButtons = [
  {
    label: "Update",
    className: "flex-1 bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded-lg text-sm font-ginora transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50",
    onClick: (product, refetchProducts) => {
      // Include all relevant product fields to ensure a complete update
      handleUpdate(product.id, {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        location: product.location,
        lowStockThreshold: product.lowStockThreshold,
        sku: product.sku
      }, refetchProducts);
    }
  },
  {
    label: "Delete",
    className: "flex-1 bg-secondary hover:bg-secondary/90 text-white px-3 py-1 rounded-lg text-sm font-ginora transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/50",
    onClick: (product) => {
      // Call initiateProductDelete with the current product
      initiateProductDelete(product);
    }
  }
];

const clearFilters = () => setFilters({ category: '', availability: '', priceRange: '', location: '' });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar buttons={buttons} userRole={userRole} />
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
            clearFilters={clearFilters}
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