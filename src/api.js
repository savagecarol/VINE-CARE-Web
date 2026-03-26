export const API_BASE = 'http://vine-care-lb-1294828154.us-east-1.elb.amazonaws.com/api';

export const getHeaders = (token) => ({
  Authorization: `token ${token}`,
});