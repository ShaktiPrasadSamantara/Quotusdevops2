import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Stack,
  Skeleton,
  IconButton,
  Tooltip,
  Divider,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Snackbar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from '@mui/material';
import { 
  Users, 
  Mail, 
  Shield, 
  RefreshCw, 
  GraduationCap, 
  Edit, 
  Save, 
  X, 
  MoreVertical, 
  Trash2,
  User
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const colors = {
  darkBlue: '#1e293b',
  lightGray: '#f8fafc',
  white: '#ffffff',
  darkGray: '#475569',
  blue: '#3b82f6',
  borderGray: '#e2e8f0',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b'
};

const roleIcons = {
  staff: <Users size={16} />,
  student: <GraduationCap size={16} />,
  admin: <Shield size={16} />
};

const UserManagement = () => {
  const { token, user: currentUser } = useAuth();
  const [role, setRole] = useState('staff');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [actionMenuUser, setActionMenuUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchUsers = async (selectedRole) => {
    setLoading(true);
    try {
      let url = '';
      if (selectedRole === 'staff') url = 'http://13.205.179.91:5000/api/auth/staff';
      else if (selectedRole === 'student') url = 'http://13.205.179.91:5000/api/auth/students';

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(`Failed to fetch ${role} users`, err);
      setUsers([]);
      showSnackbar('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(role);
  }, [role, token]);

  const handleActionMenuOpen = (event, user) => {
    setActionMenuAnchor(event.currentTarget);
    setActionMenuUser(user);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setActionMenuUser(null);
  };

  const handleEditClick = () => {
    if (actionMenuUser) {
      setSelectedUser(actionMenuUser);
      setEditForm({
        name: actionMenuUser.name,
        email: actionMenuUser.email
      });
      setEditDialogOpen(true);
      handleActionMenuClose();
    }
  };

  const handleDeleteClick = () => {
    if (actionMenuUser) {
      setSelectedUser(actionMenuUser);
      setDeleteDialogOpen(true);
      handleActionMenuClose();
    }
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
    setEditForm({ name: '', email: '' });
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
    setDeleting(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Validation
      if (!editForm.name.trim()) {
        showSnackbar('Name is required', 'error');
        return;
      }
      if (!editForm.email.trim()) {
        showSnackbar('Email is required', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
        showSnackbar('Please enter a valid email', 'error');
        return;
      }

      const response = await axios.put(
        `http://13.205.179.91:5000/api/auth/users/${selectedUser._id}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        // Update local state
        setUsers(users.map(user => 
          user._id === selectedUser._id 
            ? { ...user, ...editForm }
            : user
        ));
        
        showSnackbar('User updated successfully!', 'success');
        handleEditClose();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      const message = error.response?.data?.message || 'Failed to update user';
      showSnackbar(message, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      const response = await axios.delete(
        `http://13.205.179.91:5000/api/auth/users/${selectedUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        // Remove from local state
        setUsers(users.filter(user => user._id !== selectedUser._id));
        
        showSnackbar('User deleted successfully!', 'success');
        handleDeleteClose();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      const message = error.response?.data?.message || 'Failed to delete user';
      showSnackbar(message, 'error');
      setDeleting(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get avatar color based on role
  const getAvatarColor = (userRole) => {
    return userRole === 'staff' ? colors.blue : colors.success;
  };

  return (
    <Box sx={{ backgroundColor: colors.lightGray, minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">

        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={700} color={colors.darkBlue}>
              User Management
            </Typography>
            <Typography variant="caption" color={colors.darkGray}>
              Manage user accounts & permissions
            </Typography>
          </Box>

          <Tooltip title="Refresh">
            <IconButton
              onClick={() => fetchUsers(role)}
              sx={{ 
                border: `1px solid ${colors.borderGray}`, 
                backgroundColor: colors.white,
                '&:hover': {
                  backgroundColor: colors.lightGray
                }
              }}
            >
              <RefreshCw size={18} />
            </IconButton>
          </Tooltip>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Role Tabs */}
        <Tabs
          value={role}
          onChange={(e, newRole) => setRole(newRole)}
          sx={{ mb: 2 }}
        >
          <Tab label="Owner" value="staff" />
          <Tab label="User" value="student" />
        </Tabs>

        {/* User Table */}
        <Card sx={{ 
          borderRadius: 2, 
          border: `1px solid ${colors.borderGray}`, 
          backgroundColor: colors.white,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: '#f1f5f9',
                    '& th': { 
                      fontWeight: 600, 
                      color: colors.darkBlue,
                      fontSize: '0.875rem'
                    }
                  }}>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton width={120} /></TableCell>
                        <TableCell><Skeleton width={200} /></TableCell>
                        <TableCell align="right"><Skeleton width={60} /></TableCell>
                      </TableRow>
                    ))
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <Stack alignItems="center" spacing={1}>
                          <User size={48} color={colors.darkGray} />
                          <Typography color={colors.darkGray}>
                            No {role} users found
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map(user => (
                      <TableRow 
                        key={user._id} 
                        sx={{ 
                          '&:hover': { backgroundColor: '#f8fafc' },
                          '&:last-child td': { borderBottom: 0 }
                        }}
                      >
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar 
                              sx={{ 
                                bgcolor: getAvatarColor(user.role),
                                width: 36,
                                height: 36,
                                fontSize: '0.875rem',
                                fontWeight: 600
                              }}
                            >
                              {getInitials(user.name)}
                            </Avatar>
                            <Box>
                              <Typography 
                                fontWeight={600}
                                sx={{ fontSize: '0.95rem' }}
                              >
                                {user.name}
                              </Typography>
                              {/* Removed the role chip from here */}
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Mail size={14} color={colors.darkGray} />
                            <Typography 
                              variant="body2"
                              sx={{ fontSize: '0.875rem' }}
                            >
                              {user.email}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="right">
                          <Tooltip title="Actions">
                            <IconButton
                              size="small"
                              onClick={(e) => handleActionMenuOpen(e, user)}
                              disabled={currentUser?._id === user._id}
                              sx={{ 
                                border: `1px solid ${colors.borderGray}`,
                                backgroundColor: colors.white,
                                '&:hover': {
                                  backgroundColor: colors.lightGray
                                },
                                '&:disabled': {
                                  opacity: 0.5,
                                  cursor: 'not-allowed'
                                }
                              }}
                            >
                              <MoreVertical size={16} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Action Menu */}
        <Menu
          anchorEl={actionMenuAnchor}
          open={Boolean(actionMenuAnchor)}
          onClose={handleActionMenuClose}
          PaperProps={{
            elevation: 3,
            sx: { 
              borderRadius: 1,
              minWidth: 180,
              mt: 1
            }
          }}
        >
          <MenuItem onClick={handleEditClick}>
            <ListItemIcon>
              <Edit size={18} />
            </ListItemIcon>
            <ListItemText>Edit User</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={handleDeleteClick}
            sx={{ color: colors.error }}
          >
            <ListItemIcon>
              <Trash2 size={18} color={colors.error} />
            </ListItemIcon>
            <ListItemText>Delete User</ListItemText>
          </MenuItem>
        </Menu>

        {/* Edit Dialog */}
        <Dialog 
          open={editDialogOpen} 
          onClose={handleEditClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Edit size={20} />
              <Typography variant="h6">Edit User</Typography>
            </Stack>
          </DialogTitle>
          
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                variant="outlined"
                required
                size="small"
              />
              
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editForm.email}
                onChange={handleEditChange}
                variant="outlined"
                required
                size="small"
              />
              
              {/* Removed role display from edit dialog as well since we're not showing role */}
              <Typography variant="caption" color={colors.darkGray}>
                Note: Role information is managed separately.
              </Typography>
            </Stack>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleEditClose}
              size="small"
              sx={{ color: colors.darkGray }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              size="small"
              sx={{ 
                backgroundColor: colors.blue,
                '&:hover': {
                  backgroundColor: colors.darkBlue
                }
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={deleteDialogOpen} 
          onClose={handleDeleteClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Trash2 size={20} color={colors.error} />
              <Typography variant="h6" color={colors.error}>
                Delete User
              </Typography>
            </Stack>
          </DialogTitle>
          
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                This action cannot be undone. All data associated with this user will be permanently deleted.
              </Alert>
              
              <Typography>
                Are you sure you want to delete <strong>{selectedUser?.name}</strong> ({selectedUser?.email})?
              </Typography>
              
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#fef2f2', 
                borderRadius: 1,
                border: `1px solid ${colors.error}20`
              }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Trash2 size={16} color={colors.error} />
                  <Typography variant="caption" color={colors.error}>
                    User ID: {selectedUser?._id}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleDeleteClose}
              disabled={deleting}
              size="small"
              sx={{ color: colors.darkGray }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              disabled={deleting}
              size="small"
              sx={{ 
                backgroundColor: colors.error,
                '&:hover': {
                  backgroundColor: '#dc2626'
                },
                '&:disabled': {
                  backgroundColor: `${colors.error}80`
                }
              }}
              startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <Trash2 size={16} />}
            >
              {deleting ? 'Deleting...' : 'Delete User'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

      </Container>
    </Box>
  );
};

export default UserManagement;