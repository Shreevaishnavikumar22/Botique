import api from './api';

const authAPI = {
  // Login user
  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  // Register user
  register: (name, email, password, phone) => {
    return api.post('/auth/register', { name, email, password, phone });
  },

  // Logout user
  logout: () => {
    return api.post('/auth/logout');
  },

  // Get current user
  getMe: () => {
    return api.get('/auth/me');
  },

  // Update password
  updatePassword: (currentPassword, newPassword) => {
    return api.put('/auth/update-password', { currentPassword, newPassword });
  },

  // Forgot password
  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: (token, password) => {
    return api.post('/auth/reset-password', { token, password });
  },

  // Verify email
  verifyEmail: (token) => {
    return api.get(`/auth/verify-email/${token}`);
  },

  // Resend verification email
  resendVerification: (email) => {
    return api.post('/auth/resend-verification', { email });
  },
};

export default authAPI;
