import apiClient from './axiosClient.js';

export const register = async (userData) => {
  const response = await apiClient.post('/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await apiClient.post('/login', credentials);
  return response.data;
};

export const refreshAccessToken = async (refreshToken) => {
  const response = await apiClient.post('/refresh-token', { refreshToken });
  return response.data;
};
