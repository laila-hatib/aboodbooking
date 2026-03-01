import api from './api';

export const busService = {
  // Get all buses
  getAllBuses: async () => {
    const response = await api.get('/buses/');
    return response.data;
  },

  // Get bus details
  getBus: async (id) => {
    const response = await api.get(`/buses/${id}/`);
    return response.data;
  },

  // Search buses
  searchBuses: async (route, travelDate) => {
    const response = await api.get('/buses/search/', {
      params: { route, travel_date: travelDate },
    });
    return response.data;
  },

  // Create bus (admin only)
  createBus: async (busData) => {
    const response = await api.post('/buses/create/', busData);
    return response.data;
  },

  // Update bus (admin only)
  updateBus: async (id, busData) => {
    const response = await api.patch(`/buses/${id}/update/`, busData);
    return response.data;
  },

  // Delete bus (admin only)
  deleteBus: async (id) => {
    const response = await api.delete(`/buses/${id}/delete/`);
    return response.data;
  },
};
