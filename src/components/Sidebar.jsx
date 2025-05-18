export default function Sidebar({
  searchQuery,
  handleSearch,
  filters,
  handleFilterChange,
  clearFilters
}) {
  return (
    <div className="block lg:w-1/4 bg-gradient-to-b from-blue-500 to-blue-600 p-4 sm:p-6 text-white">
      <h2 className="text-lg font-bold mb-4">Filters</h2>
      <div className="mb-4">
        <label className="block text-sm mb-1 font-medium">Search</label>
        <input
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 rounded text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          placeholder="Search..."
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm mb-1 font-medium">Location</label>
        <select
          name="location"
          className="w-full p-2 rounded text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          onChange={handleFilterChange}
          value={filters.location}
        >
          <option value="">All</option>
          <option value="Punto Verde">Punto Verde</option>
          <option value="Living Lab">Living Lab</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm mb-1 font-medium">Category</label>
        <select 
          name="category" 
          className="w-full p-2 rounded text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none" 
          onChange={handleFilterChange}
          value={filters.category}
        >
          <option value="">All</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="home">Home</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm mb-1 font-medium">Availability</label>
        <select 
          name="availability" 
          className="w-full p-2 rounded text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none" 
          onChange={handleFilterChange}
          value={filters.availability}
        >
          <option value="">All</option>
          <option value="in-stock">In Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm mb-1 font-medium">Price Range</label>
        <div className="flex items-center">
          <span>$0</span>
          <input
            name="priceRange"
            type="range"
            className="w-full mx-2"
            min="0" 
            max="1000"
            value={filters.priceRange || 0}
            onChange={(e) => handleFilterChange({ target: { name: 'priceRange', value: e.target.value } })}
          />
          <span>${filters.priceRange || 0}</span>
        </div>
      </div>
      <button 
        className="w-full bg-white text-blue-600 py-2 rounded font-medium hover:bg-gray-100 transition-colors mt-2 focus:outline-none focus:ring-2 focus:ring-white"
        onClick={clearFilters}
      >
        Clear Filters
      </button>
    </div>
  );
}