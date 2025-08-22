import {create} from 'zustand';
import axios from 'axios';

// Use relative API base to work in all environments
const API_URL = '';

axios.defaults.withCredentials = true;


export const useAuthStore = create((set) => ({
  dashUser: null,
  error: null,
  updateDashboard: async(data) => {
    try {
      // Build multipart form data so files are transmitted correctly
      const formData = new FormData();
      if (data?.name !== undefined) formData.append('name', data.name);
      if (data?.email !== undefined) formData.append('email', data.email);
      if (data?.username !== undefined) formData.append('username', data.username);
      if (data?.bio !== undefined) formData.append('bio', data.bio);

      const profileFile = data?.profileImage?.[0];
      if (profileFile) formData.append('profileImage', profileFile);

      const bannerFile = data?.bannerImage?.[0];
      if (bannerFile) formData.append('bannerImage', bannerFile);

      const response = await axios.post(`${API_URL}/api/updatedashboard`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      set({ dashUser: response.data.user, error: null });
    } catch (error) {
      set({ error: error?.response?.data?.error || error.message });
    }
 
}
}));