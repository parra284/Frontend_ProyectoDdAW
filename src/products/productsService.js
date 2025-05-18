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
  return apiClient.delete(`/products/${id}`);
};

export const updateProduct = async (id, updatedProduct) => {
  return apiClient.put(`/products/${id}`, updatedProduct);
};

export const registerProduct = async (newProduct) => {
  return apiClient.post('/products', newProduct);
};