import { useState } from 'react';
import axios from 'axios';

export default function POSAdminPage() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Cappuccino',
      price: 2000,
      stock: 10,
      image: './assets/cappuccino.jpg',
      location: 'Vendor A',
    },
    {
      id: 2,
      name: 'Mocha',
      price: 2000,
      stock: 5,
      image: './assets/mocha.jpg',
      location: 'Vendor B',
    },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleUpdate = async (id, updatedProduct) => {
    try {
      const response = await axios.put(`https://back-db.vercel.app/api/products/${id}`, updatedProduct);
      if (response.status === 200) {
        alert('Product updated successfully!');
        setProducts((prevProducts) =>
          prevProducts.map((product) => (product.id === id ? { ...product, ...updatedProduct } : product))
        );
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">POS Admin</h1>
        <nav>
          <button className="mr-4">Products</button>
          <button>Orders</button>
        </nav>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 bg-blue-500 p-4 text-white">
          <h2 className="text-lg font-bold">Filters</h2>
          <input className="w-full p-2 mt-2 rounded" placeholder="Search..." />
          <div className="mt-4">
            <label>Location</label>
            <select className="w-full p-2 mt-2 rounded">
              <option>All</option>
              <option>Vendor A</option>
              <option>Vendor B</option>
            </select>
          </div>
          <div className="mt-4">
            <label>Availability</label>
            <select className="w-full p-2 mt-2 rounded">
              <option>All</option>
              <option>Available</option>
              <option>Out of Stock</option>
            </select>
          </div>
          <div className="mt-4">
            <label>Category</label>
            <select className="w-full p-2 mt-2 rounded">
              <option>All</option>
              <option>Drinks</option>
              <option>Food</option>
            </select>
          </div>
          <div className="mt-4">
            <label>Price</label>
            <input type="range" className="w-full mt-2" />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-4">
          <h1 className="text-2xl font-bold mb-4">Products</h1>
          {/* Updated grid layout for responsiveness */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="border p-4 rounded shadow">
                <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded" />
                <h2 className="text-lg font-bold mt-2">{product.name}</h2>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={product.price}
                    onChange={(e) =>
                      setProducts((prevProducts) =>
                        prevProducts.map((p) =>
                          p.id === product.id ? { ...p, price: parseFloat(e.target.value) } : p
                        )
                      )
                    }
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={product.stock}
                    onChange={(e) =>
                      setProducts((prevProducts) =>
                        prevProducts.map((p) =>
                          p.id === product.id ? { ...p, stock: parseInt(e.target.value, 10) } : p
                        )
                      )
                    }
                  />
                </div>
                <button
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleUpdate(product.id, { price: product.price, stock: product.stock })}
                >
                  Save Changes
                </button>
                <details className="mt-2">
                  <summary className="cursor-pointer">Vendor Details</summary>
                  <p>Location: {product.location}</p>
                </details>
              </div>
            ))}
          </div>
          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => alert('Register a new product')}
          >
            + Register product
          </button>
          <div className="mt-4 flex justify-center">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-4 py-2 mx-1 ${
                  currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
