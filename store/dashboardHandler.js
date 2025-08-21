import {create} from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:3000/';

axios.defaults.withCredentials = true;


export const useAuthStore = create((set) => ({
  dashUser: null,
  error: null,
  updateDashboard: async(data) => {
    try {
      const response = await axios.post(`${API_URL}api/updatedashboard`, data);
      set({ dashUser: response.data.user });
    } catch (error) {
      set({ error: error.response.data.error });
    }
 
}
}));