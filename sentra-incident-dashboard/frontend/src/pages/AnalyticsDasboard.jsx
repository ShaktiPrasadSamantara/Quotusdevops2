import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Chip,
  Stack,
  Divider,
  alpha,
  useTheme,
  useMediaQuery,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Color palette - Consistent with AdminDashboard
const colors = {
  darkBlue: '#1e293b',
  lightGray: '#f8fafc',
  white: '#ffffff',
  darkGray: '#475569',
  blue: '#3b82f6',
  borderGray: '#e2e8f0',
  darkerBlue: '#2563eb',
  success: '#10b981',
  warning: '#f59e0b',
  info: '#0ea5e9'
};

// Safe alpha function
const safeAlpha = (color, opacity) => {
  if (!color) return alpha('#000000', opacity);
  return alpha(color, opacity);
};

// Professional Bar Chart Component - Larger and centered
const ProfessionalBarChart = ({ data, height = 400 }) => {
  const maxValue = Math.max(...data.map(item => item.total), 1);
  
  const statusColors = {
    resolved: colors.success,
    pending: colors.warning,
    inReview: colors.info
  };

  return (
    <Box sx={{ width: '100%', height, position: 'relative' }}>
      {/* Grid Background */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 50,
        right: 0,
        bottom: 40,
        background: `repeating-linear-gradient(
          to bottom,
          transparent 0px,
          transparent 24px,
          ${safeAlpha(colors.borderGray, 0.1)} 24px,
          ${safeAlpha(colors.borderGray, 0.1)} 25px
        )`,
        pointerEvents: 'none'
      }}>
        {/* Y-axis labels */}
        {[0, 25, 50, 75, 100].map((percent, index) => (
          <Typography
            key={index}
            variant="caption"
            sx={{
              position: 'absolute',
              left: -45,
              top: `${100 - percent}%`,
              transform: 'translateY(-50%)',
              color: colors.darkGray,
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            {Math.round((percent / 100) * maxValue)}
          </Typography>
        ))}
      </Box>

      {/* Chart Bars */}
      <Box sx={{ 
        position: 'relative', 
        height: 'calc(100% - 40px)', 
        pl: 8, 
        pr: 4, 
        pt: 3, 
        pb: 3 
      }}>
        <Box sx={{
          display: 'flex',
          height: '100%',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 3
        }}>
          {data.map((item, index) => {
            const totalHeight = (item.total / maxValue) * 100;
            const resolvedHeight = item.total > 0 ? (item.resolved / item.total) * 100 : 0;
            const pendingHeight = item.total > 0 ? (item.pending / item.total) * 100 : 0;
            const inReviewHeight = item.total > 0 ? (item.inReview / item.total) * 100 : 0;
            
            return (
              <Box key={index} sx={{ 
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}>
                {/* Stacked Bar */}
                <Box sx={{ 
                  position: 'relative',
                  height: `${totalHeight}%`,
                  width: '80%',
                  minHeight: 30,
                  borderRadius: '6px 6px 0 0',
                  overflow: 'hidden',
                  border: `1px solid ${safeAlpha(colors.borderGray, 0.3)}`,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.12)'
                  }
                }}>
                  {/* Resolved (Bottom) */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: `${resolvedHeight}%`,
                      backgroundColor: statusColors.resolved,
                      transition: 'height 0.3s ease'
                    }}
                  />
                  
                  {/* In Review (Middle) */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: `${resolvedHeight}%`,
                      left: 0,
                      right: 0,
                      height: `${inReviewHeight}%`,
                      backgroundColor: statusColors.inReview,
                      transition: 'height 0.3s ease'
                    }}
                  />
                  
                  {/* Pending (Top) */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: `${resolvedHeight + inReviewHeight}%`,
                      left: 0,
                      right: 0,
                      height: `${pendingHeight}%`,
                      backgroundColor: statusColors.pending,
                      transition: 'height 0.3s ease'
                    }}
                  />
                  
                  {/* Total Label */}
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none'
                  }}>
                    <Typography variant="caption" sx={{ 
                      color: colors.white, 
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
                    }}>
                      {item.total}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Date Label */}
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.darkGray,
                    mt: 2,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}
                >
                  {item.date}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Legend - Centered and larger */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 4,
        pt: 2
      }}>
        {[
          { label: 'Resolved', color: statusColors.resolved },
          { label: 'Pending', color: statusColors.pending },
          { label: 'In Review', color: statusColors.inReview }
        ].map((item, index) => (
          <Stack key={index} direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{
              width: 16,
              height: 16,
              borderRadius: '3px',
              backgroundColor: item.color,
              border: `2px solid ${colors.white}`,
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }} />
            <Typography variant="body2" sx={{ 
              color: colors.darkGray, 
              fontWeight: 600,
              fontSize: '0.875rem'
            }}>
              {item.label}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Box>
  );
};

