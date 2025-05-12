import React from 'react';

const ProductDetailPage = ({ product, onAccept }) => {
  if (!product) {
    return <p>Loading...</p>;
  }
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">{product.name}</h1>
      
      <div className="md:flex md:space-x-6">
        <div className="md:w-1/2 mb-4 md:mb-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg shadow-md"
          />
        </div>
        
        <div className="md:w-1/2">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-lg sm:text-xl font-semibold mb-2">Price: ${product.price}</p>
            <p className="mb-2 text-sm sm:text-base">Stock: <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>{product.stock > 0 ? product.stock : 'Out of Stock'}</span></p>
            <div className="border-t my-4"></div>
            <h2 className="font-medium mb-2 text-gray-700">Description:</h2>
            <p className="mb-4 text-sm sm:text-base text-gray-600">{product.description || 'No description available.'}</p>
          </div>
          
          <button
            className="mt-4 w-full sm:w-auto bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onAccept}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
