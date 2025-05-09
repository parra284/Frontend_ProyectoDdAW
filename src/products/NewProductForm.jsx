import { useState } from "react";

export default function NewProductForm({ onProductAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    category: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form data
    if (!formData.name || !formData.sku || !formData.price || !formData.stock || !formData.category) {
      setError("All fields are required.");
      return;
    }

    if (isNaN(formData.price) || isNaN(formData.stock)) {
      setError("Price and stock must be valid numbers.");
      return;
    }

    try {
      const response = await fetch("https://back-db.vercel.app/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          sku: formData.sku,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
          category: formData.category,
        }),
      });

      if (!response.ok) throw new Error("Failed to add product.");

      const newProduct = await response.json();
      onProductAdded(newProduct);
      setFormData({ name: "", sku: "", price: "", stock: "", category: "" });
      alert("Product added successfully!");
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block mb-1">Product Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">SKU</label>
        <input
          type="text"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Stock</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add Product
      </button>
    </form>
  );
}