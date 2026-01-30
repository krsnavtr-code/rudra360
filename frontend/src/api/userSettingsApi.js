// frontend/src/api/userSettingsApi.js
import { api } from './axios';

export const getUserProfile = async () => {
    try {
        const response = await api.get('/user/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const updateProfile = async (profileData) => {
    try {
        const response = await api.put('/user/profile', profileData);
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export const updatePassword = async (passwordData) => {
    try {
        const response = await api.put('/user/password', passwordData);
        return response.data;
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
};

export const updatePreferences = async (preferences) => {
    try {
        const response = await api.put('/user/preferences', preferences);
        return response.data;
    } catch (error) {
        console.error('Error updating preferences:', error);
        throw error;
    }
};

export const updatePrivacySettings = async (privacySettings) => {
    try {
        const response = await api.put('/user/privacy', privacySettings);
        return response.data;
    } catch (error) {
        console.error('Error updating privacy settings:', error);
        throw error;
    }
};

export const uploadAvatar = async (formData) => {
    try {
        const response = await api.post('/user/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
    }
};

export const deleteAccount = async () => {
    try {
        const response = await api.delete('/user/account');
        return response.data;
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
};

export const exportUserData = async () => {
    try {
        const response = await api.get('/user/export-data', {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.error('Error exporting user data:', error);
        throw error;
    }
};

export const enableTwoFactor = async () => {
    try {
        const response = await api.post('/user/2fa/enable');
        return response.data;
    } catch (error) {
        console.error('Error enabling 2FA:', error);
        throw error;
    }
};

export const disableTwoFactor = async () => {
    try {
        const response = await api.post('/user/2fa/disable');
        return response.data;
    } catch (error) {
        console.error('Error disabling 2FA:', error);
        throw error;
    }
};
