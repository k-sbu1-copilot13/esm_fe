import axios from 'axios';
import { message } from 'antd';

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
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for automatic token refresh on 401 errors
// and centralized error notification for 403, 404, 409
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const { data } = await axios.post('http://localhost:8080/api/auth/refresh', {
                    refreshToken,
                });

                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);

                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear storage and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Centralized error notification based on HTTP status code
        if (error.response) {
            const { status, data } = error.response;
            const errorMsg = data?.message || 'An unexpected error occurred';

            switch (status) {
                case 403:
                    message.error(errorMsg);
                    break;
                case 404:
                    message.error(errorMsg);
                    break;
                case 409:
                    message.warning(errorMsg);
                    break;
                // 400 (validation) and 500 (server error) are handled by individual components
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;

