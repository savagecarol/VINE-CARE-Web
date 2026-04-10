export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost/api';

export const getHeaders = (token) => ({
  Authorization: `token ${token}`,
});