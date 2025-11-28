import api from './api';

const cartAPI = {
  // Get user's cart
  getCart: () => {
    return api.get('/cart');
  },

  // Add item to cart
  addToCart: (productId, quantity = 1) => {
    return api.post('/cart/add', { productId, quantity });
  },

  // Update cart item quantity
  updateCartItem: (productId, quantity) => {
    return api.put(`/cart/update/${productId}`, { quantity });
  },

  // Remove item from cart
  removeFromCart: (productId) => {
    return api.delete(`/cart/remove/${productId}`);
  },

  // Clear entire cart
  clearCart: () => {
    return api.delete('/cart/clear');
  },

  // Get cart count
  getCartCount: () => {
    return api.get('/cart/count');
  },
};

export default cartAPI;
