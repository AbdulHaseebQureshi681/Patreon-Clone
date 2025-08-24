import {create} from 'zustand';
import axios from 'axios';
import {toReactCommentsTree} from '@/utils/comments';
// Use relative API base to work in all environments
const API_URL = '';
axios.defaults.withCredentials = true;


export const useCommentsStore = create((set) => ({
  error: null,
  comment: null,
  comments:[],
  finalComments:[],

  getComments: async(postid) => {
    try {
      const response = await axios.get(`${API_URL}/api/comments/${postid}`);
      set({ comments: response.data.comments, error: null });
      const finalComments = toReactCommentsTree(response.data.comments);
      set({ finalComments, error: null });
    } catch (error) {
      set({ error: error?.response?.data?.error || error.message });
    }
  },
  uploadComment: async({text , parentid ,userid ,comId,postid}) => {
    try {
      const response = await axios.post(`${API_URL}/api/comments`, {text , parentid ,userid ,comId,postid});
      set({ comment: response.data.comment, error: null });
    } catch (error) {
      set({ error: error?.response?.data?.error || error.message });
    }
  },
  deleteComment: async(comId) => {
    try {
      const response = await axios.delete(`${API_URL}/api/comments`, {data:{commentid:comId}});
      set({ comment: response.data.comment, error: null });
    } catch (error) {
      set({ error: error?.response?.data?.error || error.message });
    }
  },
  editComment: async(comId , text) => {
    try {
      const response = await axios.put(`${API_URL}/api/comments`,{commentid:comId, text:text});
      set({ comment: response.data.comment, error: null });
    } catch (error) {
      set({ error: error?.response?.data?.error || error.message });
    }
  }
}));