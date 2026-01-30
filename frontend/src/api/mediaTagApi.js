import {api} from '../utils/api';

// Get all media tags
export const getMediaTags = async (params = {}) => {
  try {
    const response = await api.get('/media/tags', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error fetching media tags';
  }
};

// Get a single media tag by ID
export const getMediaTag = async (id) => {
  try {
    const response = await api.get(`/media/tags/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error fetching media tag';
  }
};

// Create a new media tag
export const createMediaTag = async (tagData) => {
  try {
    const response = await api.post('/media/tags', tagData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error creating media tag';
  }
};

// Update a media tag
export const updateMediaTag = async (id, tagData) => {
  try {
    const response = await api.patch(`/media/tags/${id}`, tagData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error updating media tag';
  }
};

// Delete a media tag
export const deleteMediaTag = async (id) => {
  try {
    await api.delete(`/media/tags/${id}`);
  } catch (error) {
    throw error.response?.data?.message || 'Error deleting media tag';
  }
};

// Get tag by slug
export const getMediaTagBySlug = async (slug) => {
  try {
    const response = await api.get(`/media/tags/slug/${slug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error fetching tag by slug';
  }
};

// Get media items by tag
export const getMediaByTag = async (id, params = {}) => {
  try {
    const response = await api.get(`/media/tags/${id}/media`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error fetching media by tag';
  }
};


export const updateMediaTags = async (mediaUrl, tagIds) => {
  try {
    const response = await api.patch('/media/tags/update-media', {
      mediaUrl,
      tagIds
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error updating media tags';
  }
};