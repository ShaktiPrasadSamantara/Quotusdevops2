import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const categories = [
  'Bullying',
  'Harassment',
  'Discrimination',
  'Safety Hazard',
  'Other',
];

const priorities = ['Low', 'Medium', 'High', 'Critical'];

const ReportIncidentPage = () => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    incidentDate: '',
    isAnonymous: false,
    priority: 'Medium',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post(
        'http://13.205.179.91:5000/api/incidents',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(`Incident submitted. Reference ID: ${res.data.referenceId}`);
      setForm({
        title: '',
        description: '',
        category: '',
        location: '',
        incidentDate: '',
        isAnonymous: false,
        priority: 'Medium',
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to submit incident.'
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Report Incident
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Submit details of an incident. You can choose to report anonymously.
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            margin="normal"
            value={form.title}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={form.description}
            onChange={handleChange}
            required
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Category"
                name="category"
                fullWidth
                margin="normal"
                value={form.category}
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Priority"
                name="priority"
                fullWidth
                margin="normal"
                value={form.priority}
                onChange={handleChange}
              >
                {priorities.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <TextField
            label="Location"
            name="location"
            fullWidth
            margin="normal"
            value={form.location}
            onChange={handleChange}
          />
          <TextField
            label="Incident Date"
            name="incidentDate"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={form.incidentDate}
            onChange={handleChange}
          />

          <Box mt={2}>
            <label>
              <input
                type="checkbox"
                name="isAnonymous"
                checked={form.isAnonymous}
                onChange={handleChange}
              />{' '}
              Report anonymously
            </label>
          </Box>

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Submit Incident
          </Button>

          {message && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ReportIncidentPage;
