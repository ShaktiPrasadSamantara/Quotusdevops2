import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Types dropdown options
const types = [
  'New Request',
  'Bug Fixing',
  'Update Request'
];

// Categories dropdown options (multi-select)
const categories = [
  'Wordpress Website',
  'Blog Post',
  'Newsletter',
  'CALM',
  'Port CALM',
  'Shield'
];

const priorities = ['Low', 'Medium', 'High', 'Critical'];

const MAX_FILES = 5;

const ReportIncidentPage = () => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: '',
    category: [],
    location: '',
    incidentDate: '',
    // isAnonymous: false,
    priority: 'Medium',
  });
  const [message, setMessage] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date().toLocaleString());
  const [files, setFiles] = useState([]);
  const [showNewFileUpload, setShowNewFileUpload] = useState(false);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setForm((prev) => ({
      ...prev,
      category: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (files.length >= MAX_FILES) {
      setMessage(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage('File size should be less than 10MB');
      return;
    }

    const newFile = {
      id: Date.now(),
      file,
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(2)} KB`,
      fileType: file.type,
      comment: '',
      uploadDate: new Date().toISOString(),
    };

    setFiles(prev => [...prev, newFile]);
    setShowNewFileUpload(false);
    e.target.value = ''; // Reset file input
  };

  const handleFileCommentChange = (fileId, comment) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, comment } : file
    ));
  };

  const handleRemoveFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validate files
    if (files.length === 0) {
      setMessage('Please upload at least one file');
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append form data
      Object.keys(form).forEach(key => {
        if (key === 'category') {
          formData.append(key, JSON.stringify(form[key]));
        } else {
          formData.append(key, form[key]);
        }
      });

      // Append files and their comments
      files.forEach((fileObj, index) => {
        formData.append(`files`, fileObj.file);
        formData.append(`fileComments`, fileObj.comment);
        formData.append(`fileNames`, fileObj.fileName);
      });

      const res = await axios.post(
        'http://localhost:5000/api/incidents',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      setMessage(`Incident submitted. Reference ID: ${res.data.referenceId}`);
      
      // Reset form
      setForm({
        title: '',
        description: '',
        type: '',
        category: [],
        location: '',
        incidentDate: '',
        isAnonymous: false,
        priority: 'Medium',
      });
      setFiles([]);
      setShowNewFileUpload(false);
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

          {/* Type dropdown */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Type
            </Typography>
            <TextField
              select
              name="type"
              value={form.type}
              onChange={handleChange}
              fullWidth
              size="small"
              sx={{
                mt: 0.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  height: 44,
                },
              }}
              required
            >
              {types.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Category & Priority in Grid */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <Typography variant="caption" color="text.secondary">
                Category (Select multiple)
              </Typography>
              <FormControl fullWidth sx={{ mt: 0.5 }}>
                <Select
                  name="category"
                  multiple
                  value={form.category}
                  onChange={handleCategoryChange}
                  input={<OutlinedInput />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      height: 44,
                      minWidth: 200,
                    },
                  }}
                  required
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="text.secondary">
                Priority
              </Typography>
              <TextField
                select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={{
                  mt: 0.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    height: 44,
                  },
                }}
              >
                {priorities.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {/* Incident Date field with live updating time */}
          <TextField
            label="Incident Date & Time"
            name="incidentDate"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={currentDateTime}
            InputProps={{
              readOnly: true,
            }}
            helperText="Date and time are automatically set to current time"
          />

          {/* Hidden field to store ISO format for backend */}
          <input
            type="hidden"
            name="incidentDateISO"
            value={new Date().toISOString()}
          />

          {/* File Upload Section */}
          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Attachments
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Upload supporting files (Max {MAX_FILES} files, 10MB each)
            </Typography>

            {/* List of uploaded files with comments */}
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {files.map((fileObj, index) => (
                <React.Fragment key={fileObj.id}>
                  <ListItem alignItems="flex-start">
                    <AttachFileIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <ListItemText
                      primary={fileObj.fileName}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            Size: {fileObj.fileSize}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="text.secondary">
                            Type: {fileObj.fileType}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleRemoveFile(fileObj.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  {/* Comment box for each file */}
                  <Box sx={{ ml: 7, mr: 2, mb: 2 }}>
                    <TextField
                      label={`Comment for ${fileObj.fileName}`}
                      fullWidth
                      multiline
                      rows={2}
                      value={fileObj.comment}
                      onChange={(e) => handleFileCommentChange(fileObj.id, e.target.value)}
                      placeholder="Add a comment about this file..."
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  
                  {index < files.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>

            {/* Add new file button */}
            {files.length < MAX_FILES && !showNewFileUpload && (
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                onClick={() => setShowNewFileUpload(true)}
                sx={{ mt: 2 }}
              >
                Add Attachment
              </Button>
            )}

            {/* File upload input (shown when button is clicked) */}
            {showNewFileUpload && (
              <Box sx={{ mt: 2 }}>
                <input
                  accept="*/*"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                  <Button
                    component="span"
                    variant="contained"
                    startIcon={<AttachFileIcon />}
                  >
                    Choose File
                  </Button>
                </label>
                <Typography variant="caption" sx={{ ml: 2 }}>
                  Click to select a file
                </Typography>
              </Box>
            )}

            {/* File count indicator */}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {files.length} of {MAX_FILES} files uploaded
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Submit Incident
          </Button>

          {message && (
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 2, 
                p: 1, 
                borderRadius: 1,
                backgroundColor: message.includes('Reference ID') ? 'success.light' : 'error.light',
                color: message.includes('Reference ID') ? 'success.contrastText' : 'error.contrastText',
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ReportIncidentPage;