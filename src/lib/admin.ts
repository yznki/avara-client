import axios from 'axios';
import { API_BASE_URL } from './api';

export const getAllUsers = async (token: string) =>
  axios.get(`${API_BASE_URL}/user/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAllAccounts = async (token: string) =>
  axios.get(`${API_BASE_URL}/admin/accounts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const getAdminTransactions = async (token: string) =>
  axios.get(`${API_BASE_URL}/admin/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteUser = async (userId: string, token: string) =>
  axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
