import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inReview: 0,
    resolved: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://13.205.179.91:5000/api/incidents', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const incidents = res.data;

        const total = incidents.length;
        const pending = incidents.filter((i) => i.status === 'Pending').length;
        const inReview = incidents.filter((i) => i.status === 'In Review').length;
        const resolved = incidents.filter((i) => i.status === 'Resolved').length;

        setStats({ total, pending, inReview, resolved });
      } catch (error) {
        console.error('Error fetching stats', error.message);
      }
    };

    if (token) fetchStats();
  }, [token]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard - Sentra
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Incidents
            </Typography>
            <Typography variant="h5">{stats.total}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Pending
            </Typography>
            <Typography variant="h5">{stats.pending}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              In Review
            </Typography>
            <Typography variant="h5">{stats.inReview}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Resolved
            </Typography>
            <Typography variant="h5">{stats.resolved}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Incidents Overview</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              View and manage all reported incidents, update status, and assign staff.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/admin/incidents')}>
              Manage Incidents
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Awareness Hub</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Maintain campus policies, helplines, and safety tips for students and staff.
            </Typography>
            <Button variant="outlined" onClick={() => navigate('/awareness')}>
              View Awareness Hub
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
