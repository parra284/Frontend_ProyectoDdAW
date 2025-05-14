import { useForm } from "react-hook-form";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { createOrder, getProducts } from './productsService';
import Input from '../components/Input';
import Button from "../components/Button";

const UserProductPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [cartModal, setCartModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState(() => {
    const savedCart = localStorage.getItem('shoppingCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.products);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  const handleCart = () => {
    localStorage.setItem('shoppingCart', JSON.stringify(selectedProducts))
  }

  useEffect(() => {
    console.log(selectedProducts); // Logs the updated state whenever it changes
    handleCart();
  }, [selectedProducts]);

  const handleAddProduct = (id) => {
    setAddModal(true);
    setProductId(id);
  }

  const handleProductSelection = (data) => {
    const quantity = data.quantity;
    setSelectedProducts((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
      }
      return [...prev, { productId, quantity }];
    });
    setAddModal(false);
  };

  const handleCartSubmit = async () => {
    //SHOPPING CART FUNCTION  
    try {
      await createOrder(selectedProducts);
      alert('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order.');
    }
  };

  return (
    <div className="p-4">
      <Navbar 
      buttons={[
        {
          label:"Cart",
          action: () => setCartModal(true)
        }
      ]}
      />
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Products</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </header>

      {showFilters && (
        <div className="mb-4">
          <input
            className="w-full p-2 border rounded mb-2"
            placeholder="Search products..."
          />
          <select className="w-full p-2 border rounded">
            <option value="">All Categories</option>
            <option value="coffee">Coffee</option>
            <option value="tea">Tea</option>
          </select>
        </div>
      )}

      <p className="mb-4">Total Items: {products.length}</p>

      {/* Updated grid layout for responsiveness */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <img src={product.image} alt={product.name} className="w-full h-32 object-cover mb-2" />
            <h2 className="text-lg font-bold mb-2">{product.name}</h2>
            <p className="mb-2">Price: ${product.price}</p>
            <p className="mb-2">Stock: {product.stock > 0 ? product.stock : 'SOLD OUT'}</p>
            {product.stock > 0 ? (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => handleAddProduct(product.id)}
              >
                Add to Cart
              </button>
            ) : (
              <button className="bg-gray-400 text-white px-4 py-2 rounded" disabled>
                SOLD OUT
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Shopping cart */}
      {cartModal && (
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>
              {localStorage.getItem('shoppingCart')}
            </p>

            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setCartModal(false)} // Close the modal
            >
              Close
            </button>

            <button
            className="mt-4 bg-dark-blue text-white px-4 py-2 rounded"
            onClick={() => handleCartSubmit()}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Add to cart */}
      {addModal && (
        <div className="fixed inset-0 flex justify-center items-center">
          <form
            className='flex flex-col items-center justify-around w-full max-w-md p-4 bg-white bg-opacity-90 rounded-lg shadow-md'
            onSubmit={handleSubmit(handleProductSelection)}
            aria-labelledby="form-title"
          >
            <h2 id="form-title" className='text-dark-blue text-3xl font-bold'>add</h2>
            
            <Input
              {...register("quantity")}
            />

            <Button type="submit" label={"add"} />

            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setAddModal(false)} // Close the modal
            >
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserProductPage;
