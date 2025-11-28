import api from './api';

const productAPI = {
  // Get all products with filters
  getProducts: (params = {}) => {
    return api.get('/products', { params });
  },

  // Get single product
  getProduct: (productId) => {
    return api.get(`/products/${productId}`);
  },

  // Get featured products
  getFeaturedProducts: () => {
    return api.get('/products/featured');
  },

  // Get top rated products
  getTopRatedProducts: () => {
    return api.get('/products/top-rated');
  },

  // Get new arrivals
  getNewArrivals: () => {
    return api.get('/products/new-arrivals');
  },

  // Get categories
  getCategories: () => {
    return api.get('/products/categories');
  },

  // Get brands
  getBrands: () => {
    return api.get('/products/brands');
  },

  // Create product (admin only)
  createProduct: (productData) => {
    return api.post('/products', productData);
  },

  // Update product (admin only)
  updateProduct: (productId, productData) => {
    return api.put(`/products/${productId}`, productData);
  },

  // Delete product (admin only)
  deleteProduct: (productId) => {
    return api.delete(`/products/${productId}`);
  },
};

export default productAPI;
