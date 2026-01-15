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
  TableContainer,
  Grid,
  Divider,
  IconButton,
  Collapse,
  InputAdornment,
  Card,
  CardContent,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  FilterList,
  Search,
  Clear,
  Tune,
  KeyboardArrowDown,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusOptions = ['Pending', 'In Review', 'Resolved'];
const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

const statusColor = (status) => {
  if (status === 'Resolved') return 'success';
  if (status === 'In Review') return 'info';
  return 'warning';
};

const priorityColor = (priority) => {
  if (priority === 'Critical') return 'error';
  if (priority === 'High') return 'warning';
  if (priority === 'Medium') return 'info';
  return 'success';
};

const AdminIncidentsPage = () => {
  const { token } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [staffUsers, setStaffUsers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState({});

  const fetchIncidents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/incidents', {
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
  const fetchStaff = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/staff', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched real staff:', res.data);
      setStaffUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch staff users:', err.response?.data || err);
      // Optional fallback or show error to admin
    }
  };

  if (token) {
    fetchStaff();
  }
}, [token]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchIncidents();
    if (window.innerWidth < 600) {
      setShowFilters(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      category: '',
      priority: '',
      search: '',
    });
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/incidents/${id}/status`,
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

      const response = await axios.patch(
        `http://localhost:5000/api/incidents/${incidentId}/assign`,
        { assignedTo: staffId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("PATCH response:", response.data);   // ← Add this

      // Clear selection
      setSelectedStaff((prev) => {
        const next = { ...prev };
        delete next[incidentId];
        return next;
      });

      fetchIncidents();
    } catch (err) {
      console.error("Assign failed:", err.response?.data || err.message);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Incident Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review, filter, update, and assign reported incidents
            </Typography>
          </Box>

          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            sx={{ display: { xs: 'flex', md: 'none' } }}
            color="primary"
          >
            <Tune />
            <Typography variant="caption" sx={{ ml: 1 }}>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Typography>
          </IconButton>
        </Box>

        {/* Search Bar - Always visible */}
        <Card
          elevation={0}
          sx={{
            mb: 2,
            backgroundColor: 'background.default',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent sx={{ py: 2, '&.MuiCardContent-root': { pb: 2 } }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search incidents by title or reference..."
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: filters.search && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setFilters({ ...filters, search: '' })}
                        >
                          <Clear fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} lg={8} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    minWidth: 150,
                  }}
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>

                <Button
                  variant="contained"
                  onClick={applyFilters}
                  sx={{
                    minWidth: 120,
                    px: 3,
                  }}
                >
                  Apply
                </Button>

                {(filters.status || filters.category || filters.priority) && (
                  <Button
                    variant="text"
                    color="inherit"
                    onClick={clearFilters}
                    startIcon={<Clear />}
                    sx={{ minWidth: 100 }}
                  >
                    Clear
                  </Button>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Filter Section - Collapsible */}
        <Collapse in={showFilters} timeout="auto">
          <Card
            elevation={0}
            sx={{
              mb: 3,
              backgroundColor: 'background.default',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ py: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FilterList fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                  FILTER OPTIONS
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {/* Status Filter */}
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="status-filter-label">Status</InputLabel>
                    <Select
                      labelId="status-filter-label"
                      label="Status"
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      IconComponent={KeyboardArrowDown}
                      sx={{
                        backgroundColor: 'white',
                        minWidth: 200, // Increased min width
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            mt: 1,
                            minWidth: 200, // Match dropdown width
                          }
                        }
                      }}
                      renderValue={(selected) => {
                        if (!selected) {
                          return <em>All Status</em>;
                        }
                        return (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={selected}
                              size="small"
                              color={statusColor(selected)}
                              sx={{
                                height: 24,
                                fontSize: '0.75rem',
                                fontWeight: 500,
                              }}
                            />
                          </Box>
                        );
                      }}
                    >
                      <MenuItem value="">
                        <em>All Status</em>
                      </MenuItem>
                      {statusOptions.map((s) => (
                        <MenuItem key={s} value={s} sx={{ minWidth: 200 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                            <Chip
                              label={s}
                              size="small"
                              color={statusColor(s)}
                              sx={{
                                height: 24,
                                minWidth: 80,
                                fontSize: '0.75rem',
                                fontWeight: 500,
                              }}
                            />
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Category Filter */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Category"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    placeholder="Enter category"
                    sx={{
                      backgroundColor: 'white',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                      },
                      minWidth: 200, // Increased min width
                    }}
                  />
                </Grid>

                {/* Priority Filter */}
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="priority-filter-label">Priority</InputLabel>
                    <Select
                      labelId="priority-filter-label"
                      label="Priority"
                      name="priority"
                      value={filters.priority}
                      onChange={handleFilterChange}
                      IconComponent={KeyboardArrowDown}
                      sx={{
                        backgroundColor: 'white',
                        minWidth: 200, // Increased min width
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            mt: 1,
                            minWidth: 200, // Match dropdown width
                          }
                        }
                      }}
                      renderValue={(selected) => {
                        if (!selected) {
                          return <em>All Priorities</em>;
                        }
                        return (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={selected}
                              size="small"
                              color={priorityColor(selected)}
                              sx={{
                                height: 24,
                                fontSize: '0.75rem',
                                fontWeight: 500,
                              }}
                            />
                          </Box>
                        );
                      }}
                    >
                      <MenuItem value="">
                        <em>All Priorities</em>
                      </MenuItem>
                      {priorityOptions.map((p) => (
                        <MenuItem key={p} value={p} sx={{ minWidth: 200 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                            <Chip
                              label={p}
                              size="small"
                              color={priorityColor(p)}
                              sx={{
                                height: 24,
                                minWidth: 80,
                                fontSize: '0.75rem',
                                fontWeight: 500,
                              }}
                            />
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Quick Action Buttons */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 1.5,
                    height: '100%',
                  }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={applyFilters}
                      sx={{
                        height: 40,
                        fontWeight: 600,
                        borderRadius: 1,
                        minWidth: 120,
                      }}
                    >
                      Apply
                    </Button>

                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={clearFilters}
                      sx={{
                        height: 40,
                        borderRadius: 1,
                        borderWidth: 2,
                        minWidth: 120,
                        '&:hover': {
                          borderWidth: 2,
                        }
                      }}
                    >
                      Reset
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Active Filters Indicator */}
              {(filters.status || filters.category || filters.priority) && (
                <Box sx={{
                  mt: 3,
                  pt: 3,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  alignItems: 'center'
                }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mr: 1, fontWeight: 500 }}>
                    Active filters:
                  </Typography>
                  {filters.status && (
                    <Chip
                      label={`Status: ${filters.status}`}
                      size="small"
                      color={statusColor(filters.status)}
                      onDelete={() => setFilters({ ...filters, status: '' })}
                      sx={{
                        fontWeight: 500,
                        '& .MuiChip-deleteIcon': {
                          fontSize: '1rem'
                        }
                      }}
                    />
                  )}
                  {filters.category && (
                    <Chip
                      label={`Category: ${filters.category}`}
                      size="small"
                      onDelete={() => setFilters({ ...filters, category: '' })}
                      sx={{
                        fontWeight: 500,
                        '& .MuiChip-deleteIcon': {
                          fontSize: '1rem'
                        }
                      }}
                    />
                  )}
                  {filters.priority && (
                    <Chip
                      label={`Priority: ${filters.priority}`}
                      size="small"
                      color={priorityColor(filters.priority)}
                      onDelete={() => setFilters({ ...filters, priority: '' })}
                      sx={{
                        fontWeight: 500,
                        '& .MuiChip-deleteIcon': {
                          fontSize: '1rem'
                        }
                      }}
                    />
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Collapse>

        {/* Remaining table and content... */}
        <Divider sx={{ mb: 3 }} />

        {/* Table */}
        <TableContainer sx={{ overflowX: 'auto', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ '& .MuiTableCell-head': { backgroundColor: 'background.default', fontWeight: 600 } }}>
                <TableCell>Ref ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Reporter</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {incidents.map((inc) => (
                <TableRow key={inc._id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {inc.referenceId}
                    </Typography>
                  </TableCell>
                  <TableCell>{inc.title}</TableCell>
                  <TableCell>
                    {inc.isAnonymous || !inc.reporter
                      ? <Chip label="Anonymous" size="small" variant="outlined" />
                      : inc.reporter.name}
                  </TableCell>
                  <TableCell>
                    <Chip label={inc.category} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={inc.priority}
                      size="small"
                      color={priorityColor(inc.priority)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={inc.status}
                      size="small"
                      color={statusColor(inc.status)}
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    {inc.assignedTo?.name ||
                      <Typography variant="body2" color="text.secondary" fontStyle="italic">
                        Not assigned
                      </Typography>
                    }
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => updateStatus(inc._id, 'In Review')}
                          sx={{ minWidth: 90 }}
                        >
                          In Review
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => updateStatus(inc._id, 'Resolved')}
                          sx={{ minWidth: 90 }}
                        >
                          Resolve
                        </Button>
                      </Box>

                      <FormControl size="small" fullWidth>
                        <InputLabel>Assign</InputLabel>
                        <Select
                          value={selectedStaff[inc._id] || ''}
                          onChange={(e) =>
                            setSelectedStaff((prev) => ({
                              ...prev,
                              [inc._id]: e.target.value,
                            }))
                          }
                          label="Assign"
                          sx={{ minWidth: 140 }}
                        >
                          <MenuItem value="">None</MenuItem>
                          {staffUsers.map((s) => (
                            <MenuItem key={s._id} value={s._id}>
                              {s.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Button
                        size="small"
                        variant="contained"
                        disabled={!selectedStaff[inc._id]}
                        onClick={() => assignIncident(inc._id)}
                        sx={{ minWidth: 140 }}
                      >
                        Assign
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AdminIncidentsPage;