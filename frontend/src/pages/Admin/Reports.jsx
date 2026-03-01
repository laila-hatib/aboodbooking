import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Download,
  Refresh,
  TrendingUp,
  AttachMoney,
  DirectionsBus,
  People,
  Receipt,
  ConfirmationNumber,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState({
    start: dayjs().subtract(30, 'day'),
    end: dayjs(),
  });

  // Mock data for reports
  const [reportData, setReportData] = useState({
    revenue: 1250000,
    bookings: 156,
    tickets: 142,
    activeUsers: 89,
    busUtilization: 78,
    popularRoutes: [
      { route: 'Dar es Salaam → Morogoro', bookings: 89, revenue: 712000 },
      { route: 'Morogoro → Dar es Salaam', bookings: 67, revenue: 538000 },
    ],
    monthlyStats: [
      { month: 'Jan', revenue: 450000, bookings: 56, tickets: 52 },
      { month: 'Feb', revenue: 680000, bookings: 78, tickets: 71 },
      { month: 'Mar', revenue: 1250000, bookings: 156, tickets: 142 },
    ],
  });

  const handleGenerateReport = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real app, you'd fetch data from your API
      // For now, we'll simulate with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update report data based on selected report type
      if (reportType === 'revenue') {
        setReportData(prev => ({
          ...prev,
          revenue: Math.floor(Math.random() * 2000000) + 500000,
        }));
      }
    } catch (error) {
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    // In a real app, you'd generate and download a CSV/PDF report
    const csvContent = "data:text/csv;charset=utf-8,Month,Revenue,Bookings,Tickets\n"
      + reportData.monthlyStats.map(row => 
        `${row.month},${row.revenue},${row.bookings},${row.tickets}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Reports & Analytics
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Generate Report
        </Typography>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label="Report Type"
              >
                <MenuItem value="revenue">Revenue Report</MenuItem>
                <MenuItem value="bookings">Bookings Report</MenuItem>
                <MenuItem value="users">Users Report</MenuItem>
                <MenuItem value="buses">Bus Utilization</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={dateRange.start}
                onChange={(newValue) => setDateRange(prev => ({ ...prev, start: newValue }))}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={dateRange.end}
                onChange={(newValue) => setDateRange(prev => ({ ...prev, end: newValue }))}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleGenerateReport}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
              >
                Generate
              </Button>
              <Button
                variant="outlined"
                onClick={handleExportReport}
                startIcon={<Download />}
              >
                Export
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Revenue</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                TZS {reportData.revenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {dateRange.start.format('MMM DD')} - {dateRange.end.format('MMM DD')}
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
                {reportData.bookings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                +12% from last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ConfirmationNumber color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Tickets Issued</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {reportData.tickets}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                91% completion rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Bus Utilization</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {reportData.busUtilization}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Above target (70%)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Popular Routes
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Route</TableCell>
                    <TableCell align="right">Bookings</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.popularRoutes.map((route, index) => (
                    <TableRow key={index}>
                      <TableCell>{route.route}</TableCell>
                      <TableCell align="right">{route.bookings}</TableCell>
                      <TableCell align="right">TZS {route.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Statistics
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                    <TableCell align="right">Bookings</TableCell>
                    <TableCell align="right">Tickets</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.monthlyStats.map((month, index) => (
                    <TableRow key={index}>
                      <TableCell>{month.month}</TableCell>
                      <TableCell align="right">TZS {month.revenue.toLocaleString()}</TableCell>
                      <TableCell align="right">{month.bookings}</TableCell>
                      <TableCell align="right">{month.tickets}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
