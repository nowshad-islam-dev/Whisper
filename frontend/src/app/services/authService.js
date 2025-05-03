import apiClient from './axiosClient.js';

export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data.data;
};

export const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data.data;
};

export const refreshAccessToken = async (refreshToken) => {
  const response = await apiClient.post('/auth/refresh-token', {
    refreshToken,
  });
  return response.data.data;
};
