import axios from 'axios';

export const API_BASE_URL = import.meta.env.PROD
  ? 'https://api.av4ra.com'
  : 'http://localhost:1234';

export const api = axios.create({
  baseURL: API_BASE_URL,
});
