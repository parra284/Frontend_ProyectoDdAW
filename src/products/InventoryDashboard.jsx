import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import NewProductForm from "./NewProductForm";
import axios from 'axios';

export default function InventoryDashboard() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({ price: '', stock: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://back-db.vercel.app/api/products");
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid data format");
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const interval = setInterval(fetchProducts, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://back-db.vercel.app/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));

      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleProductAdded = (newProduct) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts]);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setUpdatedValues({ price: product.price, stock: product.stock });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    try {
      const response = await axios.put(`/api/products/${id}`, {
        price: parseFloat(updatedValues.price),
        stock: parseInt(updatedValues.stock, 10),
      });

      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === id
              ? { ...product, price: updatedValues.price, stock: updatedValues.stock }
              : product
          )
        );
        alert('Product updated successfully!');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setEditingProduct(null);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="p-4" role="status" aria-live="polite">
          <p>Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="p-4" role="alert">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Inventory Dashboard</h1>
        <button
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setShowForm((prev) => !prev)}
          aria-expanded={showForm}
        >
          {showForm ? "Hide Form" : "Add New Product"}
        </button>
        {showForm && <NewProductForm onProductAdded={handleProductAdded} />}
        <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Stock</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingProduct?.id === product.id ? (
                    <input
                      type="number"
                      name="price"
                      value={updatedValues.price}
                      onChange={handleInputChange}
                      className="border p-1 rounded w-full"
                      aria-label="Edit price"
                    />
                  ) : (
                    `$${product.price}`
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingProduct?.id === product.id ? (
                    <input
                      type="number"
                      name="stock"
                      value={updatedValues.stock}
                      onChange={handleInputChange}
                      className="border p-1 rounded w-full"
                      aria-label="Edit stock"
                    />
                  ) : (
                    product.stock
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingProduct?.id === product.id ? (
                    <div>
                      <button
                        onClick={() => handleSave(product.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 ml-2"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditClick(product)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}