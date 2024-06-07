import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Assuming your Express server is running on port 3001

const createFolder = async (folderName) => {
  try {
    const response = await axios.post(`${API_URL}/create-folder`, { folderName });
    return response.data;
  } catch (error) {
    throw new Error('Error creating folder:', error);
  }
};

const uploadFile = async (folderName, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folderName', folderName);

  try {
    const response = await axios.post(`${API_URL}/upload-file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error uploading file:', error);
  }
};

const deleteFile = async (folderName, fileName) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-file`, {
      data: { folderName, fileName },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error deleting file:', error);
  }
};

const deleteFolder = async (folderName) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-folder`, {
      data: { folderName },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw new Error('Error deleting folder');
  }
};


const getFolders = async () => {
  const response = await axios.get(`${API_URL}/folders`);
  return response.data;
};

const getFolderContents = async (folderName) => {
  const response = await axios.get(`${API_URL}/folders/${folderName}`);
  return response.data;
};

export { createFolder, uploadFile, deleteFile, getFolders, getFolderContents, deleteFolder };
