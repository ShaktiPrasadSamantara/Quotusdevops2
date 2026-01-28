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
  FormControl,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  IconButton,
  Avatar,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Cancel,
  History,
  Info,
  Warning,
  CheckCircle,
  EditNote,
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
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    category: [],
    location: '',
    incidentDate: '',
    priority: 'Medium',
  });

  const [touched, setTouched] = useState({
    title: false,
    description: false,
    type: false,
    category: false,
  });

  // Match the categories from ReportIncidentPage
  const types = [
    'New Request',
    'Bug Fixing',
    'Update Request'
  ];

  const categories = [
    'Wordpress Website',
    'Blog Post',
    'Newsletter',
    'CALM',
    'Port CALM',
    'Shield'
  ];

  const priorities = [
    { value: 'Low', color: 'success', icon: '🟢' },
    { value: 'Medium', color: 'warning', icon: '🟡' },
    { value: 'High', color: 'error', icon: '🔴' },
    { value: 'Critical', color: 'error', icon: '⚫' }
  ];

  const steps = ['Basic Information', 'Details', 'Review'];

  useEffect(() => {
    fetchIncidentDetails();
  }, [id]);

  const fetchIncidentDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`http://localhost:5000/api/incidents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = res.data.data;
      setIncident(data);
      
      if (data.status !== 'Pending') {
        setError('Only pending incidents can be edited');
        setLoading(false);
        return;
      }
      
      setFormData({
        title: data.title || '',
        description: data.description || '',
        type: data.type || '',
        category: Array.isArray(data.category) ? data.category : (data.category ? [data.category] : []),
        location: data.location || '',
        incidentDate: data.incidentDate ? dayjs(data.incidentDate).format('YYYY-MM-DDTHH:mm') : '',
        priority: data.priority || 'Medium',
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch incident details');
      console.error('Error fetching incident:', error);
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
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      category: typeof value === 'string' ? value.split(',') : value
    }));
    
    setTouched(prev => ({
      ...prev,
      category: true
    }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleStepChange = (step) => {
    if (step < steps.length) {
      setActiveStep(step);
    }
  };

  const handleNext = () => {
    // Validate current step
    if (activeStep === 0) {
      if (!formData.title.trim() || !formData.description.trim()) {
        setTouched({ title: true, description: true });
        return;
      }
    } else if (activeStep === 1) {
      if (!formData.type || formData.category.length === 0) {
        setTouched({ type: true, category: true });
        return;
      }
    }
    
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.type || formData.category.length === 0) {
      setTouched({
        title: true,
        description: true,
        type: true,
        category: true,
      });
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const dataToSend = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        location: formData.location,
        incidentDate: formData.incidentDate,
        priority: formData.priority,
      };

      const response = await axios.put(
        `http://localhost:5000/api/incidents/${id}`,
        dataToSend,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      setSuccess('Incident updated successfully!');
      
      setTimeout(() => {
        navigate(`/incidents/${id}`);
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || error.response?.data?.error || 'Failed to update incident');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/incidents/${id}`);
  };

  const getPriorityIcon = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj?.icon || '🟡';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
            Loading incident details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error && !incident) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 2, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={() => handleBlur('title')}
                required
                error={touched.title && !formData.title.trim()}
                helperText={touched.title && !formData.title.trim() ? 'Title is required' : 'Give a clear, concise title for the incident'}
                variant="outlined"
                size="medium"
                InputProps={{
                  startAdornment: (
                    <EditNote sx={{ mr: 1, color: 'text.secondary' }} />
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={() => handleBlur('description')}
                multiline
                rows={6}
                required
                error={touched.description && !formData.description.trim()}
                helperText={touched.description && !formData.description.trim() ? 'Description is required' : 'Provide detailed information about the incident'}
                variant="outlined"
                size="medium"
                placeholder="Describe the issue in detail. Include steps to reproduce if applicable..."
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={touched.type && !formData.type}>
                <TextField
                  select
                  label="Type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  onBlur={() => handleBlur('type')}
                  required
                  variant="outlined"
                  size="medium"
                >
                  {types.map((type) => (
                    <MenuItem key={type} value={type}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {type === 'Bug Fixing' && '🐛'}
                        {type === 'New Request' && '🆕'}
                        {type === 'Update Request' && '🔄'}
                        {type}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
                <FormHelperText>
                  {touched.type && !formData.type ? 'Type is required' : 'Select the type of request'}
                </FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={touched.category && formData.category.length === 0}>
                <TextField
                  select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  onBlur={() => handleBlur('category')}
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, py: 0.5 }}>
                        {selected && selected.length > 0 ? (
                          selected.map((value) => (
                            <Chip 
                              key={value} 
                              label={value} 
                              size="small"
                              sx={{ 
                                bgcolor: 'primary.light', 
                                color: 'primary.contrastText',
                                fontWeight: 500
                              }}
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Select categories...
                          </Typography>
                        )}
                      </Box>
                    )
                  }}
                  required
                  variant="outlined"
                  size="medium"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
                <FormHelperText>
                  {touched.category && formData.category.length === 0 ? 'At least one category is required' : 'Hold Ctrl/Cmd to select multiple'}
                </FormHelperText>
              </FormControl>
            </Grid>
            
            {/* <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                variant="outlined"
                size="medium"
                placeholder="e.g., Room 101, Building A"
                helperText="Optional - Specify where the incident occurred"
              />
            </Grid> */}
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Incident Date & Time"
                name="incidentDate"
                type="datetime-local"
                value={formData.incidentDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="medium"
                helperText="When did the incident occur?"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  select
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  variant="outlined"
                  size="medium"
                  helperText="How urgent is this incident?"
                >
                  {priorities.map((priority) => (
                    <MenuItem key={priority.value} value={priority.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography component="span" fontSize="18px">
                          {priority.icon}
                        </Typography>
                        <Typography>{priority.value}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Alert 
              severity="info" 
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<Info />}
            >
              Review your changes before submitting
            </Alert>
            
            <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="primary" />
                Incident Summary
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                  <Typography variant="body1" fontWeight={500}>{formData.title}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 0.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                      {formData.description}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                  <Chip 
                    label={formData.type} 
                    size="small" 
                    sx={{ mt: 0.5, bgcolor: 'info.light', color: 'info.contrastText' }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Priority</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Typography component="span" fontSize="18px">
                      {getPriorityIcon(formData.priority)}
                    </Typography>
                    <Chip 
                      label={formData.priority} 
                      size="small"
                      color={priorities.find(p => p.value === formData.priority)?.color || 'default'}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Categories</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {formData.category.map((cat) => (
                      <Chip 
                        key={cat} 
                        label={cat} 
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
                
                {formData.location && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                    <Typography variant="body1">{formData.location}</Typography>
                  </Grid>
                )}
                
                {formData.incidentDate && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Incident Date</Typography>
                    <Typography variant="body1">
                      {dayjs(formData.incidentDate).format('DD MMM YYYY, hh:mm A')}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
            
            <Alert 
              severity="warning" 
              sx={{ borderRadius: 2 }}
              icon={<Warning />}
            >
              After submission, the incident status will remain as "Pending" until reviewed by admin.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={handleCancel}
            sx={{ 
              border: 1, 
              borderColor: 'divider',
              borderRadius: 2,
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Edit Incident
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Update details for incident: <strong>{incident?.referenceId}</strong>
            </Typography>
          </Box>
        </Box>
        
        <Chip
          label="Pending"
          color="warning"
          size="medium"
          icon={<History />}
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* Alerts */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleCancel}>
              View Incident
            </Button>
          }
        >
          {success}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Main Form Area */}
        <Grid item xs={12} lg={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}
          >
            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel 
                    StepIconProps={{
                      sx: {
                        '&.Mui-completed': { color: 'success.main' },
                        '&.Mui-active': { color: 'primary.main' },
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step Content */}
            {renderStepContent(activeStep)}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5, pt: 3, borderTop: 1, borderColor: 'divider' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={activeStep === 0 ? handleCancel : handleBack}
                disabled={saving}
                sx={{ borderRadius: 2, px: 3 }}
              >
                {activeStep === 0 ? 'Cancel' : 'Back'}
              </Button>
              
              <Stack direction="row" spacing={2}>
                {activeStep < steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ borderRadius: 2, px: 4 }}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                    onClick={handleSubmit}
                    disabled={saving}
                    sx={{ borderRadius: 2, px: 4 }}
                  >
                    {saving ? 'Updating...' : 'Update Incident'}
                  </Button>
                )}
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              position: 'sticky',
              top: 20
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <History /> Incident Details
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, fontSize: 20 }}>
                {incident?.referenceId?.slice(-2)}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Reference ID
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {incident?.referenceId}
                </Typography>
              </Box>
            </Box>

            <Stack spacing={2}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Current Status
                  </Typography>
                  <Chip
                    label={incident?.status}
                    color="warning"
                    sx={{ fontWeight: 600 }}
                  />
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Timeline
                  </Typography>
                  <Box>
                    <Typography variant="body2">
                      Created: {dayjs(incident?.createdAt).format('DD MMM YYYY')}
                    </Typography>
                    <Typography variant="body2">
                      Last Updated: {dayjs(incident?.updatedAt).format('DD MMM YYYY')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Editing Guidelines
                      <Tooltip title="These guidelines help ensure your incident is processed efficiently">
                        <Info fontSize="small" />
                      </Tooltip>
                    </Box>
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <CheckCircle fontSize="small" color="success" />
                      Provide clear and detailed descriptions
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <CheckCircle fontSize="small" color="success" />
                      Select appropriate categories
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <CheckCircle fontSize="small" color="success" />
                      Set accurate priority level
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <CheckCircle fontSize="small" color="success" />
                      Include location if applicable
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditIncidentPage;