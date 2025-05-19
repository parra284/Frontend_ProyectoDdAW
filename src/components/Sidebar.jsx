import ProductsFilters from "../products/ProductsFilters";

export default function Sidebar({
  searchQuery,
  handleSearch,
  filters,
  handleFilterChange,
  clearFilters
}) {
  return (
    <div className="block lg:w-1/4 bg-gradient-to-b from-blue-500 to-blue-600 p-4 sm:p-6 text-white">
      <ProductsFilters 
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        filters={filters}
        handleFilterChange={handleFilterChange}
        clearFilters={clearFilters}
      />
    </div>
  );
}