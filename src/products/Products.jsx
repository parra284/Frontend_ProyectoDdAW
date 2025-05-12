import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Products() {
  const [products, setProducts] = useState([]); // Ensure products is initialized as an array
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ category: "", availability: "", priceRange: "" });
  const [error, setError] = useState(null); // Add error state
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          category: filters.category,
          availability: filters.availability,
          priceRange: filters.priceRange,
          keyword: searchQuery,
        });
        const response = await fetch(`https://back-db.vercel.app/api/products?${queryParams}`);
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
        const data = await response.json();
        if (!Array.isArray(data.products)) throw new Error("Invalid data format");
        setProducts(data.products);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

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

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => {
        return (
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (filters.category ? product.category === filters.category : true) &&
          (filters.availability ? product.availability === filters.availability : true) &&
          (filters.priceRange ? product.price <= filters.priceRange : true)
        );
      })
    : [];

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="p-4">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="p-4">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          className="border p-2 rounded w-full mb-4"
        />

        <div className="flex space-x-4 mb-4">
          <select name="category" onChange={handleFilterChange} className="border p-2 rounded">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home</option>
          </select>

          <select name="availability" onChange={handleFilterChange} className="border p-2 rounded">
            <option value="">All Availability</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <select name="priceRange" onChange={handleFilterChange} className="border p-2 rounded">
            <option value="">All Prices</option>
            <option value="50">Up to $50</option>
            <option value="100">Up to $100</option>
            <option value="200">Up to $200</option>
          </select>
        </div>

        {/* Updated grid layout for responsiveness */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded">
              <h2 className="text-lg font-bold">{product.name}</h2>
              <p>Category: {product.category}</p>
              <p>Price: ${product.price}</p>
              <p>Availability: {product.availability}</p>
              <p>Location: {product.location}</p>
              <button
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}