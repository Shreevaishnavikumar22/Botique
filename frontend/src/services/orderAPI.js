import api from './api';

const orderAPI = {
  // Create new order
  createOrder: (orderData) => {
    return api.post('/orders', orderData);
  },

  // Get user's orders
  getUserOrders: (params = {}) => {
    return api.get('/orders', { params });
  },

  // Get single order
  getOrder: (orderId) => {
    return api.get(`/orders/${orderId}`);
  },

  // Cancel order
  cancelOrder: (orderId, reason) => {
    return api.put(`/orders/${orderId}/cancel`, { reason });
  },

  // Get order statistics
  getOrderStats: () => {
    return api.get('/orders/stats');
  },
};

export default orderAPI;
