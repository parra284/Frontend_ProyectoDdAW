import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct, createProduct, updateProduct } from './productsService';
import { getButtons } from '../utils/buttonsPOS';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import FilterField from '../components/FilterField';
import { filterFields } from '../utils/filterFields';
import { productFields } from '../utils/formFields'
import ProductCard from './ProductCard';
import Form from '../components/Form';
import transformText from '../utils/transformText';

export default function POSAdminPage() {
  const navigate = useNavigate();

  //Fetch
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: '', availability: '', priceRange: '' });

  //Modals
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Navbar buttons
  const navbarButtons = getButtons(navigate);

  //Pagination
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const apiAdd = async (data) => {
    //FIX

    try {
      await createProduct(data);
      setProducts((prevProducts) => [...prevProducts, data]);
      alert('Product added successfully!');
      setModalType('');
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Failed to add product. Please try again.');
    }
  };

  const apiUpdate = async (data) => {
    //FIX
    try {
      await updateProduct(data);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? data : product
        )
      );
      setModalType('');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const apiDelete = async (id) => {
    // FIX
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    const existingProduct = products.find((product) => product.id === id);

    if (!existingProduct) {
      alert('Product not found. Unable to delete.');
      return;
    }

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

  const handleUpdate = (data) => {
    setModalType('update');
    setModalData(data);
  };

  const handleClose = () => {
    setModalType('');
    setModalData(null);
  }

  const modals = [
    {
      type:"register",
      onSubmit:(data) => apiAdd(data)
    },
    {
      type:"update",
      onSubmit:(data) => apiUpdate(data)
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
      <Navbar 
      buttons={navbarButtons}
      />
      <div className="flex">
        {/* Sidebar */}
        <div className="mx-10 mt-10 bg-dark-blue p-4 text-white rounded">
          <h2 className="text-lg font-bold">Filters</h2>
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="w-full p-2 mt-2 rounded"
            placeholder="Search..."
          />

          {
            filterFields.map((field) => (
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
                buttons={
                <>
                  <Button 
                    key="update"
                    label="Update product"
                    onClick={() => handleUpdate(product)}
                    width="w-1/2"
                  />
                  <Button 
                    key="delete"
                    label="Delete product"
                    onClick={() => apiDelete(product.id)}
                    width="w-1/2"
                  />
                </>
                }
              />
            ))}
          </div>

          <Button 
          label="Register product"
          //CHANGE WITH NEEDED ACTION
          onClick={() => setModalType('register')}
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

      {/* Modal (fix for scalability) */}
      {modalType !== '' && (
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            {modals.map((modal) => {
              if (modal.type === modalType) {
                return (
                  <Form 
                    key={modal.type}
                    type={transformText(modalType) + (modalData?.id ? " --- " + modalData.id : "")}
                    onSubmit={(data) => modal.onSubmit(data)}
                    fields={productFields}
                    defaultValues={modalData}
                  />
                );
              }
            })}
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:cursor-pointer"
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