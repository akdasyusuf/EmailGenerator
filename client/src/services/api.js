import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add user ID to headers if available
    const userId = localStorage.getItem('userId');
    if (userId) {
      config.headers['user-id'] = userId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Search API
export const searchAPI = {
  search: (query, location, sort = 'price_asc', limit = 20) =>
    api.get('/search', { params: { query, location, sort, limit } }),
  
  getSuggestions: (query, limit = 10) =>
    api.get('/search/suggestions', { params: { query, limit } }),
  
  getPopularSearches: (limit = 10, days = 7) =>
    api.get('/search/popular', { params: { limit, days } }),
};

// Products API
export const productsAPI = {
  getAll: (page = 1, limit = 20, category, brand, sort = 'name_asc') =>
    api.get('/products', { params: { page, limit, category, brand, sort } }),
  
  getById: (id) => api.get(`/products/${id}`),
  
  getCategories: () => api.get('/products/categories/list'),
  
  getBrands: () => api.get('/products/brands/list'),
};

// Stores API
export const storesAPI = {
  getAll: () => api.get('/stores'),
  
  getById: (id) => api.get(`/stores/${id}`),
  
  getStats: (id, days = 30) => api.get(`/stores/${id}/stats`, { params: { days } }),
};

// Affiliate API
export const affiliateAPI = {
  redirect: (productId, storeId) => 
    api.get(`/affiliate/redirect/${productId}/${storeId}`),
  
  getStats: (days = 30, storeId) => 
    api.get('/affiliate/stats', { params: { days, store_id: storeId } }),
  
  getTopProducts: (days = 30, limit = 10) => 
    api.get('/affiliate/top-products', { params: { days, limit } }),
  
  updateUrls: (storeId, affiliateUrls) => 
    api.put('/affiliate/update-urls', { store_id: storeId, affiliate_urls: affiliateUrls }),
};

// Location API
export const locationAPI = {
  getAll: () => api.get('/locations'),
  
  getById: (id) => api.get(`/locations/${id}`),
  
  search: (query) => api.get(`/locations/search/${query}`),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;