import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductDetailPage from './ProductDetailPage';
import ResponsiveContainer from '../components/ResponsiveContainer';
import NotificationSystem, { showNotification } from '../components/NotificationSystem';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = user.role || 'guest';
  
  const buttons = [
    {
      label: "Products",
      path: "/products",
      roles: ["user"]
    },
    {
      label: "Cart",
      path: "/cart",
      roles: ["user"]
    },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
        
        if (response.data && response.data.product) {
          setProduct(response.data.product);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    } else {
      setError('Product ID is required');
      setLoading(false);
    }
  }, [productId]);

  const handleGoBack = () => {
    navigate('/products');
  };

  const handleAddToCart = (productId) => {
    setSelectedProducts(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
    
    showNotification('Product added to cart!', 'success');
    
    // Store cart in localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      const updatedCart = cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      localStorage.setItem('cart', JSON.stringify([...cart, { productId, quantity: 1 }]));
    }
  };

  if (loading) {
    return (
      <ResponsiveContainer className="p-4">
        <Navbar buttons={buttons} userRole={userRole} />
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
            <p className="text-gray-600 font-ginora">Loading product details...</p>
          </div>
        </div>
      </ResponsiveContainer>
    );
  }

  if (error) {
    return (
      <ResponsiveContainer className="p-4">
        <Navbar buttons={buttons} userRole={userRole} />
        <div className="max-w-4xl mx-auto my-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-700">Error</h3>
                <p className="text-red-600">{error}</p>
                <button 
                  className="mt-3 bg-white text-red-700 px-4 py-2 rounded border border-red-700 hover:bg-red-50"
                  onClick={handleGoBack}
                >
                  Return to Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer className="p-4">
      <NotificationSystem position="bottom-right" />
      <Navbar buttons={buttons} userRole={userRole} />
      <ProductDetailPage 
        product={product} 
        onAccept={handleGoBack}
        onAddToCart={handleAddToCart}
      />
    </ResponsiveContainer>
  );
};

export default ProductDetails;
