import { useState } from "react";

export default function NewProductForm({ onProductAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    category: "",
  });
  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Real-time validation
    if (name === "price" || name === "stock") {
      if (isNaN(value) || value <= 0) {
        setError((prevError) => ({ ...prevError, [name]: `${name} must be a positive number.` }));
      } else {
        setError((prevError) => ({ ...prevError, [name]: "" }));
      }
    } else if (!value.trim()) {
      setError((prevError) => ({ ...prevError, [name]: `${name} is required.` }));
    } else {
      setError((prevError) => ({ ...prevError, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submission
    const newError = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newError[key] = `${key} is required.`;
      }
    });
    if (Object.keys(newError).length > 0) {
      setError(newError);
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
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>
      {Object.values(error).some((errMsg) => errMsg) && (
        <p className="text-red-500 mb-4">Please fix the errors below.</p>
      )}
      <div className="mb-4">
        <label className="block mb-1">Product Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
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
        {error.sku && <p className="text-red-500 text-sm">{error.sku}</p>}
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
        {error.price && <p className="text-red-500 text-sm">{error.price}</p>}
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
        {error.stock && <p className="text-red-500 text-sm">{error.stock}</p>}
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
        {error.category && <p className="text-red-500 text-sm">{error.category}</p>}
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add Product
      </button>
    </form>
  );
}