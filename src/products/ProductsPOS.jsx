import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct, createProduct, updateProduct } from './productsService';
import { getButtons } from '../utils/buttonsPOS';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import FilterField from '../components/FilterField';
import { fields } from '../utils/filterFields';
import ProductCard from './ProductCard';
import NewProductForm from './NewProductForm';

export default function POSAdminPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: '', availability: '', priceRange: '' });
  const [actualModalType, setModalType] = useState('');
  const [productId, setProductId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navbarButtons = getButtons(navigate);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  //Getting every product (fix query params)
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
        const response = await getProducts(queryParams);
        if (!Array.isArray(response.products)) throw new Error('Invalid response format');
        setProducts(response.products);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
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

  const handleAdd = async (data) => {
    //FIX

    try {
      console.log(data);
      
      await createProduct(data);
      setProducts((prevProducts) => [...prevProducts, data]);
      alert('Product added successfully!');
      setModalType('');
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleUpdate = async (data) => {
    //FIX
    try {
      const id = productId;
      console.log(id);
      console.log(data);
      
      
      await updateProduct(id, data)
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product.id === id ? { ...product, ...data } : product))
      );
      setProductId('');
      setModalType('');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    // FIX
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    console.log(id);

    try {
      await deleteProduct(id);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      alert('Product deleted successfully!');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
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

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleUpdateClick = (id) => {
    setProductId(id);
    setModalType('Update product');
  };

  const handleClose = () => {
    setModalType('');
    setProductId('');
  }

  const cardButtons = [
    {
      label:"Update product",
      onClick:(id) => handleUpdateClick(id),
      width:'w-1/2'
    },
    {
      label:"Delete product",
      onClick:(id) => handleDelete(id),
      width:'w-1/2'
    },
  ]

  const modals = [
    {
      type:"Register product",
      onSubmit:(data) => handleAdd(data)
    },
    {
      type:"Update product",
      onSubmit:(data) => handleUpdate(data)
    }
  ] 

  if (loading) {
    return (
      <div>
        <Navbar 
        buttons={navbarButtons}
        />
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
      <Navbar buttons={navbarButtons}/>
        <div className="flex">
          {/* Sidebar */}
          <div className="mx-10 mt-10 bg-dark-blue p-4 text-white rounded">
            <h2 className="text-lg font-bold">Filters</h2>
            <input
              value={searchQuery}
              onChange={handleSearch}
              className="w-full p-2 mt-2 rounded"
              placeholder="Search..."
            />

            {
              fields.map((field) => (
                <FilterField 
                key={field.name}
                name={field.name}
                options={field.options}
                onChange={handleFilterChange}
                />
              ))
            }

            <div className="mt-4">
              <label>Price</label>
              <input
                name="priceRange"
                type="range"
                className="w-full mt-2"
                onChange={(e) => handleFilterChange({ target: { name: 'priceRange', value: e.target.value } })}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 w-full mt-5">
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <div className='flex gap-4'>
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  category={product.category}
                  price={product.price}
                  location={product.location}
                  image={product.image}
                  stock={product.stock}
                  buttons={cardButtons.map((button) => {
                    return (
                      <Button 
                      key={button.label}
                      label={button.label}
                      onClick={() => button.onClick(product.id)}
                      width={button.width}
                    />
                    )
                    })
                  }
                />
              ))}

            </div>
            <Button 
            label="Register product"
            //CHANGE WITH NEEDED ACTION
            onClick={() => setModalType('Register product')}
            width="w-50"
            />

            <div className="mt-4 flex justify-center">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 mx-1 ${
                    currentPage === index + 1 ? 'bg-dark-blue text-white' : 'bg-gray-200'
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal */}
        {actualModalType !== '' && (
          <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg">
              {modals.map((modal) => {
                if (modal.type === actualModalType) {
                  return (
                    <NewProductForm 
                      key={modal.type}
                      type={modal.type}
                      onSubmit={(data) => modal.onSubmit(data)}
                    />
                  );
                }
              })}
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleClose()} // Close the modal
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
  );
}