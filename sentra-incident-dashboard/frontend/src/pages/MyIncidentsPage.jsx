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

const MyIncidentsPage = () => {
  const { token } = useAuth();
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/incidents/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIncidents(res.data);
      } catch (error) {
        console.error('Error fetching incidents', error.message);
      }
    };

    if (token) {
      fetchIncidents();
    }
  }, [token]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Incidents
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Track the status of incidents you have reported.
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reference ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
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
                <TableCell>
                  {new Date(inc.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default MyIncidentsPage;
