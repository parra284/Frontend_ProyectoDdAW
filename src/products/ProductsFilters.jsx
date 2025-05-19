import SelectFilter from "../components/SelectFilter"

export default function ProductsFilters({ searchQuery, handleSearch, filters, handleFilterChange, clearFilters }) {
  return (
    <>
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
      <SelectFilter
        label="Location"
        name="location"
        value={filters.location}
        onChange={handleFilterChange}
        options={["Punto Verde", "Living Lab"]}
      />
      <SelectFilter
        label="Category"
        name="category"
        value={filters.category}
        onChange={handleFilterChange}
        options={["cafeteria","almuerzos"]}
      />
      <SelectFilter
        label="Availability"
        name="availability"
        value={filters.availability}
        onChange={handleFilterChange}
        options={["in-stock", "out-of-stock"]}
      />
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
            onChange={(e) =>
              handleFilterChange({
                target: { name: "priceRange", value: e.target.value },
              })
            }
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
    </>
  );
}