import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, TOKEN_KEY } from './constants';
import { unwrapList } from './utils/doc';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', body, auth = false, isForm = false } = {}) {
  const headers = {};
  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  try {
    const res = await client.request({
      url: path,
      method,
      headers,
      data: body,
    });
    return res.data;
  } catch (err) {
    const data = err.response?.data;
    const error = new Error(data?.message || err.message || 'Request failed');
    error.status = err.response?.status;
    throw error;
  }
}

export const api = {
  trackPageView: (page) =>
    request('/stats/track', { method: 'POST', body: { page } }).catch(() => {}),

  getListings: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    ).toString();
    return request(`/listings${qs ? `?${qs}` : ''}`);
  },
  getListingFilters: () => request('/listings/filters'),
  countEnquiry: (id) => request(`/listings/${id}/enquire`, { method: 'POST' }).catch(() => {}),
  submitPiece: (formData) => request('/submissions', { method: 'POST', body: formData, isForm: true }),
  createEnquiry: (payload) => request('/enquiries', { method: 'POST', body: payload }),

  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: { username, password } }),
  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', {
      method: 'POST',
      auth: true,
      body: { currentPassword, newPassword },
    }),

  getStats: () => request('/stats', { auth: true }),
  getSubmissions: async (status) => {
    const data = await request(`/submissions${status ? `?status=${status}` : ''}`, { auth: true });
    return unwrapList(data, 'submissions');
  },
  getSubmission: (id) => request(`/submissions/${id}`, { auth: true }),
  setSubmissionStatus: (id, status, rejectionReason) =>
    request(`/submissions/${id}/status`, {
      method: 'PATCH',
      auth: true,
      body: { status, rejectionReason },
    }),
  approveSubmission: (id, title) =>
    request(`/submissions/${id}/approve`, { method: 'POST', auth: true, body: { title } }),

  getAdminListings: async () => {
    const data = await request('/listings/admin/all', { auth: true });
    return unwrapList(data, 'listings');
  },
  getAdminListing: (id) => request(`/listings/admin/${id}`, { auth: true }),
  createListing: (formData) =>
    request('/listings', { method: 'POST', auth: true, body: formData, isForm: true }),
  updateListing: (id, formData) =>
    request(`/listings/${id}`, { method: 'PUT', auth: true, body: formData, isForm: true }),
  setListingStatus: (id, body) =>
    request(`/listings/${id}/status`, { method: 'PATCH', auth: true, body }),
  reorderListings: (order) =>
    request('/listings/reorder', { method: 'PATCH', auth: true, body: { order } }),
  deleteListing: (id) => request(`/listings/${id}`, { method: 'DELETE', auth: true }),

  getEnquiries: async (status) => {
    const data = await request(`/enquiries${status ? `?status=${status}` : ''}`, { auth: true });
    return unwrapList(data, 'enquiries');
  },
  setEnquiryStatus: (id, status) =>
    request(`/enquiries/${id}/status`, { method: 'PATCH', auth: true, body: { status } }),
  bulkEnquiryStatus: (ids, status) =>
    request('/enquiries/bulk-status', { method: 'PATCH', auth: true, body: { ids, status } }),
  deleteEnquiry: (id) => request(`/enquiries/${id}`, { method: 'DELETE', auth: true }),
  exportEnquiriesUrl: `${API_BASE_URL}/enquiries/export`,
};
