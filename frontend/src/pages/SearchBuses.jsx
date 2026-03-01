import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Search,
  DirectionsBus,
  AccessTime,
  EventSeat,
  AttachMoney,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { busService } from '../services/busService';
import { useNavigate } from 'react-router-dom';

const SearchBuses = () => {
  const [searchData, setSearchData] = useState({
    route: '',
    travel_date: null,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const routes = [
    { value: 'dar_morogoro', label: 'Dar es Salaam → Morogoro' },
    { value: 'morogoro_dar', label: 'Morogoro → Dar es Salaam' },
  ];

  const handleSearch = async () => {
    if (!searchData.route || !searchData.travel_date) {
      setError('Please select both route and travel date');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const formattedDate = searchData.travel_date.format('YYYY-MM-DD');
      const results = await busService.searchBuses(searchData.route, formattedDate);
      setSearchResults(results);
      setSearched(true);
    } catch (error) {
      setError('Failed to search buses');
    } finally {
      setLoading(false);
    }
  };

  const handleBookBus = (bus) => {
    navigate('/booking', {
      state: {
        bus,
        travelDate: searchData.travel_date.format('YYYY-MM-DD'),
        route: searchData.route,
      },
    });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Buses
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Find Your Journey
        </Typography>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth required>
              <InputLabel>Route</InputLabel>
              <Select
                value={searchData.route}
                onChange={(e) => setSearchData(prev => ({ ...prev, route: e.target.value }))}
                label="Route"
              >
                {routes.map((route) => (
                  <MenuItem key={route.value} value={route.value}>
                    {route.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Travel Date"
                value={searchData.travel_date}
                onChange={(newValue) => setSearchData(prev => ({ ...prev, travel_date: newValue }))}
                minDate={dayjs()}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Search />}
              onClick={handleSearch}
              disabled={loading}
              sx={{ height: '56px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Search Buses'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {searched && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Search Results
            {searchResults.length > 0 && (
              <Chip
                label={`${searchResults.length} buses found`}
                color="primary"
                size="small"
                sx={{ ml: 2 }}
              />
            )}
          </Typography>

          {searchResults.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <DirectionsBus sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No buses available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try selecting a different date or route
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {searchResults.map((bus) => (
                <Grid item xs={12} md={6} lg={4} key={bus.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <DirectionsBus color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" component="h2">
                          {bus.title}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {bus.route_display}
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTime sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            Departure: {bus.departure_time}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EventSeat sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {bus.available_seats} seats available
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AttachMoney sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            TZS {bus.price_per_seat} per seat
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <Chip
                          label={bus.travel_days_display}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                    
                    <CardActions>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleBookBus(bus)}
                        disabled={bus.available_seats === 0}
                      >
                        {bus.available_seats === 0 ? 'Sold Out' : 'Book Now'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SearchBuses;
