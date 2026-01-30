// frontend/src/api/contactApi.js
import { api } from './axios';

export const submitContactForm = async (formData) => {
    try {
        const response = await api.post('/contact/submit', formData);
        return response.data;
    } catch (error) {
        console.error('Error submitting contact form:', error);
        throw error;
    }
};

export const getContactInquiries = async () => {
    try {
        const response = await api.get('/contact/inquiries');
        return response.data;
    } catch (error) {
        console.error('Error fetching contact inquiries:', error);
        throw error;
    }
};
