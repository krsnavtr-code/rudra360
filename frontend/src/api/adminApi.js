// frontend/src/api/adminApi.js
import { api } from './axios';

// Contact Inquiries
export const getContactInquiries = async (params = {}) => {
  try {
    const response = await api.get('/contact/inquiries', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching contact inquiries:', error);
    throw error;
  }
};

export const getInquiryById = async (id) => {
  try {
    const response = await api.get(`/contact/inquiries/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    throw error;
  }
};

export const updateInquiryStatus = async (id, data) => {
  try {
    const response = await api.put(`/contact/inquiries/${id}/status`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    throw error;
  }
};

export const addInquiryNote = async (id, content) => {
  try {
    const response = await api.post(`/contact/inquiries/${id}/notes`, { content });
    return response.data;
  } catch (error) {
    console.error('Error adding inquiry note:', error);
    throw error;
  }
};

export const deleteInquiry = async (id) => {
  try {
    const response = await api.delete(`/contact/inquiries/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    throw error;
  }
};
