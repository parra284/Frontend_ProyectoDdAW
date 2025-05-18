import { useState, useEffect } from 'react';

export default function RegisterProductModal({ isOpen, onCancel, onConfirm, selectedProduct }) {
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    location: '',
  });

  useEffect(() => {
    if (selectedProduct) {
      setForm({
        name: selectedProduct.name || '',
        price: selectedProduct.price?.toString() || '',
        stock: selectedProduct.stock?.toString() || '',
        category: selectedProduct.category || '',
        location: selectedProduct.location || '',
      });
    } else {
      setForm({
        name: '',
        price: '',
        stock: '',
        category: '',
        location: '',
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
    };
    onConfirm(productData, selectedProduct?.id); // pass ID if updating
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4">
          {selectedProduct ? 'Update Product' : 'Register New Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Product Name"
            className="w-full p-2 border rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            className="w-full p-2 border rounded"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            className="w-full p-2 border rounded"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
          />
          <select
            name="category"
            className="w-full p-2 border rounded"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home</option>
          </select>
          <select
            name="location"
            className="w-full p-2 border rounded"
            value={form.location}
            onChange={handleChange}
            required
          >
            <option value="">Select Location</option>
            <option value="Punto Verde">Punto Verde</option>
            <option value="Living Lab">Living Lab</option>
          </select>
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              {selectedProduct ? 'Update' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
