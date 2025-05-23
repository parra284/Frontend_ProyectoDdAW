export default function ProductCard({ product, cardButtons }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200">
      <div className="relative">
        <img 
          src={product.image || null} 
          alt={product.name || 'No image available'} 
          className="w-full h-40 sm:h-48 object-cover" 
          onError={(e) => {e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}} 
        />
        <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
          {product.category}
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bebas mb-2 line-clamp-1">{product.name}</h2>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-sm font-ginora">
            <span className="block text-gray-500">Price</span>
            <span className="font-medium text-primary">${product.price}</span>
          </div>
          <div className="text-sm font-ginora">
            <span className="block text-gray-500">Stock</span>
            <span className={`font-medium ${product.stock > 0 ? 'text-secondary' : 'text-red-600'}`}>
              {product.stock > 0 ? product.stock : 'Out of stock'}
            </span>
          </div>
        </div>
        
        <div className="mt-3 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          {cardButtons && cardButtons.map((btn, idx) => (
            <button
              key={idx}
              disabled={product.stock == 0 && btn.canDisable}
              className={`${btn.className} ${product.stock == 0 && btn.canDisable ? "!bg-gray-500"  : ""}`}
              onClick={() => btn.onClick(product)}
              type="button"
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
