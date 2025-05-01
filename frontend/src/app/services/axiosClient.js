import axios from 'axios';
import store from '../store.js';
import { setCredentials } from '../features/authSlice.js';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
});

// Request Interceptor: Add Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().auth;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// Response Interceptor: Handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },

  async (err) => {
    const originalRequest = err.config;

    // If the error is 401 and the request hasn't been retried yet
    if (err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh the access token
        const { refreshToken } = store.getState().auth;
        const { accessToken } = await refreshAccessToken(refreshToken);

        // Update the Redux state with the new access token
        store.dispatch(setCredentials({ accessToken }));

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Beared ${accessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        console.error('Failed to refresh token:', err);

        // Redirect to login page
        store.dispatch(logout());
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default apiClient;
