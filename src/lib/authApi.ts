import axios from 'axios'

// Separate axios instance for authentication endpoints
// Uses different base URL from main API
const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL || 'http://2306219575-be.hafizmuh.site/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': import.meta.env.VITE_API_KEY,
  },
})

// Request interceptor - no token needed for login
authApi.interceptors.request.use(
  (config) => {
    if (!config.headers['X-API-KEY']) {
      config.headers['X-API-KEY'] = import.meta.env.VITE_API_KEY
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for error handling
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  },
)

export default authApi