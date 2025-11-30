import axios from 'axios'
import { getAuthToken } from './auth'

// Determine base URL based on environment
const getBaseURL = () => {
  // In development with Vite proxy, use relative path
  if (import.meta.env.DEV) {
    return '/api'
  }
  // In production, use full URL
  return import.meta.env.VITE_API_URL || 'http://2306203236-be.hafizmuh.site/api'
}

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': import.meta.env.VITE_API_KEY,
  },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (!config.headers['X-API-KEY']) {
      config.headers['X-API-KEY'] = import.meta.env.VITE_API_KEY
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
