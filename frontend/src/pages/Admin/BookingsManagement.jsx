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
  TextField,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Visibility,
  Edit,
  CheckCircle,
  Cancel,
  Refresh,
} from '@mui/icons-material';
import { bookingService } from '../../services/bookingService';
import { busService } from '../../services/busService';

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('view'); // view, edit, confirm, cancel
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (error) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = async (booking, type) => {
    setSelectedBooking(booking);
    setDialogType(type);
    
    if (type === 'edit') {
      setFormData({
        seats_booked: booking.seats_booked,
        travel_date: booking.travel_date,
      });
    }
    
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
    setFormData({});
  };

  const handleConfirmPayment = async () => {
    try {
      await bookingService.confirmPayment(selectedBooking.id);
      await fetchBookings();
      handleCloseDialog();
    } catch (error) {
      setError('Failed to confirm payment');
    }
  };

  const handleCancelBooking = async () => {
    try {
      await bookingService.cancelBooking(selectedBooking.id);
      await fetchBookings();
      handleCloseDialog();
    } catch (error) {
      setError('Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const renderDialogContent = () => {
    switch (dialogType) {
      case 'view':
        return (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Booking Reference
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking?.booking_reference}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Passenger
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking?.passenger_details?.first_name} {selectedBooking?.passenger_details?.last_name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Bus
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking?.bus_details?.title}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Route
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking?.bus_details?.route_display}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Travel Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking?.travel_date}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Departure Time
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking?.bus_details?.departure_time}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Seats Booked
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking?.seats_booked}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Price
                </Typography>
                <Typography variant="body1" gutterBottom>
                  TZS {selectedBooking?.total_price}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Payment Status
                </Typography>
                <Chip
                  label={selectedBooking?.payment_status_display}
                  color={getStatusColor(selectedBooking?.payment_status)}
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 'confirm':
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to confirm payment for this booking?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Booking: {selectedBooking?.booking_reference}<br />
              Amount: TZS {selectedBooking?.total_price}<br />
              Passenger: {selectedBooking?.passenger_details?.first_name} {selectedBooking?.passenger_details?.last_name}
            </Typography>
          </Box>
        );

      case 'cancel':
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to cancel this booking?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This action will refund the seats to the bus and cannot be undone.
            </Typography>
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Booking: {selectedBooking?.booking_reference}<br />
              Passenger: {selectedBooking?.passenger_details?.first_name} {selectedBooking?.passenger_details?.last_name}
            </Typography>
          </Box>
        );

      default:
        return null;
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
          Bookings Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchBookings}
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
                <TableCell>Booking Ref</TableCell>
                <TableCell>Passenger</TableCell>
                <TableCell>Bus</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Travel Date</TableCell>
                <TableCell>Seats</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {booking.booking_reference}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {booking.passenger_details?.first_name} {booking.passenger_details?.last_name}
                  </TableCell>
                  <TableCell>{booking.bus_details?.title}</TableCell>
                  <TableCell>{booking.bus_details?.route_display}</TableCell>
                  <TableCell>{booking.travel_date}</TableCell>
                  <TableCell>{booking.seats_booked}</TableCell>
                  <TableCell>TZS {booking.total_price}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.payment_status_display}
                      color={getStatusColor(booking.payment_status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(booking, 'view')}
                        title="View Details"
                      >
                        <Visibility />
                      </IconButton>
                      {booking.payment_status === 'pending' && (
                        <>
                          <IconButton
                            color="success"
                            onClick={() => handleOpenDialog(booking, 'confirm')}
                            title="Confirm Payment"
                          >
                            <CheckCircle />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDialog(booking, 'cancel')}
                            title="Cancel Booking"
                          >
                            <Cancel />
                          </IconButton>
                        </>
                      )}
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
          {dialogType === 'view' && 'Booking Details'}
          {dialogType === 'confirm' && 'Confirm Payment'}
          {dialogType === 'cancel' && 'Cancel Booking'}
        </DialogTitle>
        <DialogContent>
          {renderDialogContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {dialogType === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogType === 'confirm' && (
            <Button onClick={handleConfirmPayment} variant="contained" color="success">
              Confirm Payment
            </Button>
          )}
          {dialogType === 'cancel' && (
            <Button onClick={handleCancelBooking} variant="contained" color="error">
              Cancel Booking
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingsManagement;
