import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Button, 
  Typography, 
  Box, 
  Card,
  CardContent,
  LinearProgress,
  useTheme,
  useMediaQuery,
  alpha,
  Chip,
  Avatar,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CardActionArea,
  CardActions,
  Skeleton
} from '@mui/material';
import { 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Shield,
  BarChart3,
  Users,
  Settings,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Eye,
  Download,
  RefreshCw,
  Calendar,
  Database,
  Server,
  ShieldCheck,
  AlertOctagon,
  TrendingDown,
  ExternalLink,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Color palette from your variables
const colors = {
  darkBlue: '#1e293b',
  lightGray: '#f8fafc',
  white: '#ffffff',
  darkGray: '#475569',
  blue: '#3b82f6',
  borderGray: '#e2e8f0',
  mediumBlue: '#334155',
  darkerBlue: '#2563eb',
  disabledGray: '#cbd5e1'
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inReview: 0,
    resolved: 0,
    percentageResolved: 0,
    avgResolutionTime: '2.5',
    satisfactionRate: 94
  });
  
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    api: 'operational',
    database: 'connected',
    storage: 78,
    lastBackup: '2 hours ago',
    uptime: '99.9%'
  });

  useEffect(() => {
    fetchDashboardData();
    // Simulate system status check
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        storage: Math.min(100, prev.storage + 0.1)
      }));
    }, 60000);
    
    return () => clearInterval(interval);
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://13.205.179.91:5000/api/incidents', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const incidents = res.data;

      console.log("admin Token", token);

      const total = incidents.length;
      const pending = incidents.filter((i) => i.status === 'Pending').length;
      const inReview = incidents.filter((i) => i.status === 'In Review').length;
      const resolved = incidents.filter((i) => i.status === 'Resolved').length;
      const percentageResolved = total > 0 ? Math.round((resolved / total) * 100) : 0;

      const recent = incidents
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
        .slice(0, isMobile ? 3 : 5);

      setStats(prev => ({
        ...prev,
        total,
        pending,
        inReview,
        resolved,
        percentageResolved
      }));
      setRecentActivity(recent);
    } catch (error) {
      console.error('Error fetching stats', error.message);
      // For demo purposes, use mock data
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    setStats({
      total: 142,
      pending: 24,
      inReview: 18,
      resolved: 100,
      percentageResolved: 70,
      avgResolutionTime: '2.5',
      satisfactionRate: 94
    });
    
    setRecentActivity([
      { id: 1, title: 'Unauthorized Access Attempt', category: 'Security', status: 'In Review', createdAt: new Date().toISOString() },
      { id: 2, title: 'Network Connectivity Issue', category: 'Infrastructure', status: 'Pending', createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: 3, title: 'Data Privacy Concern', category: 'Compliance', status: 'Resolved', createdAt: new Date(Date.now() - 172800000).toISOString() },
      { id: 4, title: 'System Performance Degradation', category: 'Performance', status: 'In Review', createdAt: new Date(Date.now() - 259200000).toISOString() },
      { id: 5, title: 'User Access Request', category: 'Access Control', status: 'Pending', createdAt: new Date(Date.now() - 345600000).toISOString() }
    ]);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return colors.blue;
      case 'In Review': return '#f59e0b';
      case 'Resolved': return '#10b981';
      default: return colors.darkGray;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock size={14} />;
      case 'In Review': return <AlertCircle size={14} />;
      case 'Resolved': return <CheckCircle size={14} />;
      default: return <AlertTriangle size={14} />;
    }
  };

  const statCards = [
    {
      title: 'Total Incidents',
      value: stats.total,
      icon: <FileText size={20} />,
      color: colors.blue,
      trend: '+12%',
      trendIcon: stats.total > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />,
      trendColor: stats.total > 0 ? '#10b981' : '#ef4444',
      description: 'Total reported incidents'
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: <Clock size={20} />,
      color: '#f59e0b',
      trend: '+5%',
      trendIcon: <TrendingUp size={14} />,
      trendColor: '#f59e0b',
      description: 'Awaiting initial review'
    },
    {
      title: 'In Review',
      value: stats.inReview,
      icon: <AlertCircle size={20} />,
      color: '#3b82f6',
      trend: '+8%',
      trendIcon: <TrendingUp size={14} />,
      trendColor: '#3b82f6',
      description: 'Currently under investigation'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: <CheckCircle size={20} />,
      color: '#10b981',
      trend: '+18%',
      trendIcon: <TrendingUp size={14} />,
      trendColor: '#10b981',
      description: 'Successfully resolved cases'
    },
  ];

  const quickActions = [
    {
      title: 'Incident Management',
      description: 'Manage all reported incidents',
      icon: <Shield size={18} />,
      path: '/admin/incidents',
      color: colors.blue
    },
    {
      title: 'Analytics Dashboard',
      description: 'View detailed reports & insights',
      icon: <BarChart3 size={18} />,
      path: '/admin/analytics',
      color: '#8b5cf6'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts & permissions',
      icon: <Users size={18} />,
      path: '/admin/users',
      color: '#10b981'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: <Settings size={18} />,
      path: '/admin/settings',
      color: colors.darkGray
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today, ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday, ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
    });
  };

  const getSystemStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'operational':
      case 'connected':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return colors.darkGray;
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: colors.lightGray,
      minHeight: '100vh',
      py: { xs: 1.5, sm: 3 }
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Header Section */}
        <Box sx={{ mb: { xs: 2, md: 4 } }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={{ xs: 1.5, sm: 0 }}
            sx={{ mb: 2 }}
          >
            <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                sx={{ 
                  fontWeight: 700, 
                  color: colors.darkBlue,
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
                }}
              >
                Security Incident Dashboard
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: colors.darkGray,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                Comprehensive overview of security incidents and system performance metrics
              </Typography>
            </Box>
            <Stack 
              direction="row" 
              spacing={1}
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                mt: { xs: 1, sm: 0 }
              }}
            >
              <Tooltip title="Refresh Dashboard Data">
                <IconButton 
                  onClick={fetchDashboardData}
                  sx={{ 
                    border: `1px solid ${colors.borderGray}`,
                    borderRadius: 1.5,
                    backgroundColor: colors.white,
                    '&:hover': {
                      backgroundColor: alpha(colors.blue, 0.05),
                      borderColor: colors.blue
                    },
                    minWidth: 'auto',
                    p: { xs: 1, sm: 1.25 }
                  }}
                >
                  <RefreshCw size={isMobile ? 16 : 18} color={colors.darkGray} />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<Download size={isMobile ? 14 : 16} />}
                sx={{ 
                  borderRadius: 1.5, 
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.25 },
                  backgroundColor: colors.blue,
                  '&:hover': {
                    backgroundColor: colors.darkerBlue
                  },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  whiteSpace: 'nowrap',
                  minWidth: 'auto',
                  flexShrink: 0
                }}
              >
                {isMobile ? 'Export' : 'Export Report'}
              </Button>
            </Stack>
          </Stack>
          <Divider sx={{ borderColor: colors.borderGray }} />
        </Box>

        {/* Stats Overview Cards - Equal Width Grid */}
        <Grid 
          container 
          spacing={{ xs: 1.5, sm: 2, md: 3 }} 
          sx={{ 
            mb: { xs: 2, md: 4 },
            '& .MuiGrid-item': {
              display: 'flex'
            }
          }}
        >
          {statCards.map((card) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              lg={3} 
              key={card.title}
              sx={{ 
                minHeight: { xs: 'auto', sm: 140 },
                height: '100%'
              }}
            >
              {loading ? (
                <Skeleton 
                  variant="rectangular" 
                  height={140}
                  sx={{ 
                    borderRadius: 3,
                    backgroundColor: alpha(colors.darkBlue, 0.1),
                    width: '100%'
                  }}
                />
              ) : (
                <Card 
                  sx={{ 
                    borderRadius: 3,
                    border: `1px solid ${colors.borderGray}`,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    backgroundColor: colors.white,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    width: '270px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-2px)',
                      borderColor: alpha(card.color, 0.3)
                    }
                  }}
                >
                  <CardContent 
                    sx={{ 
                      p: { xs: 1.5, sm: 2, md: 2.5 },
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Stack 
                      direction="row" 
                      justifyContent="space-between" 
                      alignItems="flex-start" 
                      sx={{ mb: { xs: 1.5, sm: 2 } }}
                    >
                      <Avatar
                        sx={{
                          backgroundColor: alpha(card.color, 0.1),
                          color: card.color,
                          width: { xs: 36, sm: 40, md: 48 },
                          height: { xs: 36, sm: 40, md: 48 },
                          borderRadius: 2,
                          '& svg': {
                            width: { xs: 18, sm: 20 },
                            height: { xs: 18, sm: 20 }
                          }
                        }}
                      >
                        {card.icon}
                      </Avatar>
                      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                        <Chip
                          label={card.trend}
                          size="small"
                          sx={{
                            backgroundColor: alpha(card.trendColor, 0.1),
                            color: card.trendColor,
                            border: 'none',
                            fontSize: { xs: '0.625rem', sm: '0.6875rem' },
                            fontWeight: 600,
                            mb: 0.5,
                            height: { xs: 20, sm: 24 }
                          }}
                          icon={card.trendIcon}
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: colors.darkGray,
                            display: 'block',
                            fontSize: { xs: '0.625rem', sm: '0.75rem' }
                          }}
                        >
                          vs last week
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography 
                      variant={isMobile ? "h5" : "h4"} 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 0.5,
                        color: colors.darkBlue,
                        fontSize: { 
                          xs: '1.5rem', 
                          sm: '1.75rem', 
                          md: '2rem' 
                        },
                        lineHeight: 1.2
                      }}
                    >
                      {card.value}
                    </Typography>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600,
                        color: colors.darkBlue,
                        mb: 0.5,
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: colors.darkGray,
                        fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                        mt: 'auto'
                      }}
                    >
                      {card.description}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Grid>
          ))}
        </Grid>

        {/* Main Content Area */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Left Column - Main Content */}
          <Grid item xs={12} lg={8}>
            {/* Performance Metrics */}
            <Card sx={{ 
              borderRadius: 1.5, 
              mb: { xs: 2, md: 3 }, 
              border: `1px solid ${colors.borderGray}`,
              backgroundColor: colors.white,
              overflow: 'hidden'
            }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 1.5, md: 1.5 } }}>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  justifyContent="space-between" 
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  spacing={{ xs: 1, sm: 0 }}
                  sx={{ mb: 3 }}
                >
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        color: colors.darkBlue,
                        fontSize: { xs: '1rem', sm: '1.125rem' }
                      }}
                    >
                      Resolution Performance
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: colors.darkGray,
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' }
                      }}
                    >
                      Current month performance metrics
                    </Typography>
                  </Box>
                  <Chip
                    label={`${stats.percentageResolved}% Success Rate`}
                    sx={{
                      backgroundColor: stats.percentageResolved > 80 
                        ? alpha('#10b981', 0.1) 
                        : stats.percentageResolved > 60 
                        ? alpha('#f59e0b', 0.1) 
                        : alpha('#ef4444', 0.1),
                      color: stats.percentageResolved > 80 
                        ? '#10b981' 
                        : stats.percentageResolved > 60 
                        ? '#f59e0b' 
                        : '#ef4444',
                      fontWeight: 600,
                      border: 'none',
                      fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                      height: { xs: 24, sm: 32 }
                    }}
                    size="small"
                  />
                </Stack>
                
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: colors.darkGray, 
                        fontWeight: 500,
                        fontSize: { xs: '0.8125rem', sm: '0.875rem' }
                      }}
                    >
                      Resolution Progress
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: colors.darkBlue,
                        fontSize: { xs: '0.8125rem', sm: '0.875rem' }
                      }}
                    >
                      {stats.percentageResolved}%
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.percentageResolved} 
                    sx={{ 
                      height: { xs: 6, sm: 8 },
                      borderRadius: 1.5,
                      backgroundColor: alpha(colors.blue, 0.1),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${colors.blue}, ${colors.darkerBlue})`,
                      }
                    }}
                  />
                </Box>

                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={6}>
                    <Box sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      borderRadius: 1.5, 
                      border: `1px solid ${alpha(colors.blue, 0.2)}`,
                      backgroundColor: alpha(colors.blue, 0.03),
                      height: '100%'
                    }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Clock size={isMobile ? 14 : 16} color={colors.blue} />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: colors.darkGray, 
                            fontWeight: 500,
                            fontSize: { xs: '0.75rem', sm: '0.8125rem' }
                          }}
                        >
                          Avg. Resolution Time
                        </Typography>
                      </Stack>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          color: colors.darkBlue,
                          fontSize: { xs: '1rem', sm: '1.125rem' }
                        }}
                      >
                        {stats.avgResolutionTime} days
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      borderRadius: 1.5, 
                      border: `1px solid ${alpha('#10b981', 0.2)}`,
                      backgroundColor: alpha('#10b981', 0.03),
                      height: '100%'
                    }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <CheckCircle size={isMobile ? 14 : 16} color="#10b981" />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: colors.darkGray, 
                            fontWeight: 500,
                            fontSize: { xs: '0.75rem', sm: '0.8125rem' }
                          }}
                        >
                          Satisfaction Rate
                        </Typography>
                      </Stack>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          color: colors.darkBlue,
                          fontSize: { xs: '1rem', sm: '1.125rem' }
                        }}
                      >
                        {stats.satisfactionRate}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Recent Incidents Table */}
            <Card sx={{ 
              borderRadius: 1.5, 
              border: `1px solid ${colors.borderGray}`,
              backgroundColor: colors.white,
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                p: { xs: 1.5, sm: 2, md: 3 }, 
                borderBottom: `1px solid ${colors.borderGray}`,
                backgroundColor: alpha(colors.darkBlue, 0.02)
              }}>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  justifyContent="space-between" 
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  spacing={{ xs: 1, sm: 0 }}
                >
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        color: colors.darkBlue,
                        fontSize: { xs: '1rem', sm: '1.125rem' }
                      }}
                    >
                      Recent Incidents
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: colors.darkGray,
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' }
                      }}
                    >
                      Last {isMobile ? '3' : '5'} reported incidents
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ mt: { xs: 1, sm: 0 } }}>
                    <IconButton 
                      size="small"
                      sx={{ 
                        border: `1px solid ${colors.borderGray}`,
                        borderRadius: 1.5,
                        p: { xs: 0.5, sm: 0.75 }
                      }}
                    >
                      <Filter size={isMobile ? 14 : 16} />
                    </IconButton>
                    <Button 
                      size="small" 
                      endIcon={<ChevronRight size={isMobile ? 14 : 16} />}
                      onClick={() => navigate('/admin/incidents')}
                      sx={{ 
                        color: colors.blue,
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                        minWidth: 'auto',
                        p: { xs: '4px 8px', sm: '6px 12px' }
                      }}
                    >
                      View All
                    </Button>
                  </Stack>
                </Stack>
              </Box>

              <TableContainer>
                <Table sx={{ minWidth: 300 }}>
                  <TableHead>
                    <TableRow sx={{ 
                      backgroundColor: alpha(colors.darkBlue, 0.02),
                      '& th': {
                        borderBottom: `1px solid ${colors.borderGray}`,
                        py: { xs: 1, sm: 1.5, md: 2 },
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                        fontWeight: 600,
                        color: colors.darkGray,
                        px: { xs: 1, sm: 1.5, md: 2 }
                      }
                    }}>
                      {!isMobile && <TableCell>ID</TableCell>}
                      <TableCell>Title</TableCell>
                      {!isMobile && <TableCell>Category</TableCell>}
                      <TableCell>Status</TableCell>
                      {!isMobile && <TableCell>Date Reported</TableCell>}
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <TableRow key={index}>
                          {!isMobile && <TableCell><Skeleton width={40} /></TableCell>}
                          <TableCell><Skeleton width="80%" /></TableCell>
                          {!isMobile && <TableCell><Skeleton width={80} /></TableCell>}
                          <TableCell><Skeleton width={80} /></TableCell>
                          {!isMobile && <TableCell><Skeleton width={100} /></TableCell>}
                          <TableCell align="right"><Skeleton width={40} /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      recentActivity.map((incident, index) => (
                        <TableRow 
                          key={index}
                          sx={{ 
                            '&:hover': { backgroundColor: alpha(colors.blue, 0.02) },
                            cursor: 'pointer',
                            '& td': {
                              borderBottom: `1px solid ${colors.borderGray}`,
                              py: { xs: 1, sm: 1.5, md: 2 },
                              px: { xs: 1, sm: 1.5, md: 2 }
                            }
                          }}
                          onClick={() => navigate(`/admin/incidents/${incident.id}`)}
                        >
                          {!isMobile && (
                            <TableCell>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: colors.darkGray, 
                                  fontWeight: 500,
                                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                }}
                              >
                                #{String(index + 1).padStart(3, '0')}
                              </Typography>
                            </TableCell>
                          )}
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 500, 
                                color: colors.darkBlue,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                              }}
                            >
                              {incident.title}
                            </Typography>
                            {isMobile && (
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: colors.darkGray, 
                                  display: 'block',
                                  fontSize: '0.75rem'
                                }}
                              >
                                {incident.category}
                              </Typography>
                            )}
                          </TableCell>
                          {!isMobile && (
                            <TableCell>
                              <Chip
                                label={incident.category}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: alpha(colors.blue, 0.3),
                                  color: colors.darkBlue,
                                  fontSize: { xs: '0.625rem', sm: '0.75rem' },
                                  height: { xs: 20, sm: 24 }
                                }}
                              />
                            </TableCell>
                          )}
                          <TableCell>
                            <Chip
                              label={incident.status}
                              size="small"
                              icon={getStatusIcon(incident.status)}
                              sx={{
                                backgroundColor: alpha(getStatusColor(incident.status), 0.1),
                                color: getStatusColor(incident.status),
                                borderColor: alpha(getStatusColor(incident.status), 0.2),
                                fontWeight: 500,
                                fontSize: { xs: '0.625rem', sm: '0.75rem' },
                                height: { xs: 20, sm: 24 },
                                '& .MuiChip-icon': {
                                  marginLeft: { xs: '4px', sm: '6px' },
                                  marginRight: { xs: '2px', sm: '4px' }
                                }
                              }}
                            />
                          </TableCell>
                          {!isMobile && (
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Calendar size={14} color={colors.darkGray} />
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: colors.darkGray,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                  }}
                                >
                                  {formatDate(incident.createdAt)}
                                </Typography>
                              </Stack>
                            </TableCell>
                          )}
                          <TableCell align="right">
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small"
                                sx={{ 
                                  color: colors.blue,
                                  '&:hover': {
                                    backgroundColor: alpha(colors.blue, 0.1)
                                  },
                                  p: { xs: 0.5, sm: 0.75 }
                                }}
                              >
                                <Eye size={isMobile ? 14 : 16} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>

          {/* Right Column - Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Quick Actions */}
            <Card sx={{ 
              borderRadius: 1.5, 
              mb: { xs: 2, md: 3 }, 
              border: `1px solid ${colors.borderGray}`,
              backgroundColor: colors.white
            }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 3, 
                    fontWeight: 700, 
                    color: colors.darkBlue,
                    fontSize: { xs: '1rem', sm: '1.125rem' }
                  }}
                >
                  Quick Actions
                </Typography>
                <Stack spacing={{ xs: 1.5, sm: 2 }}>
                  {quickActions.map((action) => (
                    <CardActionArea
                      key={action.title}
                      onClick={() => navigate(action.path)}
                      sx={{
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: alpha(action.color, 0.05)
                        }
                      }}
                    >
                      <Box sx={{ p: { xs: 1.25, sm: 1.5, md: 2 } }}>
                        <Stack direction="row" alignItems="center" spacing={{ xs: 1.5, sm: 2 }}>
                          <Avatar
                            sx={{
                              width: { xs: 32, sm: 36, md: 40 },
                              height: { xs: 32, sm: 36, md: 40 },
                              backgroundColor: alpha(action.color, 0.1),
                              color: action.color,
                              borderRadius: 2,
                              flexShrink: 0
                            }}
                          >
                            {action.icon}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 600, 
                                color: colors.darkBlue,
                                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {action.title}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: colors.darkGray,
                                fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                                display: 'block',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {action.description}
                            </Typography>
                          </Box>
                          <ChevronRight size={isMobile ? 14 : 16} color={colors.darkGray} />
                        </Stack>
                      </Box>
                    </CardActionArea>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card sx={{ 
              borderRadius: 1.5, 
              mb: { xs: 2, md: 3 },
              border: `1px solid ${colors.borderGray}`,
              backgroundColor: colors.white
            }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                <Stack direction="row" alignItems="center" spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
                  <Avatar
                    sx={{
                      width: { xs: 36, sm: 40, md: 48 },
                      height: { xs: 36, sm: 40, md: 48 },
                      backgroundColor: alpha(colors.blue, 0.1),
                      color: colors.blue,
                      borderRadius: 2,
                      flexShrink: 0
                    }}
                  >
                    <Server size={isMobile ? 18 : 20} />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        color: colors.darkBlue,
                        fontSize: { xs: '1rem', sm: '1.125rem' }
                      }}
                    >
                      System Status
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: colors.darkGray,
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' }
                      }}
                    >
                      Real-time system health monitoring
                    </Typography>
                  </Box>
                </Stack>
                
                <Stack spacing={{ xs: 1.5, sm: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 1.5 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        backgroundColor: getSystemStatusColor(systemStatus.api),
                        flexShrink: 0
                      }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: colors.darkBlue, 
                          fontWeight: 500,
                          fontSize: { xs: '0.8125rem', sm: '0.875rem' }
                        }}
                      >
                        API Status
                      </Typography>
                    </Stack>
                    <Chip 
                      label={systemStatus.api.charAt(0).toUpperCase() + systemStatus.api.slice(1)} 
                      size="small" 
                      sx={{
                        backgroundColor: alpha(getSystemStatusColor(systemStatus.api), 0.1),
                        color: getSystemStatusColor(systemStatus.api),
                        fontWeight: 500,
                        border: 'none',
                        fontSize: { xs: '0.625rem', sm: '0.75rem' },
                        height: { xs: 20, sm: 24 }
                      }}
                    />
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 1.5 }}>
                      <Database size={isMobile ? 12 : 14} color={colors.darkGray} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: colors.darkBlue, 
                          fontWeight: 500,
                          fontSize: { xs: '0.8125rem', sm: '0.875rem' }
                        }}
                      >
                        Database
                      </Typography>
                    </Stack>
                    <Chip 
                      label="Connected" 
                      size="small" 
                      sx={{
                        backgroundColor: alpha('#10b981', 0.1),
                        color: '#10b981',
                        fontWeight: 500,
                        border: 'none',
                        fontSize: { xs: '0.625rem', sm: '0.75rem' },
                        height: { xs: 20, sm: 24 }
                      }}
                    />
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 1.5 }}>
                      <AlertOctagon size={isMobile ? 12 : 14} color={colors.darkGray} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: colors.darkBlue, 
                          fontWeight: 500,
                          fontSize: { xs: '0.8125rem', sm: '0.875rem' }
                        }}
                      >
                        Storage Usage
                      </Typography>
                    </Stack>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                      <Box sx={{ 
                        width: 60, 
                        height: 4, 
                        borderRadius: 2, 
                        backgroundColor: alpha(colors.darkGray, 0.2), 
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        <Box 
                          sx={{ 
                            width: `${systemStatus.storage}%`, 
                            height: '100%', 
                            backgroundColor: systemStatus.storage > 90 ? '#ef4444' : systemStatus.storage > 75 ? '#f59e0b' : '#10b981',
                            borderRadius: 2
                          }} 
                        />
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: colors.darkBlue, 
                          minWidth: 35,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        {systemStatus.storage.toFixed(0)}%
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 1.5 }}>
                      <ShieldCheck size={isMobile ? 12 : 14} color={colors.darkGray} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: colors.darkBlue, 
                          fontWeight: 500,
                          fontSize: { xs: '0.8125rem', sm: '0.875rem' }
                        }}
                      >
                        System Uptime
                      </Typography>
                    </Stack>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: colors.darkBlue,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      {systemStatus.uptime}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* Awareness Hub */}
            <Card sx={{ 
              borderRadius: 3,
              border: `1px solid ${colors.borderGray}`,
              background: `linear-gradient(135deg, ${alpha(colors.blue, 0.08)} 0%, ${alpha(colors.blue, 0.12)} 100%)`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                position: 'absolute', 
                top: -20, 
                right: -20, 
                width: 100, 
                height: 100, 
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(colors.blue, 0.1)} 0%, transparent 70%)`
              }} />
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 }, position: 'relative' }}>
                <Stack direction="row" alignItems="center" spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 2 }}>
                  <Avatar
                    sx={{
                      width: { xs: 36, sm: 40, md: 48 },
                      height: { xs: 36, sm: 40, md: 48 },
                      backgroundColor: colors.blue,
                      flexShrink: 0
                    }}
                  >
                    <Shield size={isMobile ? 18 : 20} />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        color: colors.darkBlue,
                        fontSize: { xs: '1rem', sm: '1.125rem' }
                      }}
                    >
                      Security Awareness
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: colors.darkGray,
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' }
                      }}
                    >
                      Educational resources & guidelines
                    </Typography>
                  </Box>
                </Stack>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: colors.darkGray, 
                    mb: 3, 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  Access comprehensive security policies, emergency protocols, and preventive guidelines.
                </Typography>
                
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/awareness')}
                  endIcon={<ExternalLink size={isMobile ? 14 : 16} />}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: colors.blue,
                    '&:hover': {
                      backgroundColor: colors.darkerBlue
                    },
                    fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
                    py: { xs: 0.75, sm: 1 },
                    px: 2
                  }}
                >
                  Access Resources
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Loading State */}
        {loading && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            py: { xs: 4, sm: 6, md: 8 },
            borderRadius: 3,
            border: `1px dashed ${colors.borderGray}`,
            backgroundColor: alpha(colors.blue, 0.02),
            mt: 3
          }}>
            <RefreshCw 
              size={isMobile ? 32 : 48} 
              color={colors.blue}
              style={{ animation: 'spin 1s linear infinite' }}
            />
            <Typography 
              variant="h6" 
              sx={{ 
                mt: 2, 
                fontWeight: 600, 
                color: colors.darkBlue,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              Loading Dashboard Data
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 1, 
                color: colors.darkGray,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                textAlign: 'center',
                px: 2
              }}
            >
              Please wait while we fetch the latest information
            </Typography>
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ 
          mt: 3, 
          pt: 2, 
          borderTop: `1px solid ${colors.borderGray}`,
          pb: 1
        }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: colors.darkGray,
              fontSize: { xs: '0.6875rem', sm: '0.75rem' }
            }}
          >
            Last updated: {new Date().toLocaleDateString('en-US', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typography>
        </Box>

        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Container>
    </Box>
  );
};

export default AdminDashboard;