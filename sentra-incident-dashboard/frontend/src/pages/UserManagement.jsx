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
  Chip,
  Stack,
  Skeleton,
  IconButton,
  Tooltip,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { Users, Mail, Shield, RefreshCw, GraduationCap } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const colors = {
  darkBlue: '#1e293b',
  lightGray: '#f8fafc',
  white: '#ffffff',
  darkGray: '#475569',
  blue: '#3b82f6',
  borderGray: '#e2e8f0',
  success: '#10b981'
};

const roleIcons = {
  staff: <Users size={16} />,
  student: <GraduationCap size={16} />,
  admin: <Shield size={16} />
};

const UserManagement = () => {
  const { token } = useAuth();
  const [role, setRole] = useState('staff'); // Current selected role
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (selectedRole) => {
    setLoading(true);
    try {
      let url = '';
      if (selectedRole === 'staff') url = 'http://13.205.179.91:5000/api/auth/staff';
      else if (selectedRole === 'student') url = 'http://13.205.179.91:5000/api/auth/students';
      else if (selectedRole === 'admin') url = 'http://13.205.179.91:5000/api/auth/admins';

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(`Failed to fetch ${role} users`, err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(role);
  }, [role, token]);

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
              sx={{ border: `1px solid ${colors.borderGray}`, backgroundColor: colors.white }}
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
          <Tab label="owner" value="staff" />
          <Tab label="user" value="student" />
          {/* <Tab label="Admins" value="admin" /> */}
        </Tabs>

        {/* User Table */}
        <Card sx={{ borderRadius: 2, border: `1px solid ${colors.borderGray}`, backgroundColor: colors.white }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton width={120} /></TableCell>
                        <TableCell><Skeleton width={200} /></TableCell>
                        <TableCell><Skeleton width={80} /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    users.map(user => (
                      <TableRow key={user._id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ bgcolor: colors.blue }}>{roleIcons[user.role]}</Avatar>
                            <Typography fontWeight={600}>{user.name}</Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Mail size={14} color={colors.darkGray} />
                            <Typography variant="body2">{user.email}</Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Chip
                            icon={roleIcons[user.role]}
                            label={user.role}
                            sx={{ backgroundColor: '#ecfdf5', color: colors.success, fontWeight: 600 }}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

      </Container>
    </Box>
  );
};

export default UserManagement;
