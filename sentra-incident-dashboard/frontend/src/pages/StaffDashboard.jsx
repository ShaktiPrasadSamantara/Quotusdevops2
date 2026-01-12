import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusColor = (status) => {
  if (status === 'Resolved') return 'success';
  if (status === 'In Review') return 'info';
  return 'warning';
};

const StaffDashboard = () => {
  const { token, user } = useAuth();
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const fetchAssignedIncidents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/incidents', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const all = res.data;

        // Show only incidents assigned to this staff user
        const assigned = all.filter(
          (inc) =>
            inc.assignedTo &&
            inc.assignedTo._id &&
            user &&
            inc.assignedTo._id === user._id
        );
        setIncidents(res.data);
      } catch (error) {
        console.error('Error fetching staff incidents', error.message);
      }
    };

    if (token && user) {
      fetchAssignedIncidents();
    }
  }, [token, user]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Staff Dashboard - Assigned Incidents
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          View and manage incidents assigned to you by the admin.
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reference ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidents.map((inc) => (
              <TableRow key={inc._id}>
                <TableCell>{inc.referenceId}</TableCell>
                <TableCell>{inc.title}</TableCell>
                <TableCell>{inc.category}</TableCell>
                <TableCell>{inc.priority}</TableCell>
                <TableCell>
                  <Chip
                    label={inc.status}
                    color={statusColor(inc.status)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
            {incidents.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="body2" color="text.secondary">
                    No incidents assigned to you yet.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default StaffDashboard;
