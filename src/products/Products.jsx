import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ category: "", availability: "", priceRange: "" });

  useEffect(() => {
    // Fetch products from API (replace with actual API endpoint)
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://api.example.com/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filters.category ? product.category === filters.category : true) &&
      (filters.availability ? product.availability === filters.availability : true) &&
      (filters.priceRange ? product.price <= filters.priceRange : true)
    );
  });

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded">
              <h2 className="text-lg font-bold">{product.name}</h2>
              <p>Category: {product.category}</p>
              <p>Price: ${product.price}</p>
              <p>Availability: {product.availability}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}