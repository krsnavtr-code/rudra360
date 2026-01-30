// frontend/src/api/ownerInfoApi.js
import { api as axios } from '../utils/api';

const handleError = (error) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    throw new Error(errorMessage);
};

export const getOwnerInfo = async () => {
    try {
        const response = await axios.get('/owner-info');
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const getAllOwnerInfo = async () => {
    try {
        const response = await axios.get('/owner-info/all');
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const createOrUpdateOwnerInfo = async (data) => {
    try {
        // Transform the data to match the expected format for multiple owners
        const owners = [];
        
        // If we have existing owners data, use it as a starting point
        if (data.owners && Array.isArray(data.owners)) {
            owners.push(...data.owners);
        } else {
            // For backward compatibility, convert single owner to array
            owners.push({
                name: data.nameOne,
                email: data.emailOne,
                callNumber: data.callNumberOne,
                whatsappNumber: data.whatsappNumberOne,
                telegramChannel: data.telegramChannelOne,
                isPrimary: true
            });
        }
        
        const payload = {
            ...data,
            owners
        };
        
        const response = await axios.post('/owner-info', payload);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const toggleStatus = async (id, isActive) => {
    try {
        const response = await axios.patch(`/owner-info/${id}/status`, { isActive });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const deleteOwner = async (ownerId) => {
    try {
        const response = await axios.delete(`/owner-info/owner/${ownerId}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};