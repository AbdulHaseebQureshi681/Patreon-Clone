import {create} from 'zustand';
import axios from 'axios';
import {toReactCommentsTree} from '@/utils/comments';
// Use relative API base to work in all environments
const API_URL = '';
axios.defaults.withCredentials = true;


export const useChannelsStore = create((set) => ({
    error: null,
    channel: null,

 createChannel: async({channelType, channelId, channelName, members, channelData}) => {
   try {
     const response = await axios.post(`${API_URL}/api/chat/create-channel`, {
       channelType,
       channelId,
       channelName,
       members,
       channelData
     });
     set({ channel: response.data.channel, error: null });
   } catch (error) {
     set({ error: error?.response?.data?.error || error.message });
   }
 }
}));