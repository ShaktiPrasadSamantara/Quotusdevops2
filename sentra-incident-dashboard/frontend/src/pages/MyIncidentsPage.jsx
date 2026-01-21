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
  IconButton,
  Box,
} from '@mui/material';
import { Visibility, Edit } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const statusColor = (status) => {
  if (status === 'Resolved') return 'success';
  if (status === 'In Review') return 'info';
  return 'warning';
};

const MyIncidentsPage = () => {
  const { token, user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await axios.get('http://13.205.179.91:5000/api/incidents/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIncidents(res.data.data);
      } catch (error) {
        console.error('Error fetching incidents', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchIncidents();
    }
  }, [token]);

  const handleRowClick = (incident) => {
    console.log('Row clicked, incident:', incident); // Debug log
    const incidentId = incident.id || incident._id;
    console.log('Incident ID:', incidentId); // Debug log
    if (incidentId) {
      navigate(`/incidents/${incidentId}`);
    } else {
      console.error('Invalid incident ID in incident:', incident);
    }
  };

  const handleViewClick = (e, incident) => {
    e.stopPropagation();
    console.log('View clicked, incident:', incident); // Debug log
    const incidentId = incident.id || incident._id;
    console.log('Incident ID:', incidentId); // Debug log
    if (incidentId) {
      navigate(`/incidents/${incidentId}`);
    } else {
      console.error('Invalid incident ID in incident:', incident);
    }
  };

  const handleEditClick = (e, incident) => {
    e.stopPropagation();
    console.log('Edit clicked, incident:', incident); // Debug log
    const incidentId = incident.id || incident._id;
    console.log('Incident ID:', incidentId); // Debug log
    if (incidentId && canEdit(incident)) {
      navigate(`/incidents/${incidentId}/edit`);
    } else {
      console.error('Cannot edit incident:', incident);
    }
  };

  // Check if user can edit incident
  const canEdit = (incident) => {
    if (!user || !incident) return false;
    
    // Only reporter can edit pending incidents
    if (incident.status == 'Pending') return false;
    
    if (incident.isAnonymous) return false;
    
    // Check if current user is the reporter
    if (incident.reporter && incident.reporter.id) {
      return incident.reporter.id === user.id;
    }
    
    return false;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading incidents...</Typography>
      </Container>
    );
  }

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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No incidents found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              incidents.map((inc) => {
                const incidentId = inc.id || inc._id;
                console.log('Rendering incident ID:', incidentId); // Debug log
                return (
                  <TableRow 
                    key={incidentId} 
                    hover 
                    onClick={() => handleRowClick(inc)}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <TableCell>{inc.referenceId}</TableCell>
                    <TableCell>{inc.title}</TableCell>
                    <TableCell>
                      {Array.isArray(inc.category) ? inc.category.join(', ') : inc.category}
                    </TableCell>
                    <TableCell>{inc.priority}</TableCell>
                    <TableCell>
                      <Chip
                        label={inc.status}
                        color={statusColor(inc.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(inc.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleViewClick(e, inc)}
                          title="View Details"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        {canEdit(inc) && (
                          <IconButton
                            size="small"
                            onClick={(e) => handleEditClick(e, inc)}
                            title="Edit"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default MyIncidentsPage;