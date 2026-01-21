// pages/EditIncidentPage.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Chip,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Cancel,
  History,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const EditIncidentPage = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    incidentDate: '',
    priority: 'Medium',
  });

  const categories = [
    'Technical Issue',
    'Network Problem',
    'Software Bug',
    'Hardware Failure',
    'Account Access',
    'Data Recovery',
    'Security Concern',
    'Other'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    fetchIncidentDetails();
  }, [id]);

  const fetchIncidentDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/incidents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = res.data.data;
      setIncident(data);
      
      // Check if user can edit
      if (data.status !== 'Pending') {
        setError('Only pending incidents can be edited');
        return;
      }
      
      if (data.isAnonymous) {
        setError('Anonymous incidents cannot be edited');
        return;
      }
      
      if (!data.reporter || data.reporter._id !== user?.id) {
        setError('You are not authorized to edit this incident');
        return;
      }
      
      // Set form data
      setFormData({
        title: data.title,
        description: data.description,
        category: Array.isArray(data.category) ? data.category.join(', ') : data.category,
        location: data.location || '',
        incidentDate: data.incidentDate ? dayjs(data.incidentDate).format('YYYY-MM-DDTHH:mm') : '',
        priority: data.priority,
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch incident details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await axios.put(
        `http://localhost:5000/api/incidents/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess('Incident updated successfully!');
      
      // Navigate back to detail page after 2 seconds
      setTimeout(() => {
        if (user?.role === 'student') {
          navigate(`/student/incidents/${id}`);
        } else {
          navigate(`/incidents/${id}`);
        }
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update incident');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user?.role === 'student') {
      navigate(`/student/incidents/${id}`);
    } else {
      navigate(`/incidents/${id}`);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !incident) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Button onClick={() => navigate(-1)} sx={{ ml: 2 }}>
            Go Back
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleCancel}
          variant="outlined"
        >
          Back to Incident
        </Button>
        
        <Typography variant="h4">
          Edit Incident
        </Typography>
        
        <Box sx={{ width: 100 }} /> {/* Spacer for alignment */}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Edit Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title *"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    error={!formData.title.trim()}
                    helperText={!formData.title.trim() ? 'Title is required' : ''}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description *"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={8}
                    required
                    error={!formData.description.trim()}
                    helperText={!formData.description.trim() ? 'Description is required' : ''}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    SelectProps={{
                      multiple: true,
                      renderValue: (selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.split(',').map((value) => (
                            <Chip key={value.trim()} label={value.trim()} size="small" />
                          ))}
                        </Box>
                      )
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Typography variant="caption" color="text.secondary">
                    Select multiple categories by holding Ctrl/Cmd
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {priority}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Room 101, Building A"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Incident Date & Time"
                    name="incidentDate"
                    type="datetime-local"
                    value={formData.incidentDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                      disabled={saving || !formData.title.trim() || !formData.description.trim()}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Incident Info Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <History /> Incident Information
            </Typography>
            
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Reference ID
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {incident?.referenceId}
                </Typography>
              </CardContent>
            </Card>
            
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Current Status
                </Typography>
                <Chip
                  label={incident?.status}
                  color={incident?.status === 'Resolved' ? 'success' : 
                         incident?.status === 'In Review' ? 'info' : 'warning'}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </CardContent>
            </Card>
            
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body2">
                  {dayjs(incident?.createdAt).format('DD MMM YYYY, hh:mm A')}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {dayjs(incident?.updatedAt).format('DD MMM YYYY, hh:mm A')}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Editing Guidelines
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'text.secondary' }}>
              <li><Typography variant="body2">Only pending incidents can be edited</Typography></li>
              <li><Typography variant="body2">Provide clear and detailed descriptions</Typography></li>
              <li><Typography variant="body2">Select appropriate categories for better categorization</Typography></li>
              <li><Typography variant="body2">Update incident location if applicable</Typography></li>
              <li><Typography variant="body2">Set appropriate priority level</Typography></li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditIncidentPage;