import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import RegisterProductModal from '../components/RegisterProductModal';
import { logProductDeletion } from '../utils/auditLogger';
import { showNotification } from '../components/NotificationSystem';
import Sidebar from '../components/Sidebar';
import ProductsSection from './ProductsSection';
import { deleteProduct as deleteProductApi, updateProduct as updateProductApi, registerProduct as registerProductApi } from './productsService';

export default function ProductsPOS() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: '', availability: '', priceRange: '', location: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const navigate = useNavigate();

  const buttons = [
    {
      label: "Products",
      action: () => navigate("/products")
    },
    {
      label: "Orders",
      action: () => navigate("/orders")
    },
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const initiateProductDelete = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setSelectedProduct(null);
    setDeleteModalOpen(false);
  };

  const initiateProductUpdate = (product) => {
    setSelectedProduct(product);
    setRegisterModalOpen(true);
  };

  // These handlers only handle API and notifications, not product state
  const handleDelete = async (reason, refetchProducts) => {
    if (!selectedProduct) return;

    const id = selectedProduct.id;
    const productName = selectedProduct.name;
    setDeleteModalOpen(false);

    try {
      await deleteProductApi(id);

      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id || '1';

      // Log the deletion to the audit system
      await logProductDeletion(userId, selectedProduct, reason);

      showNotification(`Product "${productName}" removed successfully!`, 'success');
      setSelectedProduct(null);

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

  const clearFilters = () => {
    setFilters({ category: '', availability: '', priceRange: '', location: '' });
    setSearchQuery('')
  }

  const extraButtons = [
    {
      label: "Register Product",
      onClick: () => setRegisterModalOpen(true),
      className: "inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
    }
  ];

  const cardButtons = [
  {
    label: "Update",
    className: "flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300",
    onClick: (product) => {
      // Call handleUpdate with the current product's id and updated fields
      initiateProductUpdate(product);
    },
    canDisable: false
  },
  {
    label: "Delete",
    className: "flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-300",
    onClick: (product) => {
      // Call initiateProductDelete with the current product
      initiateProductDelete(product);
    },
    canDisable: false
  }
];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar buttons={buttons} />
      <div className="max-w-7xl mx-auto mt-15">
        {/* Notification element - hidden by default */}
        <div id="notification" style={{ display: 'none' }} className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow-lg"></div>

        {/* Register Product Modal */}
        <RegisterProductModal
          isOpen={registerModalOpen}
          onCancel={() => {
            setRegisterModalOpen(false);
            setSelectedProduct(null);
          }}
          selectedProduct={selectedProduct}
          onConfirm={async (productData, productId) => {
            if (productId) {
              await handleUpdate(productId, productData, refetchProducts => refetchProducts && refetchProducts());
            } else {
              await handleRegisterProduct(productData, refetchProducts => refetchProducts && refetchProducts());
            }
            setSelectedProduct(null); // clear after either action
            setRegisterModalOpen(false);
          }}
        />

        {/* Delete confirmation modal */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          product={selectedProduct}
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