import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import {
  DirectionsBus,
  EventSeat,
  AttachMoney,
  Payment,
  ConfirmationNumber,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, travelDate, route } = location.state || {};
  
  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    seats_booked: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);

  const steps = ['Select Seats', 'Review Booking', 'Payment', 'Confirmation'];

  if (!bus || !travelDate) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          No bus selected. Please search for buses first.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/search')}>
          Search Buses
        </Button>
      </Box>
    );
  }

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      return;
    }

    if (activeStep === 2) {
      // Process booking
      await handleBooking();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleBooking = async () => {
    try {
      setLoading(true);
      setError('');
      
      const bookingPayload = {
        bus: bus.id,
        travel_date: travelDate,
        seats_booked: bookingData.seats_booked,
      };

      const response = await bookingService.createBooking(bookingPayload);
      setBooking(response);
      setActiveStep(steps.length - 1);
    } catch (error) {
      setError(error.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = bus.price_per_seat * bookingData.seats_booked;

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Number of Seats
            </Typography>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {bus.title} - {bus.route_display}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {travelDate} • Departure: {bus.departure_time}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available seats: {bus.available_seats}
                </Typography>
              </CardContent>
            </Card>

            <TextField
              label="Number of Seats"
              type="number"
              value={bookingData.seats_booked}
              onChange={(e) => {
                const value = Math.max(1, Math.min(bus.available_seats, parseInt(e.target.value) || 1));
                setBookingData(prev => ({ ...prev, seats_booked: value }));
              }}
              inputProps={{
                min: 1,
                max: bus.available_seats,
              }}
              fullWidth
              helperText={`Maximum ${bus.available_seats} seats available`}
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Booking
            </Typography>
            
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Bus
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {bus.title}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Route
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {bus.route_display}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Travel Date
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {travelDate}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Departure Time
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {bus.departure_time}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Seats Booked
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {bookingData.seats_booked}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Price per Seat
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      TZS {bus.price_per_seat}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Total Price</Typography>
                  <Typography variant="h6" color="primary">
                    TZS {totalPrice}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Processing
            </Typography>
            
            <Card>
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  Processing your payment automatically...
                </Typography>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Payment Summary
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Bus Fare ({bookingData.seats_booked} seats)</Typography>
                    <Typography variant="body2">TZS {totalPrice}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6" color="primary">
                      TZS {totalPrice}
                    </Typography>
                  </Box>
                </Box>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  Click "Complete Booking" to finalize your reservation. Your ticket will be generated automatically.
                </Alert>
              </CardContent>
            </Card>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Booking Completed Successfully!
            </Typography>
            
            {booking && (
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <ConfirmationNumber sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                  
                  <Typography variant="h5" gutterBottom>
                    Booking Confirmed
                  </Typography>
                  
                  <Typography variant="body1" gutterBottom>
                    Your booking reference: <strong>{booking.booking_reference}</strong>
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Your ticket has been generated automatically! You can view and download it from the "My Tickets" page.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/tickets')}
                    >
                      View My Ticket
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/bookings')}
                    >
                      View My Bookings
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/search')}
                    >
                      Book Another Trip
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Book Your Journey
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        {renderStepContent(activeStep)}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0 || activeStep === steps.length - 1}
          onClick={handleBack}
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
          >
            Complete Booking
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
          >
            {activeStep === 2 ? 'Complete Booking' : 'Next'}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default BookingPage;
