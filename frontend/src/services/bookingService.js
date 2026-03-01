import api from './api';

export const bookingService = {
  // Create booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings/create/', bookingData);
    return response.data;
  },

  // Get user's bookings
  getMyBookings: async () => {
    const response = await api.get('/bookings/my/');
    return response.data;
  },

  // Get booking details
  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}/`);
    return response.data;
  },

  // Confirm payment (admin only)
  confirmPayment: async (id) => {
    const response = await api.post(`/bookings/${id}/confirm-payment/`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await api.post(`/bookings/${id}/cancel/`);
    return response.data;
  },

  // Get all bookings (admin only)
  getAllBookings: async () => {
    const response = await api.get('/bookings/all/');
    return response.data;
  },
};
