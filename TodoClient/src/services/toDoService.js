
import axios from '../axiosConfig'

export default {
  getTasks: async () => {
    const result = await axios.get('/items')    
    return result.data;
  },

  addTask: async(name)=>{
   
    try {
      const response = await axios.post('/items', { Name:name,IsComplete:false });
      return response.data;
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  },

  setCompleted: async(id, isComplete)=>{
   
    try {
      const response = await axios.put(`/items/${id}`, { IsComplete:isComplete });
      return response.data;
    } catch (error) {
      console.error("Error setting task completion:", error);
      throw error;
    }
  },

  deleteTask:async(id)=>{
   
    try {
      const response = await axios.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
};
