export default function ProductCard({
  product,
  setProducts,
  cardButtons
}) {  return (
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
        <div className="mt-3 border-t pt-3">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 font-ginora">Update Price ($)</label>
              <input
                type="number"
                className="w-full p-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                value={product.price}
                onChange={(e) =>
                  setProducts((prevProducts) =>
                    prevProducts.map((p) =>
                      p.id === product.id ? { ...p, price: parseFloat(e.target.value) } : p
                    )
                  )
                }
              />
            </div>            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 font-ginora">Update Stock</label>
              <input
                type="number"
                className="w-full p-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                value={product.stock}
                onChange={(e) =>
                  setProducts((prevProducts) =>
                    prevProducts.map((p) =>
                      p.id === product.id ? { ...p, stock: parseInt(e.target.value, 10) } : p
                    )
                  )
                }
              />
            </div>
          </div>
        </div>        <div className="mt-3 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          {cardButtons && cardButtons.map((btn, idx) => (
            <button
              key={idx}
              className={`${btn.className} font-ginora rounded-lg`}
              onClick={() => btn.onClick(product, setProducts)}
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