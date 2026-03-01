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
  LinearProgress,
} from '@mui/material';
import {
  DirectionsBus,
  Receipt,
  ConfirmationNumber,
  People,
  TrendingUp,
  AttachMoney,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { busService } from '../../services/busService';
import { bookingService } from '../../services/bookingService';
import { ticketService } from '../../services/ticketService';
import { authService } from '../../services/authService';

const AdminDashboard = () => {
  console.log('AdminDashboard component rendering');
  const [stats, setStats] = useState({
    totalBuses: 0,
    totalBookings: 0,
    totalTickets: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeBuses: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [buses, bookings, tickets] = await Promise.all([
        busService.getAllBuses(),
        bookingService.getAllBookings(),
        ticketService.getAllTickets(),
      ]);
      
      const totalRevenue = bookings
        .filter(booking => booking.payment_status === 'paid')
        .reduce((sum, booking) => sum + parseFloat(booking.total_price), 0);
      
      setStats({
        totalBuses: buses.length,
        totalBookings: bookings.length,
        totalTickets: tickets.length,
        totalUsers: new Set(bookings.map(b => b.passenger_details.id)).size,
        totalRevenue,
        activeBuses: buses.filter(bus => bus.is_active).length,
      });
      
      setRecentBookings(bookings.slice(0, 10));
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
        Admin Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your bus fleet and monitor system performance
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DirectionsBus color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Buses</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats.totalBuses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.activeBuses} active
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Receipt color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Bookings</Typography>
              </Box>
              <Typography variant="h4" color="secondary">
                {stats.totalBookings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ConfirmationNumber color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Tickets</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {stats.totalTickets}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Users</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {stats.totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Revenue</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                TZS {stats.totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Active</Typography>
              </Box>
              <Typography variant="h4" color="error.main">
                {Math.round((stats.activeBuses / stats.totalBuses) * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                buses active
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
                            {booking.passenger_details?.first_name} {booking.passenger_details?.last_name} - {booking.bus_details?.title}
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
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/admin/buses')}
                startIcon={<DirectionsBus />}
              >
                Manage Buses
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/admin/bookings')}
                startIcon={<Receipt />}
              >
                View All Bookings
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/admin/tickets')}
                startIcon={<ConfirmationNumber />}
              >
                View All Tickets
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/admin/users')}
                startIcon={<People />}
              >
                Manage Users
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/admin/reports')}
                startIcon={<TrendingUp />}
              >
                View Reports
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
