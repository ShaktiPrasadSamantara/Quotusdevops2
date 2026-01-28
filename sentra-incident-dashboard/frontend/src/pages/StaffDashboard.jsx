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
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { 
  Visibility, 
  KeyboardArrowRight,
  Person,
  Description,
  Category,
  Flag,
  Assessment,
  CalendarToday,
  Attachment,
  InsertComment,
  OpenInNew
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusColor = (status) => {
  if (status === 'Resolved') return 'success';
  if (status === 'In Review') return 'info';
  return 'warning';
};

const IncidentDetailsDialog = ({ open, onClose, incident }) => {
  if (!incident) return null;

  const handleOpenFile = (fileUrl, fileName) => {
    // Check if the URL is relative and prepend the base URL
    let fullUrl = fileUrl;
    
    // If the URL starts with /api/uploads, prepend the backend URL
    if (fileUrl.startsWith('/api/')) {
      fullUrl = `http://localhost:5000${fileUrl}`;
    }
    
    // Open the file in a new tab
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  const isImageFile = (fileType) => {
    return fileType.startsWith('image/');
  };

  const isPdfFile = (fileType) => {
    return fileType === 'application/pdf';
  };

  const getFileIcon = (fileType) => {
    if (isImageFile(fileType)) return '🖼️';
    if (isPdfFile(fileType)) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
    if (fileType.includes('zip') || fileType.includes('compressed')) return '📦';
    return '📎';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" component="div">
            Incident Details
          </Typography>
          <Chip
            label={incident.referenceId}
            size="small"
            variant="outlined"
            sx={{ fontFamily: 'monospace' }}
          />
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {/* Title Section */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Description fontSize="small" />
              Title
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {incident.title}
            </Typography>
          </Box>

          <Divider />

          {/* Status, Priority, Category, Type in grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {/* Status */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Flag fontSize="small" />
                Status
              </Typography>
              <Chip
                label={incident.status}
                color={statusColor(incident.status)}
                size="medium"
                sx={{ minWidth: 100 }}
              />
            </Box>

            {/* Priority */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment fontSize="small" />
                Priority
              </Typography>
              <Chip
                label={incident.priority}
                size="medium"
                sx={{
                  minWidth: 100,
                  bgcolor: incident.priority === 'High' ? 'error.light' :
                          incident.priority === 'Medium' ? 'warning.light' : 'success.light',
                  color: incident.priority === 'High' ? 'error.contrastText' :
                        incident.priority === 'Medium' ? 'warning.contrastText' : 'success.contrastText'
                }}
              />
            </Box>

            {/* Category */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Category fontSize="small" />
                Category
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Array.isArray(incident.category) ? (
                  incident.category.map((cat, index) => (
                    <Chip
                      key={index}
                      label={cat}
                      size="small"
                      variant="outlined"
                    />
                  ))
                ) : (
                  <Chip
                    label={incident.category}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>

            {/* Type */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Type
              </Typography>
              <Typography variant="body1">
                {incident.type}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Description */}
          {incident.description && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Description fontSize="small" />
                Description
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {incident.description}
                </Typography>
              </Paper>
            </Box>
          )}

          <Divider />

          {/* Reporter Information */}
          {incident.reporter && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person fontSize="small" />
                Reporter Information
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {incident.reporter.name || 'N/A'}
                    </Typography>
                  </Box>
                  {incident.isAnonymous && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Reporting Type
                      </Typography>
                      <Chip
                        label="Anonymous"
                        size="small"
                        color="default"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>
          )}

          <Divider />

          {/* Attachments */}
          {incident.attachments && incident.attachments.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Attachment fontSize="small" />
                Attachments ({incident.attachments.length})
              </Typography>
              <List sx={{ width: '100%' }}>
                {incident.attachments.map((attachment, index) => (
                  <React.Fragment key={attachment._id}>
                    <ListItem 
                      sx={{ 
                        bgcolor: 'grey.50',
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': { bgcolor: 'grey.100' }
                      }}
                      secondaryAction={
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<OpenInNew />}
                          onClick={() => handleOpenFile(attachment.fileUrl, attachment.fileName)}
                          sx={{ 
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                            }
                          }}
                        >
                          Open
                        </Button>
                      }
                    >
                      <ListItemIcon>
                        <Typography variant="h6">
                          {getFileIcon(attachment.fileType)}
                        </Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" noWrap>
                            {attachment.fileName}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Size: {(attachment.fileSize / 1024).toFixed(2)} KB
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Type: {attachment.fileType}
                            </Typography>
                            {attachment.comment && (
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mt: 0.5 }}>
                                <InsertComment fontSize="inherit" sx={{ fontSize: '0.875rem' }} />
                                <Typography variant="caption" color="text.secondary">
                                  Comment: {attachment.comment}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}

          {/* Incident Date */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday fontSize="small" />
              Incident Date
            </Typography>
            <Typography variant="body1">
              {new Date(incident.incidentDate).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const StaffDashboard = () => {
  const { token, user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    const fetchAssignedIncidents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/incidents', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIncidents(res.data.data || []);
      } catch (error) {
        console.error('Staff fetch error:', error?.response?.data || error.message);
      }
    };

    if (token && user?._id) {
      fetchAssignedIncidents();
    }
  }, [token, user]);

  const handleViewIncident = (incident) => {
    setSelectedIncident(incident);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedIncident(null);
  };

  const handleRowClick = (incident, event) => {
    if (event.target.closest('button')) return;
    handleViewIncident(incident);
  };

  // Mobile responsive view
  if (isMobile) {
    return (
      <>
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
                      gap: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: 'primary.main',
                      },
                      transition: 'all 0.2s',
                    }}
                    onClick={(e) => handleRowClick(inc, e)}
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
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="caption" sx={{ 
                          bgcolor: 'primary.50', 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1,
                          fontSize: '0.7rem'
                        }}>
                          {inc.category && Array.isArray(inc.category) ? inc.category[0] : inc.category}
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
                        {inc.attachments && inc.attachments.length > 0 && (
                          <Typography variant="caption" sx={{ 
                            bgcolor: 'info.50', 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: 1,
                            fontSize: '0.7rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}>
                            <Attachment sx={{ fontSize: '0.7rem' }} />
                            {inc.attachments.length}
                          </Typography>
                        )}
                      </Box>
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewIncident(inc);
                        }}
                        sx={{ p: 0.5 }}
                      >
                        <KeyboardArrowRight fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Container>
        
        <IncidentDetailsDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          incident={selectedIncident}
        />
      </>
    );
  }

  // Tablet responsive adjustments
  if (isTablet) {
    return (
      <>
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
                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incidents.map((inc) => (
                    <TableRow 
                      key={inc._id} 
                      onClick={(e) => handleRowClick(inc, e)}
                      sx={{ 
                        cursor: 'pointer',
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
                          {inc.category && Array.isArray(inc.category) ? inc.category.join(', ') : inc.category}
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
                      <TableCell sx={{ py: 2 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewIncident(inc);
                          }}
                          sx={{ color: 'primary.main' }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {incidents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ py: 4, textAlign: 'center' }}>
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
        
        <IncidentDetailsDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          incident={selectedIncident}
        />
      </>
    );
  }

  // Desktop view
  return (
    <>
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
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold', 
                      py: 2,
                      fontSize: { xs: '0.875rem', md: '1rem' }
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incidents.map((inc) => (
                  <TableRow 
                    key={inc._id}
                    onClick={(e) => handleRowClick(inc, e)}
                    sx={{ 
                      cursor: 'pointer',
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
                        label={inc.category && Array.isArray(inc.category) ? inc.category[0] : inc.category}
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
                    <TableCell sx={{ py: 2 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewIncident(inc);
                        }}
                        sx={{ 
                          color: 'primary.main',
                          '&:hover': {
                            bgcolor: 'primary.50'
                          }
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {incidents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 8, textAlign: 'center' }}>
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
      
      <IncidentDetailsDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        incident={selectedIncident}
      />
    </>
  );
};

export default StaffDashboard;