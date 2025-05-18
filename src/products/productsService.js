import apiClient from '../utils/apiClient';

export const fetchProducts = async (filters, searchQuery) => {
  const queryParams = new URLSearchParams({
    category: filters.category,
    availability: filters.availability,
    priceRange: filters.priceRange,
    location: filters.location,
    keyword: searchQuery,
  });
  const response = await apiClient.get(`/products?${queryParams}`);
  return response.data.products;
};

export const deleteProduct = async (id) => {
  try {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const updateProduct = async (id, updatedProduct) => {
  try {
    const response = await apiClient.put(`/products/${id}`, {
      name: updatedProduct.name,
      price: updatedProduct.price,
      stock: updatedProduct.stock,
      category: updatedProduct.category,
      location: updatedProduct.location,
      posId: updatedProduct.posId, // Aseguramos que se envíe el posId
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const registerProduct = async (newProduct) => {
  try {
    const response = await apiClient.post('/products', {
      name: newProduct.name,
      price: newProduct.price,
      stock: newProduct.stock,
      category: newProduct.category,
      location: newProduct.location,
      posId: newProduct.posId, // Aseguramos que se envíe el posId
      description: newProduct.description || '',
      image: newProduct.image || '',
      sku: newProduct.sku || '',
      lowStockThreshold: newProduct.lowStockThreshold || 10,
    });
    return response.data;
  } catch (error) {
    console.error('Error registering product:', error);
    throw error;
  }
};