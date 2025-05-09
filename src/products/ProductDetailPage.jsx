import React from 'react';

const ProductDetailPage = ({ product, onAccept }) => {
  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-64 object-cover mb-4"
      />
      <p className="mb-2">Price: ${product.price}</p>
      <p className="mb-2">Stock: {product.stock}</p>
      <p className="mb-4">Description: {product.description || 'No description available.'}</p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={onAccept}
      >
        Aceptar
      </button>
    </div>
  );
};

export default ProductDetailPage;
