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
  TextField,
  MenuItem,
  Box,
  Button,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusOptions = ['Pending', 'In Review', 'Resolved'];
const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

const statusColor = (status) => {
  if (status === 'Resolved') return 'success';
  if (status === 'In Review') return 'info';
  return 'warning';
};

const AdminIncidentsPage = () => {
  const { token } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
  });

  const [staffUsers, setStaffUsers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState({});

  const fetchIncidents = async () => {
    try {
      const res = await axios.get('http://13.205.179.91:5000/api/incidents', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      });
      setIncidents(res.data);
    } catch (error) {
      console.error('Error fetching incidents', error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchIncidents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    // Temporary staff list – put real staff _id from your database
   setStaffUsers([
  { _id: '693441d8333a87eb861dd9ff', name: 'Staff One', email: 'staff@sentra.com' },
]);

  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchIncidents();
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://13.205.179.91:5000/api/incidents/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchIncidents();
    } catch (error) {
      console.error('Error updating status', error.message);
    }
  };

  const assignIncident = async (incidentId) => {
    try {
      const staffId = selectedStaff[incidentId];
      if (!staffId) return;

      await axios.patch(
        `http://13.205.179.91:5000/api/incidents/${incidentId}/assign`,
        { assignedTo: staffId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchIncidents();
    } catch (error) {
      console.error('Error assigning incident', error.message);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Incident Management
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Review, filter, update, and assign reported incidents.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <TextField
            select
            label="Status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            {statusOptions.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            size="small"
          />

          <TextField
            select
            label="Priority"
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            {priorityOptions.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>

          <Button variant="outlined" onClick={applyFilters}>
            Apply Filters
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reference ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Reporter</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidents.map((inc) => (
              <TableRow key={inc._id}>
                <TableCell>{inc.referenceId}</TableCell>
                <TableCell>{inc.title}</TableCell>
                <TableCell>
                  {inc.isAnonymous || !inc.reporter
                    ? 'Anonymous'
                    : inc.reporter.email}
                </TableCell>
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
                  {inc.assignedTo ? inc.assignedTo.email : 'Not assigned'}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        onClick={() => updateStatus(inc._id, 'In Review')}
                      >
                        In Review
                      </Button>
                      <Button
                        size="small"
                        onClick={() => updateStatus(inc._id, 'Resolved')}
                      >
                        Resolve
                      </Button>
                    </Box>

                    <TextField
                      select
                      size="small"
                      label="Assign to"
                      value={selectedStaff[inc._id] || ''}
                      onChange={(e) =>
                        setSelectedStaff((prev) => ({
                          ...prev,
                          [inc._id]: e.target.value,
                        }))
                      }
                    >
                      <MenuItem value="">None</MenuItem>
                      {staffUsers.map((s) => (
                        <MenuItem key={s._id} value={s._id}>
                          {s.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => assignIncident(inc._id)}
                      disabled={!selectedStaff[inc._id]}
                    >
                      Assign
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default AdminIncidentsPage;
