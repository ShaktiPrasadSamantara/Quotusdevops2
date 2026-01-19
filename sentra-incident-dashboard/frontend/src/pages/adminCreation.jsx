import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Avatar,
  Fade,
  createTheme,
  ThemeProvider,
  CssBaseline,
  InputAdornment,
  IconButton
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import SecurityIcon from '@mui/icons-material/Security';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#2196f3',
    },
    background: {
      default: '#f5f7ff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 12px rgba(0,0,0,0.08)',
  ],
});

const AdminCreationForm = ({ onToggleMode, mode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin' // Set default role to 'admin'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Ensure only admin role can be created
    if (formData.role !== 'admin') {
      setErrorMessage('Only admin users can be created from this form');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role // Always 'admin'
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'admin' // Reset to 'admin'
      });
      
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        pt: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container maxWidth="sm" sx={{ py: 2 }}>
          <Fade in timeout={600}>
            <Paper
              elevation={2}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.1)',
                maxWidth: '500px',
                margin: '0 auto',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 60,
                    height: 60,
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 3px 8px rgba(25, 118, 210, 0.2)',
                  }}
                >
                  <AdminPanelSettingsIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography 
                  variant="h5" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    color: 'primary.dark',
                    fontSize: '1.5rem'
                  }}
                >
                  Create Admin Account  
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    opacity: 0.8,
                    fontSize: '0.875rem'
                  }}
                >
                  Enter details to create a new administrator account
                </Typography>
              </Box>

              {success && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 1.5,
                    fontSize: '0.875rem',
                    py: 0.5
                  }}
                  onClose={() => setSuccess(false)}
                >
                  Admin account created successfully!
                </Alert>
              )}

              {errorMessage && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 1.5,
                    fontSize: '0.875rem',
                    py: 0.5
                  }}
                  onClose={() => setErrorMessage('')}
                >
                  {errorMessage}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Full Name Field */}
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ 
                      fontWeight: 600, 
                      mb: 0.5, 
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: '0.75rem'
                    }}>
                      <BadgeIcon fontSize="small" sx={{ opacity: 0.7, fontSize: '1rem' }} />
                      Full Name
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter administrator name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.875rem',
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.light',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                            borderWidth: 1,
                          }
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.75rem',
                          marginLeft: 0,
                          marginTop: 0.5
                        }
                      }}
                    />
                  </Grid>

                  {/* Email Field */}
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ 
                      fontWeight: 600, 
                      mb: 0.5, 
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: '0.75rem'
                    }}>
                      <EmailIcon fontSize="small" sx={{ opacity: 0.7, fontSize: '1rem' }} />
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter admin email address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.875rem',
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.light',
                          }
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.75rem',
                          marginLeft: 0,
                          marginTop: 0.5
                        }
                      }}
                    />
                  </Grid>

                  {/* Password and Confirm Password in One Line */}
                  <Grid item xs={12}>
                    <Grid container spacing={1.5}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ 
                          fontWeight: 600, 
                          mb: 0.5, 
                          color: 'text.primary',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontSize: '0.75rem'
                        }}>
                          <SecurityIcon fontSize="small" sx={{ opacity: 0.7, fontSize: '1rem' }} />
                          Password
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleChange}
                          error={!!errors.password}
                          variant="outlined"
                          size="small"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  edge="end"
                                  size="small"
                                  sx={{ mr: 0.5 }}
                                >
                                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.875rem',
                              '& fieldset': {
                                borderColor: '#e0e0e0',
                              },
                              '&:hover fieldset': {
                                borderColor: 'primary.light',
                              }
                            }
                          }}
                        />
                        {errors.password && (
                          <Typography variant="caption" color="error" sx={{ fontSize: '0.7rem', ml: 1, mt: 0.5, display: 'block' }}>
                            {errors.password}
                          </Typography>
                        )}
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ 
                          fontWeight: 600, 
                          mb: 0.5, 
                          color: 'text.primary',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontSize: '0.75rem'
                        }}>
                          <SecurityIcon fontSize="small" sx={{ opacity: 0.7, fontSize: '1rem' }} />
                          Confirm Password
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Confirm"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          error={!!errors.confirmPassword}
                          variant="outlined"
                          size="small"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle confirm password visibility"
                                  onClick={handleClickShowConfirmPassword}
                                  edge="end"
                                  size="small"
                                  sx={{ mr: 0.5 }}
                                >
                                  {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.875rem',
                              '& fieldset': {
                                borderColor: '#e0e0e0',
                              },
                              '&:hover fieldset': {
                                borderColor: 'primary.light',
                              }
                            }
                          }}
                        />
                        {errors.confirmPassword && (
                          <Typography variant="caption" color="error" sx={{ fontSize: '0.7rem', ml: 1, mt: 0.5, display: 'block' }}>
                            {errors.confirmPassword}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', mt: 0.5, display: 'block' }}>
                      Minimum 8 characters with uppercase, lowercase, and numbers
                    </Typography>
                  </Grid>

                  {/* User Role and Create Button in One Line */}
                  <Grid item xs={12}>
                    <Grid container spacing={1.5} alignItems="flex-end">
                      {/* User Role Field - Fixed to Admin Only */}
                      <Grid item xs={5}>
                        <Typography variant="caption" sx={{ 
                          fontWeight: 600, 
                          mb: 0.5, 
                          color: 'text.primary',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontSize: '0.75rem'
                        }}>
                          <LockOutlinedIcon fontSize="small" sx={{ opacity: 0.7, fontSize: '1rem' }} />
                          Role
                        </Typography>
                        <FormControl fullWidth variant="outlined" size="small">
                          <Select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            sx={{
                              borderRadius: 1.5,
                              fontSize: '0.875rem',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#e0e0e0',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.light',
                              },
                              backgroundColor: '#e3f2fd' // Light blue background for admin
                            }}
                            disabled={true} // Disable selection since only admin is allowed
                          >
                            <MenuItem value="admin" sx={{ fontSize: '0.875rem' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ 
                                  width: 6, 
                                  height: 6, 
                                  borderRadius: '50%', 
                                  bgcolor: '#1976d2' 
                                }} />
                                <Typography variant="body2">Administrator</Typography>
                              </Box>
                            </MenuItem>
                          </Select>
                        </FormControl>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', mt: 0.5, display: 'block' }}>
                          Only administrator accounts can be created
                        </Typography>
                      </Grid>

                      {/* Create User Button - Takes more space */}
                      <Grid item xs={7} sx={{ mt: 0.5 }}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          size="medium"
                          disabled={loading}
                          sx={{
                            py: 1.2,
                            borderRadius: 1.5,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            textTransform: 'none',
                            backgroundColor: 'primary.main',
                            height: '38px',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                              boxShadow: '0 3px 8px rgba(25, 118, 210, 0.3)',
                            },
                            '&.Mui-disabled': {
                              backgroundColor: '#b0bec5',
                              color: '#eceff1'
                            }
                          }}
                        >
                          {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <CircularProgress size={16} color="inherit" />
                              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                Creating...
                              </Typography>
                            </Box>
                          ) : (
                            'Create Admin Account'
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </form>

              <Box sx={{ 
                mt: 3, 
                pt: 2, 
                borderTop: '1px solid', 
                borderColor: '#e0e0e0',
                textAlign: 'center' 
              }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    opacity: 0.7,
                    fontSize: '0.7rem'
                  }}
                >
                  New admin will receive account credentials and can login immediately
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AdminCreationForm;