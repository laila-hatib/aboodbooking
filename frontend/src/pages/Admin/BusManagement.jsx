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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  DirectionsBus,
} from '@mui/icons-material';
import { busService } from '../../services/busService';

const BusManagement = () => {
  console.log('BusManagement component rendering');
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    route: 'dar_morogoro',
    total_seats: '',
    available_seats: '',
    travel_days: 'daily',
    departure_time: '',
    price_per_seat: '',
    is_active: true,
  });

  const routes = [
    { value: 'dar_morogoro', label: 'Dar es Salaam → Morogoro' },
    { value: 'morogoro_dar', label: 'Morogoro → Dar es Salaam' },
  ];

  const travelDays = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekdays', label: 'Weekdays' },
    { value: 'weekends', label: 'Weekends' },
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    console.log('BusManagement - fetching buses...');
    try {
      setLoading(true);
      const data = await busService.getAllBuses();
      console.log('BusManagement - buses fetched:', data);
      setBuses(data);
    } catch (error) {
      console.error('BusManagement - error fetching buses:', error);
      setError('Failed to fetch buses');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (bus = null) => {
    if (bus) {
      setEditingBus(bus);
      setFormData({
        title: bus.title,
        route: bus.route,
        total_seats: bus.total_seats,
        available_seats: bus.available_seats,
        travel_days: bus.travel_days,
        departure_time: bus.departure_time,
        price_per_seat: bus.price_per_seat,
        is_active: bus.is_active,
      });
    } else {
      setEditingBus(null);
      setFormData({
        title: '',
        route: 'dar_morogoro',
        total_seats: '',
        available_seats: '',
        travel_days: 'daily',
        departure_time: '',
        price_per_seat: '',
        is_active: true,
      });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBus(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingBus) {
        await busService.updateBus(editingBus.id, formData);
      } else {
        await busService.createBus(formData);
      }
      await fetchBuses();
      handleCloseDialog();
    } catch (error) {
      setError('Failed to save bus');
    }
  };

  const handleDelete = async (busId) => {
    if (window.confirm('Are you sure you want to deactivate this bus?')) {
      try {
        await busService.deleteBus(busId);
        await fetchBuses();
      } catch (error) {
        setError('Failed to delete bus');
      }
    }
  };

  if (loading) {
    console.log('BusManagement - showing loading state');
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  console.log('BusManagement - rendering main component with buses:', buses.length);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Bus Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Bus
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
                <TableCell>Bus Title</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Total Seats</TableCell>
                <TableCell>Available Seats</TableCell>
                <TableCell>Travel Days</TableCell>
                <TableCell>Departure Time</TableCell>
                <TableCell>Price/Seat</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buses.map((bus) => (
                <TableRow key={bus.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DirectionsBus sx={{ mr: 1 }} />
                      {bus.title}
                    </Box>
                  </TableCell>
                  <TableCell>{bus.route_display}</TableCell>
                  <TableCell>{bus.total_seats}</TableCell>
                  <TableCell>{bus.available_seats}</TableCell>
                  <TableCell>{bus.travel_days_display}</TableCell>
                  <TableCell>{bus.departure_time}</TableCell>
                  <TableCell>TZS {bus.price_per_seat}</TableCell>
                  <TableCell>
                    <Chip
                      label={bus.is_active ? 'Active' : 'Inactive'}
                      color={bus.is_active ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(bus)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(bus.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBus ? 'Edit Bus' : 'Add New Bus'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                name="title"
                label="Bus Title"
                value={formData.title}
                onChange={handleChange}
                required
                fullWidth
              />
              
              <FormControl fullWidth required>
                <InputLabel>Route</InputLabel>
                <Select
                  name="route"
                  value={formData.route}
                  onChange={handleChange}
                  label="Route"
                >
                  {routes.map((route) => (
                    <MenuItem key={route.value} value={route.value}>
                      {route.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  name="total_seats"
                  label="Total Seats"
                  type="number"
                  value={formData.total_seats}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  name="available_seats"
                  label="Available Seats"
                  type="number"
                  value={formData.available_seats}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Box>

              <FormControl fullWidth required>
                <InputLabel>Travel Days</InputLabel>
                <Select
                  name="travel_days"
                  value={formData.travel_days}
                  onChange={handleChange}
                  label="Travel Days"
                >
                  {travelDays.map((day) => (
                    <MenuItem key={day.value} value={day.value}>
                      {day.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  name="departure_time"
                  label="Departure Time"
                  type="time"
                  value={formData.departure_time}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  name="price_per_seat"
                  label="Price per Seat"
                  type="number"
                  value={formData.price_per_seat}
                  onChange={handleChange}
                  required
                  fullWidth
                  inputProps={{
                    min: 0,
                    step: 0.01,
                  }}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingBus ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default BusManagement;
