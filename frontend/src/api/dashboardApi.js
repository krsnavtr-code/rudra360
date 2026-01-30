// frontend/src/api/dashboardApi.js
import { api } from './axios';

export const getDashboardStats = async () => {
    try {
        const response = await api.get('/admin/dashboard/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};

export const getRecentUsers = async (limit = 5) => {
    try {
        const response = await api.get(`/admin/users?limit=${limit}&sort=-createdAt`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recent users:', error);
        throw error;
    }
};

export const getRecentProjects = async (limit = 5) => {
    try {
        const response = await api.get(`/admin/projects?limit=${limit}&sort=-createdAt`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recent projects:', error);
        throw error;
    }
};

export const getSystemHealth = async () => {
    try {
        const response = await api.get('/admin/system/health');
        return response.data;
    } catch (error) {
        console.error('Error fetching system health:', error);
        throw error;
    }
};