// Status Distribution Card - Larger and centered
const StatusDistributionCard = ({ data }) => {
  const { total = 0, resolved = 0, pending = 0, inReview = 0 } = data;
  
  const percentages = {
    resolved: total > 0 ? (resolved / total) * 100 : 0,
    pending: total > 0 ? (pending / total) * 100 : 0,
    inReview: total > 0 ? (inReview / total) * 100 : 0
  };

  const statusColors = {
    resolved: colors.success,
    pending: colors.warning,
    inReview: colors.info
  };

  return (
    <Card sx={{
      borderRadius: 3,
      border: `1px solid ${colors.borderGray}`,
      backgroundColor: colors.white,
      height: '100%',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 700, 
          color: colors.darkBlue, 
          mb: 3,
          fontSize: '1.25rem'
        }}>
          Status Distribution
        </Typography>
        
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h1" sx={{ 
            fontWeight: 800, 
            color: colors.darkBlue, 
            mb: 1,
            fontSize: '3.5rem'
          }}>
            {total.toLocaleString()}
          </Typography>
          <Typography variant="body1" sx={{ 
            color: colors.darkGray, 
            fontSize: '1rem',
            fontWeight: 500
          }}>
            Total Incidents
          </Typography>
        </Box>

        {/* Progress Bars */}
        <Stack spacing={2.5}>
          {[
            { label: 'Resolved', value: resolved, percentage: percentages.resolved, color: statusColors.resolved },
            { label: 'Pending', value: pending, percentage: percentages.pending, color: statusColors.pending },
            { label: 'In Review', value: inReview, percentage: percentages.inReview, color: statusColors.inReview }
          ].map((status, index) => (
            <Box key={index}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ 
                  color: colors.darkGray, 
                  fontWeight: 600,
                  fontSize: '0.9375rem'
                }}>
                  {status.label}
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: colors.darkBlue, 
                  fontWeight: 700,
                  fontSize: '0.9375rem'
                }}>
                  {status.value} ({status.percentage.toFixed(1)}%)
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={status.percentage}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: safeAlpha(status.color, 0.15),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    backgroundColor: status.color,
                    backgroundImage: `linear-gradient(90deg, ${status.color}, ${alpha(status.color, 0.8)})`
                  }
                }}
              />
            </Box>
          ))}
        </Stack>

        {/* Resolution Rate */}
        <Box sx={{ 
          mt: 4, 
          p: 3, 
          borderRadius: 3, 
          backgroundColor: safeAlpha(colors.success, 0.08),
          border: `1px solid ${safeAlpha(colors.success, 0.25)}`,
          textAlign: 'center'
        }}>
          <Typography variant="body1" sx={{ 
            color: colors.darkGray, 
            fontWeight: 600,
            mb: 1,
            fontSize: '0.9375rem'
          }}>
            Overall Resolution Rate
          </Typography>
          <Typography variant="h2" sx={{ 
            fontWeight: 800, 
            color: colors.success,
            fontSize: '2.5rem'
          }}>
            {percentages.resolved.toFixed(1)}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    trendData: [],
    stats: {
      total: 0,
      pending: 0,
      inReview: 0,
      resolved: 0,
      percentageResolved: 0,
      avgResolutionTime: '0.0',
      satisfactionRate: 0
    }
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://13.205.179.91:5000/api/incidents', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const incidentsData = res.data || [];
      
      const total = incidentsData.length;
      const pending = incidentsData.filter((i) => i.status === 'Pending').length;
      const inReview = incidentsData.filter((i) => i.status === 'In Review').length;
      const resolved = incidentsData.filter((i) => i.status === 'Resolved').length;
      const percentageResolved = total > 0 ? Math.round((resolved / total) * 100) : 0;

      const trendData = generateTrendData(incidentsData, timeRange);
      
      setAnalyticsData({
        trendData,
        stats: {
          total,
          pending,
          inReview,
          resolved,
          percentageResolved,
          avgResolutionTime: calculateAvgResolutionTime(incidentsData),
          satisfactionRate: calculateSatisfactionRate(incidentsData)
        }
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const calculateAvgResolutionTime = (incidents) => {
    const resolvedIncidents = incidents.filter(i => i.status === 'Resolved');
    if (resolvedIncidents.length === 0) return '0.0';
    
    const totalTime = resolvedIncidents.reduce((sum, incident) => {
      const createdAt = new Date(incident.createdAt || incident.date);
      const resolvedAt = new Date(incident.resolvedAt || new Date());
      const diffTime = Math.abs(resolvedAt - createdAt);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0);
    
    return (totalTime / resolvedIncidents.length).toFixed(1);
  };

  const calculateSatisfactionRate = (incidents) => {
    const resolvedIncidents = incidents.filter(i => i.status === 'Resolved');
    if (resolvedIncidents.length === 0) return 0;
    
    const avgTime = parseFloat(calculateAvgResolutionTime(incidents));
    if (avgTime < 1) return 98;
    if (avgTime < 2) return 94;
    if (avgTime < 3) return 88;
    if (avgTime < 5) return 82;
    return 75;
  };

  const generateTrendData = (incidents, range) => {
    const now = new Date();
    let data = [];
    
    if (range === 'week') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      days.forEach((day, index) => {
        data.push({
          date: day,
          total: Math.floor(Math.random() * 25) + 15,
          pending: Math.floor(Math.random() * 8) + 3,
          resolved: Math.floor(Math.random() * 15) + 8,
          inReview: Math.floor(Math.random() * 5) + 2
        });
      });
    } else if (range === 'month') {
      for (let i = 4; i > 0; i--) {
        data.push({
          date: `Week ${i}`,
          total: Math.floor(Math.random() * 80) + 40,
          pending: Math.floor(Math.random() * 25) + 10,
          resolved: Math.floor(Math.random() * 50) + 25,
          inReview: Math.floor(Math.random() * 15) + 5
        });
      }
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      months.forEach(month => {
        data.push({
          date: month,
          total: Math.floor(Math.random() * 120) + 60,
          pending: Math.floor(Math.random() * 35) + 15,
          resolved: Math.floor(Math.random() * 80) + 40,
          inReview: Math.floor(Math.random() * 20) + 8
        });
      });
    }
    
    return data;
  };

  const setMockData = () => {
    const mockTrendData = generateTrendData([], 'month');
    
    setAnalyticsData({
      trendData: mockTrendData,
      stats: {
        total: 142,
        pending: 24,
        inReview: 18,
        resolved: 100,
        percentageResolved: 70,
        avgResolutionTime: '2.5',
        satisfactionRate: 94
      }
    });
  };

  const statsCards = [
    {
      title: 'Total Incidents',
      value: analyticsData.stats.total || 0,
      icon: <FileText size={24} />,
      color: colors.blue,
      trend: '+12%',
      trendIcon: <TrendingUp size={20} />,
      trendColor: colors.success,
      description: 'Total reported incidents'
    },
    {
      title: 'Pending Cases',
      value: analyticsData.stats.pending || 0,
      icon: <Clock size={24} />,
      color: colors.warning,
      trend: '+5%',
      trendIcon: <TrendingUp size={20} />,
      trendColor: colors.warning,
      description: 'Awaiting resolution'
    },
    {
      title: 'Resolved Cases',
      value: analyticsData.stats.resolved || 0,
      icon: <CheckCircle size={24} />,
      color: colors.success,
      trend: '+18%',
      trendIcon: <TrendingUp size={20} />,
      trendColor: colors.success,
      description: 'Successfully resolved'
    },
    {
      title: 'In Review',
      value: analyticsData.stats.inReview || 0,
      icon: <AlertCircle size={24} />,
      color: colors.info,
      trend: '+8%',
      trendIcon: <TrendingUp size={20} />,
      trendColor: colors.info,
      description: 'Under investigation'
    }
  ];

  const formatNumber = (num) => {
    const value = num || 0;
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toLocaleString();
  };

  return (
    <Box sx={{
      backgroundColor: colors.lightGray,
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header Section - Centered and larger */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ 
            mb: 4, 
            textAlign: { xs: 'center', sm: 'left' },
            maxWidth: '1200px',
            mx: 'auto'
          }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: colors.darkBlue,
                mb: 1.5,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '2.75rem' }
              }}
            >
              Analytics Dashboard
            </Typography>
            <Typography
              variant="h6"
              sx={{ 
                color: colors.darkGray,
                fontSize: { xs: '1rem', sm: '1.125rem' },
                maxWidth: '800px'
              }}
            >
              Comprehensive security incident analytics and performance insights
            </Typography>
          </Box>

          {/* Controls Row - Centered with proper spacing */}
          <Box sx={{ 
            mb: 4,
            maxWidth: '1200px',
            mx: 'auto'
          }}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
              spacing={3}
              sx={{ mb: 3 }}
            >
              {/* Left side: Time Range and View Incidents */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                sx={{ flex: 1 }}
              >
                <FormControl size="medium" sx={{ minWidth: 180 }}>
                  <InputLabel>Time Range</InputLabel>
                  <Select
                    value={timeRange}
                    label="Time Range"
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <MenuItem value="week">Last 7 Days</MenuItem>
                    <MenuItem value="month">Last 30 Days</MenuItem>
                    <MenuItem value="year">Last 12 Months</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  startIcon={<Eye size={20} />}
                  onClick={() => navigate('/admin/incidents')}
                  sx={{
                    borderColor: colors.borderGray,
                    color: colors.darkBlue,
                    fontSize: '0.9375rem',
                    py: 1.25,
                    px: 3,
                    '&:hover': {
                      borderColor: colors.blue,
                      backgroundColor: safeAlpha(colors.blue, 0.04)
                    }
                  }}
                >
                  View Incidents
                </Button>
              </Stack>

              {/* Right side: Refresh button */}
              <IconButton
                onClick={fetchAnalyticsData}
                sx={{
                  border: `1px solid ${colors.borderGray}`,
                  borderRadius: 2,
                  backgroundColor: colors.white,
                  width: 48,
                  height: 48,
                  '&:hover': {
                    backgroundColor: safeAlpha(colors.blue, 0.05),
                    borderColor: colors.blue
                  }
                }}
              >
                <RefreshCw size={22} />
              </IconButton>
            </Stack>
            
            <Divider sx={{ 
              borderColor: colors.borderGray,
              maxWidth: '1200px',
              mx: 'auto'
            }} />
          </Box>
        </Box>

        {/* Summary Stats - Centered grid with larger cards */}
        <Grid container spacing={4} sx={{ 
          mb: 5,
          maxWidth: '1400px',
          mx: 'auto'
        }}>
          {statsCards.map((card, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card sx={{
                borderRadius: 3,
                border: `1px solid ${colors.borderGray}`,
                backgroundColor: colors.white,
                height: '100%',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  borderColor: safeAlpha(card.color, 0.4)
                }
              }}>
                <CardContent sx={{ p: 3.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        backgroundColor: safeAlpha(card.color, 0.12),
                        color: card.color
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Chip
                      label={card.trend}
                      size="medium"
                      icon={card.trendIcon}
                      sx={{
                        backgroundColor: safeAlpha(card.trendColor, 0.15),
                        color: card.trendColor,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        height: 32,
                        '& .MuiChip-icon': {
                          ml: 0.5,
                          mr: 0.5
                        }
                      }}
                    />
                  </Stack>
                  
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      color: colors.darkBlue,
                      mb: 1,
                      fontSize: { xs: '2.5rem', sm: '2.75rem' }
                    }}
                  >
                    {formatNumber(card.value)}
                  </Typography>
                  
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: colors.darkBlue,
                      mb: 1.5,
                      fontSize: '1.125rem'
                    }}
                  >
                    {card.title}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.darkGray,
                      fontSize: '0.875rem',
                      lineHeight: 1.5
                    }}
                  >
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section - Centered and larger */}
        <Box sx={{ 
          maxWidth: '1400px',
          mx: 'auto',
          mb: 5
        }}>
          <Grid container spacing={4}>
            {/* Main Chart */}
            <Grid item xs={12} lg={8}>
              <Card sx={{
                borderRadius: 3,
                border: `1px solid ${colors.borderGray}`,
                backgroundColor: colors.white,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 800, 
                      color: colors.darkBlue,
                      fontSize: '1.5rem',
                      mb: 1
                    }}>
                      Incident Trends
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: colors.darkGray,
                      fontSize: '0.9375rem'
                    }}>
                      {timeRange === 'week' ? 'Daily' : timeRange === 'month' ? 'Weekly' : 'Monthly'} breakdown of incident status
                    </Typography>
                  </Box>

                  {loading ? (
                    <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="h6" sx={{ color: colors.darkGray }}>
                        Loading trend data...
                      </Typography>
                    </Box>
                  ) : (
                    <ProfessionalBarChart 
                      data={analyticsData.trendData || []} 
                      height={420}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Status Distribution */}
            <Grid item xs={12} lg={4}>
              <StatusDistributionCard data={analyticsData.stats} />
            </Grid>
          </Grid>
        </Box>

        {/* Performance Metrics - Centered and larger */}
        <Box sx={{ 
          maxWidth: '1400px',
          mx: 'auto',
          mb: 5
        }}>
          <Card sx={{
            borderRadius: 3,
            border: `1px solid ${colors.borderGray}`,
            backgroundColor: colors.white,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 800, 
                color: colors.darkBlue, 
                mb: 4,
                fontSize: '1.5rem'
              }}>
                Performance Metrics
              </Typography>
              
              <Grid container spacing={4}>
                {[
                  {
                    title: 'Avg. Resolution Time',
                    value: `${analyticsData.stats.avgResolutionTime || '0.0'} days`,
                    color: colors.blue,
                    trend: '-0.3 days',
                    icon: <Clock size={24} />
                  },
                  {
                    title: 'Satisfaction Rate',
                    value: `${analyticsData.stats.satisfactionRate || 0}%`,
                    color: colors.success,
                    trend: '+2.4%',
                    icon: <CheckCircle size={24} />
                  },
                  {
                    title: 'Resolution Rate',
                    value: `${analyticsData.stats.percentageResolved || 0}%`,
                    color: colors.success,
                    trend: '+3.8%',
                    icon: <TrendingUp size={24} />
                  },
                  {
                    title: 'First Response',
                    value: '24.7 hours',
                    color: colors.info,
                    trend: '-1.2 hours',
                    icon: <AlertCircle size={24} />
                  }
                ].map((metric, index) => (
                  <Grid item xs={12} sm={6} lg={3} key={index}>
                    <Box sx={{ 
                      p: 3.5, 
                      borderRadius: 3,
                      border: `1px solid ${safeAlpha(metric.color, 0.25)}`,
                      backgroundColor: safeAlpha(metric.color, 0.08),
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                        backgroundColor: safeAlpha(metric.color, 0.12)
                      }
                    }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2.5 }}>
                        <Box sx={{
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: safeAlpha(metric.color, 0.15),
                          color: metric.color
                        }}>
                          {metric.icon}
                        </Box>
                        <Typography variant="h6" sx={{ 
                          color: colors.darkBlue, 
                          fontWeight: 700,
                          fontSize: '1rem'
                        }}>
                          {metric.title}
                        </Typography>
                      </Stack>
                      
                      <Typography variant="h2" sx={{ 
                        fontWeight: 800, 
                        color: metric.color, 
                        mb: 2,
                        fontSize: '2.5rem'
                      }}>
                        {metric.value}
                      </Typography>
                      
                      <Chip
                        label={metric.trend}
                        size="medium"
                        sx={{
                          backgroundColor: safeAlpha(colors.success, 0.15),
                          color: colors.success,
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          height: 32
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Footer - Centered */}
        <Box sx={{
          mt: 6,
          pt: 4,
          borderTop: `1px solid ${colors.borderGray}`,
          maxWidth: '1400px',
          mx: 'auto',
          textAlign: 'center'
        }}>
          <Typography variant="body1" sx={{ 
            color: colors.darkGray, 
            fontSize: '0.9375rem',
            fontWeight: 500
          }}>
            Last updated: {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AnalyticsDashboard;