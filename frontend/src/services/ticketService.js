import api from './api';

export const ticketService = {
  // Get user's tickets
  getMyTickets: async () => {
    const response = await api.get('/tickets/my/');
    return response.data;
  },

  // Get ticket details
  getTicket: async (id) => {
    const response = await api.get(`/tickets/${id}/`);
    return response.data;
  },

  // Download ticket PDF
  downloadTicketPDF: async (id) => {
    const response = await api.get(`/tickets/${id}/download/`, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ticket_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Get all tickets (admin only)
  getAllTickets: async () => {
    const response = await api.get('/tickets/all/');
    return response.data;
  },
};
