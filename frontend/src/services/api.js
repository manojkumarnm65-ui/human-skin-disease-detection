import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skincare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for graceful error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      if (localStorage.getItem('skincare_token')) {
        localStorage.removeItem('skincare_token');
        localStorage.removeItem('skincare_user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (fullName, email, password, confirmPassword) =>
    api.post('/auth/register', { full_name: fullName, email, password, confirm_password: confirmPassword }),
  sendRegistrationOtp: (data) => api.post('/auth/send-registration-otp', data),
  verifyRegistrationOtp: (data) => api.post('/auth/verify-registration-otp', data),
  sendForgotPasswordOtp: (email) => api.post('/auth/forgot-password-otp', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  getSmtpStatus: () => api.get('/auth/smtp-status'),
  configureSmtp: (data) => api.post('/auth/smtp-config', data),
  sendTestEmail: (recipientEmail) => api.post('/auth/send-test-email', { recipient_email: recipientEmail }),
};

// Dashboard Services
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentPredictions: (limit = 5) => api.get(`/dashboard/recent-predictions?limit=${limit}`),
  getChartData: () => api.get('/dashboard/chart-data'),
};

// Prediction Services
export const predictionService = {
  analyzeImage: (formData) =>
    api.post('/predictions/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getHistory: (params = {}) => api.get('/predictions/history', { params }),
  getPredictionDetail: (id) => api.get(`/predictions/${id}`),
  deletePrediction: (id) => api.delete(`/predictions/${id}`),
  emailReport: (data) => api.post('/predictions/email-report', data),
};

// Diseases Information Services
export const diseaseService = {
  getDiseases: () => api.get('/diseases'),
  getDiseaseDetail: (slugOrId) => api.get(`/diseases/${slugOrId}`),
};

// Profile & Account Services
export const profileService = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.patch('/profile', data),
  changePassword: (data) => api.patch('/profile/password', data),
  deleteAccount: (password) => api.post(
    `/profile/delete-account?password=${encodeURIComponent(password)}`,
    { password, confirm_password: password },
    { headers: { 'x-confirmation-password': password } }
  ),
};

export default api;
