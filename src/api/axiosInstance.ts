import axios from 'axios';

/**
 * Axios instance for API communication with the Spring Boot Backend.
 * Includes base URL configuration and interceptors for JWT.
 */
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach JWT token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling (e.g., 401 Unauthorized)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized (e.g., clear token and redirect to login)
            localStorage.removeItem('token');
            // window.location.href = '/login'; // Optional: redirect to login
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
