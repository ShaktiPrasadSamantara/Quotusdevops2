import React from 'react';
import { Container, Grid, Paper, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Dashboard - PortCALM
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Report a New Incident</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Submit a confidential report with optional anonymity.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/student/report')}>
              Report Incident
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">My Incident History</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              View and track the status of your submitted incidents.
            </Typography>
            <Button variant="outlined" onClick={() => navigate('/student/my-incidents')}>
              View My Incidents
            </Button>
          </Paper>
        </Grid>

        {/* <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Awareness Hub</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Access campus policies, helplines, and safety tips.
            </Typography>
            <Button variant="outlined" onClick={() => navigate('/awareness')}>
              Open Awareness Hub
            </Button>
          </Paper>
        </Grid> */}
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
