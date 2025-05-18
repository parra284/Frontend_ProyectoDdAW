import React from 'react';

const ProductDetailPage = ({ product, onAccept, onAddToCart }) => {
  if (!product) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-gray-600 font-ginora">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Check if stockLevel is available (for user view) or fall back to stock (for admin view)
  const stockAmount = product.stockLevel !== undefined ? product.stockLevel : product.stock;
  const isInStock = stockAmount > 0;
  
  // Determine stock status text and styles
  const getStockStatusDisplay = () => {
    if (stockAmount === 0) {
      return {
        text: 'Out of Stock',
        className: 'text-secondary font-medium'
      };
    } else if (stockAmount <= 5) {
      return {
        text: `Low Stock (${stockAmount} remaining)`,
        className: 'text-amber-600 font-medium'
      };
    } else {
      return {
        text: `In Stock (${stockAmount} available)`,
        className: 'text-green-600 font-medium'
      };
    }
  };
  
  const stockStatus = getStockStatusDisplay();
  
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        <button
          onClick={onAccept}
          className="mr-2 p-2 rounded-full hover:bg-gray-100"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bebas text-primary">{product.name}</h1>
      </div>
      
      <div className="md:flex md:space-x-6">
        <div className="md:w-1/2 mb-4 md:mb-0">
          <img
            src={product.image || 'https://via.placeholder.com/600x400?text=No+Image'}
            alt={product.name}
            className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
            }}
          />
        </div>
        
        <div className="md:w-1/2">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <p className="text-2xl font-semibold font-ginora text-primary">${product.price}</p>
              <span className={`px-3 py-1 rounded-full ${isInStock ? 'bg-green-100' : 'bg-red-100'} ${stockStatus.className}`}>
                {stockStatus.text}
              </span>
            </div>
            
            {product.category && (
              <div className="mb-4">
                <span className="text-sm text-gray-500 block mb-1">Category:</span>
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                  {product.category}
                </span>
              </div>
            )}
            
            {product.location && (
              <div className="mb-4">
                <span className="text-sm text-gray-500 block mb-1">Location:</span>
                <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm">
                  {product.location}
                </span>
              </div>
            )}
            
            <div className="border-t border-gray-200 my-4"></div>
            
            <div className="mb-6">
              <h2 className="font-bebas mb-2 text-primary text-lg">Description:</h2>
              <p className="mb-4 text-gray-700 font-ginora leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200 font-ginora focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={onAccept}
              >
                Back to Products
              </button>
              
              {isInStock && onAddToCart && (
                <button
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition duration-200 font-ginora focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center justify-center"
                  onClick={() => onAddToCart(product.id)}
                  disabled={!isInStock}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
