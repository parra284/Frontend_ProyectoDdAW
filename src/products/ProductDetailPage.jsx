import React from 'react';

const ProductDetailPage = ({ product, onAccept }) => {
  if (!product) {
    return <p className="font-ginora text-primary">Loading...</p>;
  }
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bebas text-primary mb-4 sm:mb-6">{product.name}</h1>
      
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
            <p className="text-lg sm:text-xl font-semibold mb-2 font-ginora">Price: ${product.price}</p>
            <p className="mb-2 text-sm sm:text-base font-ginora">Stock: <span className={`${product.stock > 0 ? 'text-green-600' : 'text-secondary'} font-medium`}>{product.stock > 0 ? product.stock : 'Out of Stock'}</span></p>
            <div className="border-t my-4"></div>
            <h2 className="font-bebas mb-2 text-primary">Description:</h2>
            <p className="mb-4 text-sm sm:text-base text-gray-600 font-ginora">{product.description || 'No description available.'}</p>
          </div>
          
          <button
            className="mt-4 w-full sm:w-auto bg-primary text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-primary/90 transition duration-200 font-ginora focus:outline-none focus:ring-2 focus:ring-primary/50"
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
