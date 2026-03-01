import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext.jsx';
import AppLayout from './components/Layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import MyTickets from './pages/MyTickets';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SearchBuses from './pages/SearchBuses';
import BookingPage from './pages/BookingPage';
import BusManagement from './pages/Admin/BusManagement';
import BookingsManagement from './pages/Admin/BookingsManagement';
import TicketsManagement from './pages/Admin/TicketsManagement';
import UsersManagement from './pages/Admin/UsersManagement';
import Reports from './pages/Admin/Reports';

// Create Material Design 3 theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  console.log('App component rendering');
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected routes with layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout><Dashboard /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <AppLayout><SearchBuses /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <AppLayout><BookingPage /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <AppLayout><MyBookings /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tickets"
              element={
                <ProtectedRoute>
                  <AppLayout><MyTickets /></AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin routes with layout */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout><AdminDashboard /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/buses"
              element={
                <ProtectedRoute>
                  <AppLayout><BusManagement /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute>
                  <AppLayout><BookingsManagement /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tickets"
              element={
                <ProtectedRoute>
                  <AppLayout><TicketsManagement /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <AppLayout><UsersManagement /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute>
                  <AppLayout><Reports /></AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
