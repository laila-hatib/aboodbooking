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
  Block,
  CheckCircle,
  Refresh,
  Person,
} from '@mui/icons-material';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('view'); // view, edit, toggle

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Since we don't have a direct users API, we'll simulate with mock data
      // In a real app, you'd have an admin endpoint to get all users
      const mockUsers = [
        {
          id: 1,
          username: 'admin',
          email: 'admin@aboud.com',
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          is_active: true,
          is_verified: true,
          date_joined: '2024-01-01T00:00:00Z',
          last_login: '2024-03-01T10:00:00Z',
        },
        {
          id: 2,
          username: 'rukia',
          email: 'rukia@gmail.com',
          first_name: 'rukia',
          last_name: 'rukia',
          role: 'passenger',
          is_active: true,
          is_verified: true,
          date_joined: '2024-03-01T14:00:00Z',
          last_login: '2024-03-01T14:30:00Z',
        },
        // Add more mock users as needed
      ];
      setUsers(mockUsers);
    } catch (error) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user, type) => {
    setSelectedUser(user);
    setDialogType(type);
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleToggleUserStatus = async () => {
    try {
      // In a real app, you'd call an API to toggle user status
      const updatedUsers = users.map(user =>
        user.id === selectedUser.id
          ? { ...user, is_active: !user.is_active }
          : user
      );
      setUsers(updatedUsers);
      handleCloseDialog();
    } catch (error) {
      setError('Failed to update user status');
    }
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? 'error' : 'primary';
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
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
          Users Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchUsers}
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
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Verified</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {user.first_name} {user.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_active ? 'Active' : 'Inactive'}
                      color={getStatusColor(user.is_active)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_verified ? 'Verified' : 'Not Verified'}
                      color={user.is_verified ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.date_joined).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.last_login
                      ? new Date(user.last_login).toLocaleDateString()
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(user, 'view')}
                        title="View Details"
                      >
                        <Visibility />
                      </IconButton>
                      {user.role !== 'admin' && (
                        <IconButton
                          color={user.is_active ? 'error' : 'success'}
                          onClick={() => handleOpenDialog(user, 'toggle')}
                          title={user.is_active ? 'Deactivate User' : 'Activate User'}
                        >
                          {user.is_active ? <Block /> : <CheckCircle />}
                        </IconButton>
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
          {dialogType === 'view' && 'User Details'}
          {dialogType === 'toggle' && `${selectedUser?.is_active ? 'Deactivate' : 'Activate'} User`}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'view' && selectedUser && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Username
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    @{selectedUser.username}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedUser.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedUser.first_name} {selectedUser.last_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Role
                  </Typography>
                  <Chip
                    label={selectedUser.role}
                    color={getRoleColor(selectedUser.role)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Account Status
                  </Typography>
                  <Chip
                    label={selectedUser.is_active ? 'Active' : 'Inactive'}
                    color={getStatusColor(selectedUser.is_active)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Verification Status
                  </Typography>
                  <Chip
                    label={selectedUser.is_verified ? 'Verified' : 'Not Verified'}
                    color={selectedUser.is_verified ? 'success' : 'warning'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date Joined
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedUser.date_joined).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Login
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedUser.last_login
                      ? new Date(selectedUser.last_login).toLocaleString()
                      : 'Never'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          {dialogType === 'toggle' && selectedUser && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to {selectedUser.is_active ? 'deactivate' : 'activate'} this user?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                User: {selectedUser.first_name} {selectedUser.last_name}<br />
                Email: {selectedUser.email}<br />
                Current Status: {selectedUser.is_active ? 'Active' : 'Inactive'}
              </Typography>
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {selectedUser.is_active
                  ? 'Deactivating will prevent the user from logging in and making bookings.'
                  : 'Activating will allow the user to log in and use the system.'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {dialogType === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogType === 'toggle' && (
            <Button
              onClick={handleToggleUserStatus}
              variant="contained"
              color={selectedUser?.is_active ? 'error' : 'success'}
            >
              {selectedUser?.is_active ? 'Deactivate' : 'Activate'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersManagement;
