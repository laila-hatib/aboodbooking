import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Visibility,
  Download,
  Refresh,
  ConfirmationNumber,
} from '@mui/icons-material';
import { ticketService } from '../../services/ticketService';

const TicketsManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getAllTickets();
      setTickets(data);
    } catch (error) {
      setError('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (ticket) => {
    setSelectedTicket(ticket);
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTicket(null);
  };

  const handleDownloadTicket = async (ticketId) => {
    try {
      await ticketService.downloadTicketPDF(ticketId);
    } catch (error) {
      setError('Failed to download ticket');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Tickets Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchTickets}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ticket Number</TableCell>
                <TableCell>Booking Reference</TableCell>
                <TableCell>Passenger</TableCell>
                <TableCell>Bus</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Travel Date</TableCell>
                <TableCell>Departure Time</TableCell>
                <TableCell>Seats</TableCell>
                <TableCell>Total Paid</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {ticket.ticket_number}
                    </Typography>
                  </TableCell>
                  <TableCell>{ticket.booking_details?.booking_reference}</TableCell>
                  <TableCell>{ticket.passenger_name}</TableCell>
                  <TableCell>{ticket.bus_title}</TableCell>
                  <TableCell>{ticket.route}</TableCell>
                  <TableCell>{ticket.travel_date}</TableCell>
                  <TableCell>{ticket.departure_time}</TableCell>
                  <TableCell>{ticket.seat_count}</TableCell>
                  <TableCell>TZS {ticket.total_paid}</TableCell>
                  <TableCell>
                    <Chip
                      label={ticket.is_printed ? 'Printed' : 'Generated'}
                      color={ticket.is_printed ? 'success' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(ticket)}
                        title="View Details"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDownloadTicket(ticket.id)}
                        title="Download PDF"
                      >
                        <Download />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ConfirmationNumber />
            Ticket Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedTicket.ticket_number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Booking Reference: {selectedTicket.booking_details?.booking_reference}
                  </Typography>
                </Box>
                <Chip
                  label={selectedTicket.is_printed ? 'Printed' : 'Generated'}
                  color={selectedTicket.is_printed ? 'success' : 'primary'}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Passenger
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedTicket.passenger_name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Bus
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedTicket.bus_title}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Route
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedTicket.route}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Travel Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedTicket.travel_date}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Departure Time
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedTicket.departure_time}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Seats Booked
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedTicket.seat_count}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Paid
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    TZS {selectedTicket.total_paid}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Generated On
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedTicket.generated_at).toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Important Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Please arrive at the departure point 30 minutes before departure time<br />
                  • Bring a valid ID for verification<br />
                  • This ticket is non-transferable<br />
                  • Keep this ticket safe throughout your journey
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {selectedTicket && (
            <Button
              onClick={() => handleDownloadTicket(selectedTicket.id)}
              variant="contained"
              startIcon={<Download />}
            >
              Download PDF
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketsManagement;
