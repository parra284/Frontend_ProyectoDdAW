import { useMemo, useCallback } from "react";

const ShoppingCart = ({ products, selectedProducts, setSelectedProducts, onSubmit }) => {
  const getProductById = useCallback((id) => products.find((p) => p.id === id), [products]);
  const getProductStock = (id) => getProductById(id)?.stock || 0;

  const handleCartQuantityChange = (productId, newQuantity) => {
    setSelectedProducts((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, Math.min(newQuantity, getProductStock(productId))) }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setSelectedProducts((prev) => prev.filter((item) => item.productId !== productId));
  };

  const cartTotal = useMemo(() => {
    return selectedProducts.reduce((sum, item) => {
      const product = getProductById(item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }, [selectedProducts, products]);

  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-primary font-bebas">Shopping Cart</h2>
      {selectedProducts.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {selectedProducts.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;
              return (
                <li key={item.productId} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <span className="font-medium text-primary">{product.name}</span>
                    <div className="text-xs text-secondary">${product.price} x</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-2 py-1 bg-secondary text-white rounded hover:bg-tertiary"
                      onClick={() => handleCartQuantityChange(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={getProductStock(item.productId)}
                      value={item.quantity}
                      onChange={(e) =>
                        handleCartQuantityChange(item.productId, Number(e.target.value))
                      }
                      className="w-12 text-center border rounded border-primary focus:ring-primary"
                    />
                    <button
                      className="px-2 py-1 bg-gray-200 rounded"
                      onClick={() => handleCartQuantityChange(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= getProductStock(item.productId)}
                    >
                      +
                    </button>
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveFromCart(item.productId)}
                      title="Remove"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex justify-between items-center">
            <span className="font-semibold">Total:</span>
            <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
          </div>
          <button
            className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            onClick={onSubmit}
          >
            Checkout
          </button>
        </>
      )}
    </>
  );
};

export default ShoppingCart;
