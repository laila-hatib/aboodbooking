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
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Visibility,
  Download,
  Refresh,
  ConfirmationNumber,
  DirectionsBus,
  AttachMoney,
  QrCode,
} from '@mui/icons-material';
import { ticketService } from '../services/ticketService';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getMyTickets();
      setTickets(data);
    } catch (error) {
      setError('Failed to fetch your tickets');
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

  const getStatusColor = (isPrinted) => {
    return isPrinted ? 'success' : 'primary';
  };

  const getStatusText = (isPrinted) => {
    return isPrinted ? 'Printed' : 'Generated';
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
          My Tickets
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchMyTickets}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {tickets.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ConfirmationNumber sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tickets found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You don't have any tickets yet. Complete your bookings to generate tickets!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tickets are generated automatically after payment confirmation.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {tickets.map((ticket) => (
            <Grid item xs={12} md={6} lg={4} key={ticket.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {ticket.bus_title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ticket.route}
                      </Typography>
                    </Box>
                    <Chip
                      label={getStatusText(ticket.is_printed)}
                      color={getStatusColor(ticket.is_printed)}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Ticket:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {ticket.ticket_number}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Date:
                      </Typography>
                      <Typography variant="body2">
                        {ticket.travel_date}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Time:
                      </Typography>
                      <Typography variant="body2">
                        {ticket.departure_time}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Seats:
                      </Typography>
                      <Typography variant="body2">
                        {ticket.seat_count}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Paid:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        TZS {ticket.total_paid}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <Box sx={{ 
                      p: 2, 
                      border: '2px dashed #ccc', 
                      borderRadius: 1,
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <QrCode sx={{ fontSize: 48, color: '#ccc' }} />
                      <Typography variant="caption" color="text.secondary" display="block">
                        QR Code for Boarding
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                
                <Box sx={{ p: 2, pt: 0 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenDialog(ticket)}
                      startIcon={<Visibility />}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleDownloadTicket(ticket.id)}
                      startIcon={<Download />}
                    >
                      Download PDF
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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
                  label={getStatusText(selectedTicket.is_printed)}
                  color={getStatusColor(selectedTicket.is_printed)}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
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

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box sx={{ 
                  p: 3, 
                  border: '2px dashed #ccc', 
                  borderRadius: 2,
                  textAlign: 'center',
                  width: '200px'
                }}>
                  <QrCode sx={{ fontSize: 64, color: '#ccc' }} />
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    QR Code for Boarding
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Boarding Instructions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Please arrive at the departure point 30 minutes before departure time<br />
                  • Bring a valid ID for verification<br />
                  • Show this ticket (printed or digital) at the boarding point<br />
                  • Keep this ticket safe throughout your journey<br />
                  • This ticket is non-transferable and valid only for the specified date and time
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

export default MyTickets;
