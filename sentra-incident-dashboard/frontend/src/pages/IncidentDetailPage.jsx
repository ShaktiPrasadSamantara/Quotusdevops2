import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Chip,
    Grid,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemText,
    Button,
    CircularProgress,
    Alert,
    Avatar,
    ListItemAvatar,
    ListItemIcon,
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    History,
    Description,
    Category,
    LocationOn,
    Event,
    PriorityHigh,
    Person,
    AttachFile,
    Download,
    Visibility,
    Comment,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

const IncidentDetailPage = () => {
    const { id } = useParams();
    const { token, user } = useAuth();
    const navigate = useNavigate();

    const [incident, setIncident] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        console.log('Incident ID from params:', id); // Debug log

        if (!id || id === 'undefined') {
            setError('Invalid incident ID');
            setLoading(false);
            return;
        }

        fetchIncidentDetails();
        fetchIncidentHistory();
        fetchComments();
    }, [id]);

    const fetchIncidentDetails = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await axios.get(`http://localhost:5000/api/incidents/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Incident data:', res.data.data); // Debug log
            setIncident(res.data.data);
        } catch (error) {
            console.error('Error fetching incident:', error);
            setError(error.response?.data?.message || 'Failed to fetch incident details');
        } finally {
            setLoading(false);
        }
    };

    const fetchIncidentHistory = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/incidents/${id}/history`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHistory(res.data.data);
        } catch (error) {
            console.error('Failed to fetch history', error);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/incidents/${id}/comments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComments(res.data.data);
        } catch (error) {
            console.error('Failed to fetch comments', error);
        }
    };

    // Helper function to format date nicely
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Helper function for relative time
    const getRelativeTime = (dateString) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'just now';
            if (diffMins < 60) return `${diffMins} minutes ago`;
            if (diffHours < 24) return `${diffHours} hours ago`;
            if (diffDays < 7) return `${diffDays} days ago`;
            return formatDate(dateString);
        } catch (error) {
            return 'Invalid date';
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'warning',
            'In Review': 'info',
            'Resolved': 'success'
        };
        return colors[status] || 'default';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'Low': 'success',
            'Medium': 'warning',
            'High': 'error',
            'Critical': 'error'
        };
        return colors[priority] || 'default';
    };

    const downloadAttachment = (attachment) => {
        const link = document.createElement('a');
        link.href = `http://localhost:5000${attachment.fileUrl}`;
        link.download = attachment.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // In your IncidentDetailPage.js, update the canEdit function:

    const canEdit = () => {
        if (!incident || !user) {
            console.log('Cannot edit: No incident or user');
            return false;
        }

        console.log('Incident status:', incident.status);
        console.log('Is anonymous:', incident.isAnonymous);
        console.log('User ID:', user.id);

        // Only pending incidents can be edited
        if (incident.status !== 'Pending') {
            console.log('Cannot edit: Incident status is not Pending');
            return false;
        }

        // TEMPORARILY REMOVE THIS CHECK to show edit button for all pending incidents
        // if (incident.isAnonymous) {
        //   console.log('Cannot edit: Incident is anonymous');
        //   return false;
        // }

        console.log('Can edit: Incident is pending');
        return true;
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error || !incident) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error || 'Incident not found'}
                    <Button onClick={() => navigate(-1)} sx={{ ml: 2 }}>
                        Back to Incidents
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
                    onClick={() => navigate(-1)}
                    variant="outlined"
                >
                    Back to Incidents
                </Button>

                {canEdit() && (
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => navigate(`/incidents/${incident.id || incident._id}/edit`)}
                    >
                        Edit Incident
                    </Button>
                )}
            </Box>

            {/* Debug Info - Remove in production */}
            {/* {process.env.NODE_ENV === 'development' && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Debug: Status: {incident.status} |
                    Anonymous: {incident.isAnonymous ? 'Yes' : 'No'} |
                    Reporter: {incident.reporter ? incident.reporter.name : 'None'} |
                    Can Edit: {canEdit() ? 'Yes' : 'No'}
                </Alert>
            )} */}

            <Grid container spacing={3}>
                {/* Incident Details Card */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    {incident.title}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    Reference ID: <strong>{incident.referenceId}</strong>
                                </Typography>
                            </Box>
                            <Chip
                                label={incident.status}
                                color={getStatusColor(incident.status)}
                                size="medium"
                            />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Description /> Description
                        </Typography>
                        <Typography variant="body1" paragraph sx={{
                            whiteSpace: 'pre-wrap',
                            bgcolor: 'background.default',
                            p: 2,
                            borderRadius: 1,
                            borderLeft: 4,
                            borderColor: 'primary.main'
                        }}>
                            {incident.description}
                        </Typography>

                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Category sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Category
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                                            {Array.isArray(incident.category) ? (
                                                incident.category.map((cat, index) => (
                                                    <Chip key={index} label={cat} size="small" variant="outlined" />
                                                ))
                                            ) : (
                                                <Chip label={incident.category} size="small" variant="outlined" />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <PriorityHigh sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Priority
                                        </Typography>
                                        <Chip
                                            label={incident.priority}
                                            color={getPriorityColor(incident.priority)}
                                            size="small"
                                            sx={{ mt: 0.5 }}
                                        />
                                    </Box>
                                </Box>
                            </Grid>

                            {incident.type && (
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Type
                                            </Typography>
                                            <Typography variant="body1">{incident.type}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            )}

                            {incident.incidentDate && (
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Event sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Incident Date
                                            </Typography>
                                            <Typography variant="body1">
                                                {formatDate(incident.incidentDate)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            )}

                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Event sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Reported On
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDate(incident.createdAt)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Event sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Last Updated
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDate(incident.updatedAt)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Attachments Section */}
                        {incident.attachments && incident.attachments.length > 0 && (
                            <>
                                <Divider sx={{ my: 3 }} />
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AttachFile /> Attachments ({incident.attachments.length})
                                </Typography>
                                <Grid container spacing={2}>
                                    {incident.attachments.map((file, index) => (
                                        <Grid item xs={12} sm={6} key={index}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <AttachFile sx={{ mr: 1, color: 'primary.main' }} />
                                                        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                                                            {file.fileName}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {(file.fileSize / 1024).toFixed(2)} KB • {file.fileType}
                                                    </Typography>
                                                    {file.comment && (
                                                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                                                            "{file.comment}"
                                                        </Typography>
                                                    )}
                                                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                                        <Button
                                                            size="small"
                                                            startIcon={<Visibility />}
                                                            onClick={() => window.open(`http://localhost:5000${file.fileUrl}`, '_blank')}
                                                        >
                                                            View
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            startIcon={<Download />}
                                                            onClick={() => downloadAttachment(file)}
                                                        >
                                                            Download
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        )}
                    </Paper>

                    {/* Comments Section (if implemented) */}
                    {comments.length > 0 && (
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Comment /> Comments & Updates
                            </Typography>
                            <List>
                                {comments.map((comment) => (
                                    <ListItem key={comment._id} alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar>
                                                {comment.commenterName?.[0] || 'S'}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1">
                                                    {comment.commenterName || 'System'}
                                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                                        {getRelativeTime(comment.createdAt)}
                                                    </Typography>
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                    sx={{ display: 'block', mt: 0.5 }}
                                                >
                                                    {comment.text}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Grid>

                {/* Sidebar with History and Assignment Info */}
                <Grid item xs={12} md={4}>
                    {/* Assignment Info */}
                    {(incident.reporter || incident.assignedTo) && (
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person /> Incident Info
                            </Typography>

                            {incident.reporter && !incident.isAnonymous && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Reported By
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                                            {incident.reporter.name?.[0]}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2">{incident.reporter.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {incident.reporter.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            {incident.isAnonymous && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Reported By
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                        Anonymous Report
                                    </Typography>
                                </Box>
                            )}

                            {incident.assignedTo && (
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Assigned To
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                                            {incident.assignedTo.name?.[0]}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2">{incident.assignedTo.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {incident.assignedTo.role}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                        </Paper>
                    )}

                    {/* History Timeline */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: '-flex', alignItems: 'center', gap: 1 }}>
                            <History /> Change History
                        </Typography>
                        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                            {history.length > 0 ? (
                                history
                                    .slice()
                                    .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))
                                    .map((record, index) => (
                                        <ListItem key={index} alignItems="flex-start" sx={{ py: 1 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <Avatar sx={{ width: 24, height: 24, bgcolor: getStatusColor(record.status) }}>
                                                    {record.changedBy?.name?.[0] || 'S'}
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body2">
                                                        <strong>{record.note}</strong>
                                                    </Typography>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                            {formatDate(record.changedAt)}
                                                        </Typography>
                                                        {record.changedBy && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                By {record.changedBy.name}
                                                            </Typography>
                                                        )}
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))
                            ) : (
                                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                                    No history records found
                                </Typography>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default IncidentDetailPage;