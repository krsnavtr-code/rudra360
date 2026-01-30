import { api } from './axios';

// Helper: extract filename
const getFilename = (urlOrPath = '') => {
  if (!urlOrPath) return '';
  return urlOrPath.split(/[\\/]/).pop();
};

// Helper: generate media URL via API
export const getImageUrl = (filename) => {
  if (!filename) return '';
  const cleanFilename = filename.startsWith('http')
    ? getFilename(new URL(filename).pathname)
    : getFilename(filename);

  return `/upload/file/${encodeURIComponent(cleanFilename)}`;
};

// ================= MEDIA LIST =================

// Get all uploaded media
export const getUploadedImages = async () => {
  const response = await api.get('/upload/files');

  if (response.data?.data) {
    response.data.data = response.data.data.map(file => ({
      ...file,
      type: file.type || (file.mimetype?.startsWith('video/') ? 'video' : 'image'),
      url: file.url || getImageUrl(file.name || file.path),
      thumbnailUrl: file.thumbnailUrl || file.url || getImageUrl(file.name || file.path)
    }));
  }

  return response.data;
};

// ================= UPLOAD IMAGE =================

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  const result = response.data?.data || response.data;
  if (!result) return response.data;

  const filename = result.name || getFilename(result.path) || getFilename(result.url);

  return {
    ...result,
    url: getImageUrl(filename),
    type: 'image'
  };
};

// ================= UPLOAD VIDEO =================

export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 300000 // 5 min
  });

  const result = response.data?.data || response.data;
  if (!result) return response.data;

  const filename = result.name || getFilename(result.path) || getFilename(result.url);

  return {
    ...result,
    url: getImageUrl(filename),
    type: 'video'
  };
};

// ================= MEDIA USAGE CHECK =================

export const checkMediaUsage = async (url) => {
  try {
    const response = await api.get(`/media/check-usage?url=${encodeURIComponent(url)}`);
    return response.data;
  } catch (error) {
    console.error('Error checking media usage:', error);
    // If there's an error, assume the file is in use to be safe
    return { data: { isUsed: true, usageDetails: {} } };
  }
};

export const checkImageUsageBeforeDeletion = async (filename) => {
  const usageCheck = await checkMediaUsage(getImageUrl(filename));
  if (usageCheck.data.isUsed) {
    throw new Error(`Cannot delete file ${filename} as it is in use: ${JSON.stringify(usageCheck.data.usageDetails)}`);
  }
  return true;
};

// ================= DELETE MEDIA =================

export const deleteMediaFile = async (filename) => {
  await checkImageUsageBeforeDeletion(filename);
  const response = await api.delete(`/upload/file/${encodeURIComponent(filename)}`);
  return response.data;
};
