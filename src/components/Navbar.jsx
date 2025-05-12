import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const modalRef = useRef(null);
  const profileButtonRef = useRef(null);
  const navigate = useNavigate();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    navigate("/login");
    localStorage.removeItem('accessToken');
  };

  // Handle escape key press for modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        toggleModal();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  // Focus management for modal
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      // Find the first focusable element
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    } else if (!isModalOpen && profileButtonRef.current) {
      // Return focus when modal closes
      profileButtonRef.current.focus();
    }
  }, [isModalOpen]);

  return (
    <div className="bg-gradient-to-r from-blue-700 to-purple-700 shadow-lg sticky top-0 z-40" role="navigation" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-white text-base sm:text-lg md:text-xl font-semibold">
              <span className="hidden sm:inline">Point of Sale</span>
              <span className="sm:hidden">POS</span>
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <button
              ref={profileButtonRef}
              className="text-white font-medium px-3 py-2 rounded-md text-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 transition-colors"
              onClick={toggleModal}
              aria-expanded={isModalOpen}
              aria-controls="profile-modal"
              aria-haspopup="dialog"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Profile
              </span>
            </button>
            <button
              className="text-white font-medium px-3 py-2 rounded-md text-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 transition-colors"
              onClick={() => navigate('/products')}
              aria-label="Go to products page"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
                Products
              </span>
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, toggle classes based on menu state */}
      <div 
        id="mobile-menu" 
        className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700 border-t border-blue-400">
          <button
            className="flex items-center text-white block w-full font-medium px-3 py-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-white text-sm"
            onClick={toggleModal}
            aria-expanded={isModalOpen}
            aria-controls="profile-modal"
            aria-haspopup="dialog"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Profile
          </button>
          <button
            className="flex items-center text-white block w-full font-medium px-3 py-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-white text-sm"
            onClick={() => navigate('/products')}
            aria-label="Go to products page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            Products
          </button>
        </div>
      </div>

      {/* Profile Modal with accessibility enhancements */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
          onClick={toggleModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-title"
          onKeyDown={(e) => {
            if (e.key === 'Escape') toggleModal();
          }}
        >
          <div
            id="profile-modal"
            ref={modalRef}
            className="relative w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden transform transition-all"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            <div className="bg-gradient-to-r from-blue-700 to-purple-700 px-4 py-3 sm:px-6">
              <h2 id="profile-title" className="text-lg font-medium text-white">
                Profile
              </h2>
              <button 
                onClick={toggleModal} 
                className="absolute top-3 right-3 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white p-1 rounded"
                aria-label="Close dialog"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <p id="profile-description" className="text-sm text-gray-500 mb-4">
                Manage your account settings here.
              </p>
              <button
                className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 shadow-md"
                onClick={handleLogout}
                aria-label="Log out of your account"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}