import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Button from "../components/Button"
import { fetchProducts as fetchProductsApi } from "./productsService";

export default function ProductsSection({ filters, searchQuery, extraButtons = [], cardButtons, onProductsLoaded }) {
  const itemsPerPage = 5;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products when filters or searchQuery change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log(filters);
        console.log(searchQuery);
        
        const products = await fetchProductsApi(filters, searchQuery);
        
        setProducts(products);
        if (onProductsLoaded) {
          onProductsLoaded(products);
        }
        setError(null);
        setCurrentPage(1);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters, searchQuery]);

  console.log(products);

  // Pagination
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(products.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-red-700 text-sm">Error: {typeof error === "string" ? error : error?.message || "An unknown error occurred"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:w-3/4 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">
          Products ({products.length})
        </h1>
      </div>
      {products.length === 0 ? (
        <div className="bg-gray-50 p-6 text-center rounded-md border border-gray-200">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 m-4">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cardButtons={cardButtons} // <-- pass down
            />
          ))}
        </div>
      )}
      {extraButtons && extraButtons.map((btn, idx) => (
        <Button 
        key={idx}
        onClick={btn.onClick}
        label={btn.label}
        className="!w-1/4"
        />
      ))}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              &larr;
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium
                  ${currentPage === index + 1 
                    ? 'bg-blue-600 text-white border-blue-600 z-10' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              &rarr;
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}