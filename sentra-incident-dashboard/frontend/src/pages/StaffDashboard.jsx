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
  Box,
  useTheme,
  useMediaQuery,
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
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    const fetchAssignedIncidents = async () => {
      try {
        const res = await axios.get('http://13.205.179.91:5000/api/incidents', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Staff received incidents:', res.data.length);
        if (res.data.length > 0) {
          console.log('First incident:', res.data[0]);
          console.log('Assigned to ID:', res.data[0].assignedTo?._id);
        }

        setIncidents(res.data);

      } catch (error) {
        console.error('Staff fetch error:', error?.response?.data || error.message);
      }
    };

    if (token && user?._id) {
      fetchAssignedIncidents();
    }
  }, [token, user]);

  // Mobile responsive view
  if (isMobile) {
    return (
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2, px: 2 }}>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Owner Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Assigned Incidents
          </Typography>

          {incidents.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No incidents assigned to you yet.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {incidents.map((inc) => (
                <Paper 
                  key={inc._id} 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {inc.title}
                    </Typography>
                    <Chip
                      label={inc.status}
                      color={statusColor(inc.status)}
                      size="small"
                      sx={{ height: 24, fontSize: '0.75rem' }}
                    />
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    ID: {inc.referenceId}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="caption" sx={{ 
                      bgcolor: 'primary.50', 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1,
                      fontSize: '0.7rem'
                    }}>
                      {inc.category}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      bgcolor: inc.priority === 'High' ? 'error.50' : 
                              inc.priority === 'Medium' ? 'warning.50' : 'success.50', 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1,
                      fontSize: '0.7rem'
                    }}>
                      {inc.priority}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Paper>
      </Container>
    );
  }

  // Tablet responsive adjustments
  if (isTablet) {
    return (
      <Container maxWidth="lg" sx={{ mt: 3, mb: 3, px: 3 }}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Owner Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            View and manage incidents assigned to you by the admin.
          </Typography>

          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Ref ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incidents.map((inc) => (
                  <TableRow 
                    key={inc._id} 
                    sx={{ 
                      '&:hover': { bgcolor: 'grey.50' },
                      '&:last-child td': { borderBottom: 0 }
                    }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" fontFamily="monospace">
                        {inc.referenceId}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, maxWidth: 150 }}>
                      <Typography variant="body2" noWrap>
                        {inc.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2">
                        {inc.category}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: inc.priority === 'High' ? 'error.main' :
                                inc.priority === 'Medium' ? 'warning.main' : 'success.main',
                          fontWeight: 'medium'
                        }}
                      >
                        {inc.priority}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={inc.status}
                        color={statusColor(inc.status)}
                        size="small"
                        sx={{ height: 28, minWidth: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {incidents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ py: 4, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        No incidents assigned to you yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Desktop view (original but enhanced)
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, md: 3 } }}>
      <Paper 
        sx={{ 
          p: { xs: 2, md: 3, lg: 4 }, 
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          fontWeight="bold"
          sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
        >
          Owner Dashboard - Assigned Incidents
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          mb={3}
          sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
        >
          View and manage incidents assigned to you by the admin.
        </Typography>

        <Box sx={{ 
          overflowX: 'auto',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.50' }}>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    py: 2,
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}
                >
                  Reference ID
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    py: 2,
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}
                >
                  Title
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    py: 2,
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}
                >
                  Category
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    py: 2,
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}
                >
                  Priority
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    py: 2,
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents.map((inc) => (
                <TableRow 
                  key={inc._id}
                  sx={{ 
                    '&:hover': { bgcolor: 'grey.50' },
                    transition: 'background-color 0.2s',
                    '&:last-child td': { borderBottom: 0 }
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Typography 
                      variant="body2" 
                      fontFamily="monospace"
                      sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                    >
                      {inc.referenceId}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2, maxWidth: 200 }}>
                    <Typography 
                      variant="body2"
                      sx={{ 
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {inc.title}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={inc.category}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        height: 28,
                        fontSize: { xs: '0.75rem', md: '0.875rem' }
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={inc.priority}
                      size="small"
                      sx={{ 
                        height: 28,
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                        bgcolor: inc.priority === 'High' ? 'error.light' :
                                inc.priority === 'Medium' ? 'warning.light' : 'success.light',
                        color: inc.priority === 'High' ? 'error.contrastText' :
                              inc.priority === 'Medium' ? 'warning.contrastText' : 'success.contrastText'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={inc.status}
                      color={statusColor(inc.status)}
                      size="medium"
                      sx={{ 
                        height: 32,
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                        minWidth: 100
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {incidents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 8, textAlign: 'center' }}>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                    >
                      No incidents assigned to you yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Container>
  );
};

export default StaffDashboard;