import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  DirectionsBus,
  Receipt,
  ConfirmationNumber,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { busService } from '../services/busService';
import { bookingService } from '../services/bookingService';
import { ticketService } from '../services/ticketService';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  console.log('Dashboard component rendering');
  const [stats, setStats] = useState({
    totalBuses: 0,
    totalBookings: 0,
    totalTickets: 0,
    availableBuses: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (isAdmin) {
        // Admin data
        const [buses, bookings, tickets] = await Promise.all([
          busService.getAllBuses(),
          bookingService.getAllBookings(),
          ticketService.getAllTickets(),
        ]);
        
        setStats({
          totalBuses: buses.length,
          totalBookings: bookings.length,
          totalTickets: tickets.length,
          availableBuses: buses.filter(bus => bus.is_available).length,
        });
        
        setRecentBookings(bookings.slice(0, 5));
      } else {
        // Passenger data
        const [buses, bookings, tickets] = await Promise.all([
          busService.getAllBuses(),
          bookingService.getMyBookings(),
          ticketService.getMyTickets(),
        ]);
        
        setStats({
          totalBuses: buses.length,
          totalBookings: bookings.length,
          totalTickets: tickets.length,
          availableBuses: buses.filter(bus => bus.is_available).length,
        });
        
        setRecentBookings(bookings.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
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
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.first_name}!
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {isAdmin 
          ? 'Manage your bus fleet and monitor bookings' 
          : 'Book your next journey with Aboud Bus'
        }
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DirectionsBus color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Buses</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats.totalBuses}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Receipt color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Bookings</Typography>
              </Box>
              <Typography variant="h4" color="secondary">
                {stats.totalBookings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ConfirmationNumber color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Tickets</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {stats.totalTickets}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Available Buses</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {stats.availableBuses}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Bookings
            </Typography>
            {recentBookings.length > 0 ? (
              <List>
                {recentBookings.map((booking) => (
                  <ListItem key={booking.id} divider>
                    <ListItemText
                      primary={`Booking ${booking.booking_reference}`}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {booking.bus_details?.title} - {booking.bus_details?.route_display}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {booking.travel_date} • {booking.seats_booked} seats • TZS {booking.total_price}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip
                      label={booking.payment_status_display}
                      color={
                        booking.payment_status === 'paid' ? 'success' :
                        booking.payment_status === 'pending' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent bookings found
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {!isAdmin && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/search')}
                  startIcon={<DirectionsBus />}
                >
                  Search Buses
                </Button>
              )}
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/bookings')}
                startIcon={<Receipt />}
              >
                View Bookings
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/tickets')}
                startIcon={<ConfirmationNumber />}
              >
                View Tickets
              </Button>
              {isAdmin && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/admin/buses')}
                  startIcon={<DirectionsBus />}
                >
                  Manage Buses
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
