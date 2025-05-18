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
      const response = await fetch("http://localhost:3000/api/products", {
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
      onProductAdded(newProduct); // Notify parent component
      setFormData({ name: "", sku: "", price: "", stock: "", category: "" });
      alert("Product added successfully!");
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 border rounded-lg bg-white shadow-md max-w-md sm:max-w-lg mx-auto">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bebas text-primary mb-4 sm:mb-6">Add New Product</h2>
      
      {Object.values(error).some((errMsg) => errMsg) && (
        <div className="bg-red-50 border-l-4 border-secondary p-3 mb-5 rounded">
          <p className="text-red-700 text-sm sm:text-base font-ginora">Please fix the errors below.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700 font-ginora">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 sm:p-2.5 border border-gray-300 rounded-lg font-ginora focus:ring-2 focus:ring-primary focus:border-primary"
          />
          {error.name && <p className="text-secondary text-xs sm:text-sm mt-1 font-ginora">{error.name}</p>}
        </div>
        
        <div>
          <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700 font-ginora">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="w-full p-2 sm:p-2.5 border border-gray-300 rounded-lg font-ginora focus:ring-2 focus:ring-primary focus:border-primary"
          />
          {error.sku && <p className="text-secondary text-xs sm:text-sm mt-1 font-ginora">{error.sku}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700 font-ginora">Price</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm font-ginora">$</span>
            </div>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full pl-7 p-2 sm:p-2.5 border border-gray-300 rounded-lg font-ginora focus:ring-2 focus:ring-primary focus:border-primary"
              step="0.01"
            />
          </div>
          {error.price && <p className="text-secondary text-xs sm:text-sm mt-1 font-ginora">{error.price}</p>}
        </div>
        
        <div>
          <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700 font-ginora">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-2 sm:p-2.5 border border-gray-300 rounded-lg font-ginora focus:ring-2 focus:ring-primary focus:border-primary"
          />
          {error.stock && <p className="text-secondary text-xs sm:text-sm mt-1 font-ginora">{error.stock}</p>}
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700 font-ginora">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 sm:p-2.5 border border-gray-300 rounded-lg font-ginora focus:ring-2 focus:ring-primary focus:border-primary"
        />
        {error.category && <p className="text-secondary text-xs sm:text-sm mt-1 font-ginora">{error.category}</p>}
      </div>
      
      <button 
        type="submit" 
        className="w-full sm:w-auto bg-primary text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-ginora hover:bg-primary/90 transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        Add Product
      </button>
    </form>
  );
}