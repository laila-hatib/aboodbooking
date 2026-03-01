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
  Cancel,
  Refresh,
  Receipt,
  DirectionsBus,
  AttachMoney,
} from '@mui/icons-material';
import { bookingService } from '../services/bookingService';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      setError('Failed to fetch your bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(bookingId);
        await fetchMyBookings();
        handleCloseDialog();
      } catch (error) {
        setError('Failed to cancel booking');
      }
    }
  };

  const handleBookNewTrip = () => {
    navigate('/search');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Payment Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
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
          My Bookings
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchMyBookings}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            onClick={handleBookNewTrip}
          >
            Book New Trip
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Receipt sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No bookings found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You haven't made any bookings yet. Start by searching for buses!
          </Typography>
          <Button
            variant="contained"
            onClick={handleBookNewTrip}
            startIcon={<DirectionsBus />}
          >
            Search Buses
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} md={6} lg={4} key={booking.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {booking.bus_details?.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {booking.bus_details?.route_display}
                      </Typography>
                    </Box>
                    <Chip
                      label={getStatusText(booking.payment_status)}
                      color={getStatusColor(booking.payment_status)}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Reference:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {booking.booking_reference}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Date:
                      </Typography>
                      <Typography variant="body2">
                        {booking.travel_date}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Time:
                      </Typography>
                      <Typography variant="body2">
                        {booking.bus_details?.departure_time}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Seats:
                      </Typography>
                      <Typography variant="body2">
                        {booking.seats_booked}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Price:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        TZS {booking.total_price}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                
                <Box sx={{ p: 2, pt: 0 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenDialog(booking)}
                      startIcon={<Visibility />}
                    >
                      View Details
                    </Button>
                    {booking.payment_status === 'pending' && (
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleCancelBooking(booking.id)}
                        startIcon={<Cancel />}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Booking Details
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Booking Reference
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBooking.booking_reference}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Bus
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBooking.bus_details?.title}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Route
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBooking.bus_details?.route_display}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Travel Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBooking.travel_date}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Departure Time
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBooking.bus_details?.departure_time}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Seats Booked
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBooking.seats_booked}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Price
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    TZS {selectedBooking.total_price}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment Status
                  </Typography>
                  <Chip
                    label={getStatusText(selectedBooking.payment_status)}
                    color={getStatusColor(selectedBooking.payment_status)}
                    size="small"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Important Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Please arrive at the departure point 30 minutes before departure time<br />
                  • Bring a valid ID for verification<br />
                  • This booking is non-transferable<br />
                  • Keep your booking reference safe
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {selectedBooking?.payment_status === 'paid' && (
            <Button
              variant="contained"
              onClick={() => {
                navigate('/tickets');
                handleCloseDialog();
              }}
            >
              View Ticket
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookings;
