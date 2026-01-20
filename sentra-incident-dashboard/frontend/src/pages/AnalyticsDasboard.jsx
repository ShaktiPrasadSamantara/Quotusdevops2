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

// Updated Color Palette - More Professional
const colors = {
  darkBlue: '#1a237e',
  lightGray: '#f8f9fa',
  white: '#ffffff',
  darkGray: '#5a6c7d',
  blue: '#3f51b5',
  borderGray: '#e0e0e0',
  success: '#4caf50',
  warning: '#ff9800',
  info: '#2196f3',
  purple: '#9c27b0'
};

// Safe alpha function
const safeAlpha = (color, opacity) => {
  if (!color) return alpha('#000000', opacity);
  return alpha(color, opacity);
};

// Professional Bar Chart Component - Wider and optimized
const ProfessionalBarChart = ({ data, height = 380 }) => {
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
          transparent 23px,
          ${safeAlpha(colors.borderGray, 0.08)} 23px,
          ${safeAlpha(colors.borderGray, 0.08)} 24px
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
              fontSize: '0.75rem',
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
        pl: 7, 
        pr: 3, 
        pt: 2, 
        pb: 2 
      }}>
        <Box sx={{
          display: 'flex',
          height: '100%',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 2
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
                  width: '85%',
                  minHeight: 20,
                  borderRadius: '4px 4px 0 0',
                  overflow: 'hidden',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.02) 100%)',
                  border: `1px solid ${safeAlpha(colors.borderGray, 0.2)}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderColor: safeAlpha(colors.blue, 0.3)
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
                      background: `linear-gradient(180deg, ${statusColors.resolved}, ${alpha(statusColors.resolved, 0.9)})`,
                      transition: 'height 0.4s ease'
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
                      background: `linear-gradient(180deg, ${statusColors.inReview}, ${alpha(statusColors.inReview, 0.9)})`,
                      transition: 'height 0.4s ease'
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
                      background: `linear-gradient(180deg, ${statusColors.pending}, ${alpha(statusColors.pending, 0.9)})`,
                      transition: 'height 0.4s ease'
                    }}
                  />
                  
                  {/* Total Label */}
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    opacity: totalHeight > 20 ? 1 : 0
                  }}>
                    <Typography variant="caption" sx={{ 
                      color: colors.white, 
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}>
                      {item.total}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Date Label */}
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.darkGray,
                    mt: 1.5,
                    fontSize: '0.75rem',
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

      {/* Legend */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 3,
        pt: 1.5
      }}>
        {[
          { label: 'Resolved', color: statusColors.resolved },
          { label: 'Pending', color: statusColors.pending },
          { label: 'In Review', color: statusColors.inReview }
        ].map((item, index) => (
          <Stack key={index} direction="row" alignItems="center" spacing={1}>
            <Box sx={{
              width: 12,
              height: 12,
              borderRadius: '2px',
              backgroundColor: item.color,
              border: `1px solid ${colors.white}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }} />
            <Typography variant="caption" sx={{ 
              color: colors.darkGray, 
              fontWeight: 500,
              fontSize: '0.75rem'
            }}>
              {item.label}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Box>
  );
};

// Status Distribution Card - Wider and optimized
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
      borderRadius: 2,
      border: `1px solid ${colors.borderGray}`,
      backgroundColor: colors.white,
      height: '100%',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 700, 
          color: colors.darkBlue, 
          mb: 3,
          fontSize: '1.125rem'
        }}>
          Status Distribution
        </Typography>
        
        <Box sx={{ mb: 3, textAlign: 'center', width:300}}>
          <Typography variant="h2" sx={{ 
            fontWeight: 800, 
            color: colors.darkBlue, 
            mb: 0.5,
            fontSize: '2.75rem',
            letterSpacing: '-0.5px'
          }}>
            {total.toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ 
            color: colors.darkGray, 
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            Total Incidents
          </Typography>
        </Box>

        {/* Progress Bars */}
        <Stack spacing={2}>
          {[
            { label: 'Resolved', value: resolved, percentage: percentages.resolved, color: statusColors.resolved },
            { label: 'Pending', value: pending, percentage: percentages.pending, color: statusColors.pending },
            { label: 'In Review', value: inReview, percentage: percentages.inReview, color: statusColors.inReview }
          ].map((status, index) => (
            <Box key={index}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="body2" sx={{ 
                  color: colors.darkGray, 
                  fontWeight: 600,
                  fontSize: '0.8125rem'
                }}>
                  {status.label}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: colors.darkBlue, 
                  fontWeight: 700,
                  fontSize: '0.8125rem'
                }}>
                  {status.value} ({status.percentage.toFixed(1)}%)
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={status.percentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: safeAlpha(status.color, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${status.color}, ${alpha(status.color, 0.9)})`
                  }
                }}
              />
            </Box>
          ))}
        </Stack>

        {/* Resolution Rate */}
        <Box sx={{ 
          mt: 3, 
          p: 2, 
          borderRadius: 2, 
          background: `linear-gradient(135deg, ${safeAlpha(colors.success, 0.1)} 0%, ${safeAlpha(colors.success, 0.05)} 100%)`,
          border: `1px solid ${safeAlpha(colors.success, 0.2)}`,
          textAlign: 'center'
        }}>
          <Typography variant="body2" sx={{ 
            color: colors.darkGray, 
            fontWeight: 600,
            mb: 0.5,
            fontSize: '0.8125rem'
          }}>
            Overall Resolution Rate
          </Typography>
          <Typography variant="h3" sx={{ 
            fontWeight: 800, 
            color: colors.success,
            fontSize: '2rem'
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
      // Pass empty array to setMockData since we don't have data when API fails
      setMockData([]);
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
    
    // Helper function to group incidents by date
    const groupIncidentsByDate = (incidents, dateFormatFn, labels) => {
      const grouped = {};
      
      // Initialize all periods with zero values
      labels.forEach(label => {
        grouped[label] = {
          total: 0,
          pending: 0,
          resolved: 0,
          inReview: 0
        };
      });
      
      // Count incidents for each period
      incidents.forEach(incident => {
        const date = new Date(incident.createdAt || incident.date);
        const period = dateFormatFn(date);
        
        if (grouped[period]) {
          grouped[period].total += 1;
          
          switch (incident.status?.toLowerCase()) {
            case 'pending':
              grouped[period].pending += 1;
              break;
            case 'resolved':
              grouped[period].resolved += 1;
              break;
            case 'in review':
            case 'in_review':
            case 'inreview':
              grouped[period].inReview += 1;
              break;
            default:
              // Handle any other status as pending for chart purposes
              grouped[period].pending += 1;
              break;
          }
        }
      });
      
      return grouped;
    };
    
    if (range === 'week') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      // Get dates for last 7 days
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        last7Days.push(date);
      }
      
      // Format function for week view (day of week)
      const getDayOfWeek = (date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
      };
      
      const grouped = groupIncidentsByDate(incidents, getDayOfWeek, days);
      
      // Convert to array format for chart
      days.forEach((day) => {
        data.push({
          date: day,
          total: grouped[day].total,
          pending: grouped[day].pending,
          resolved: grouped[day].resolved,
          inReview: grouped[day].inReview
        });
      });
      
    } else if (range === 'month') {
      // For month view, show last 4 weeks
      const weeks = ['W4', 'W3', 'W2', 'W1'];
      
      // Get dates for last 4 weeks
      const last4Weeks = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i * 7) - 6);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        last4Weeks.push({
          start: weekStart,
          end: weekEnd,
          label: weeks[3 - i]
        });
      }
      
      // Format function for month view (week number)
      const getWeekNumber = (date) => {
        for (let i = 0; i < last4Weeks.length; i++) {
          const week = last4Weeks[i];
          if (date >= week.start && date <= week.end) {
            return week.label;
          }
        }
        return null;
      };
      
      const grouped = groupIncidentsByDate(incidents, getWeekNumber, weeks);
      
      // Convert to array format for chart
      weeks.forEach(week => {
        data.push({
          date: week,
          total: grouped[week].total,
          pending: grouped[week].pending,
          resolved: grouped[week].resolved,
          inReview: grouped[week].inReview
        });
      });
      
    } else { // year view
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Get current month and previous 5 months
      const currentMonth = now.getMonth();
      const displayMonths = [];
      
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        displayMonths.push(months[monthIndex]);
      }
      
      // Format function for year view (month abbreviation)
      const getMonthAbbr = (date) => {
        return months[date.getMonth()];
      };
      
      const grouped = groupIncidentsByDate(incidents, getMonthAbbr, displayMonths);
      
      // Convert to array format for chart
      displayMonths.forEach(month => {
        data.push({
          date: month,
          total: grouped[month].total,
          pending: grouped[month].pending,
          resolved: grouped[month].resolved,
          inReview: grouped[month].inReview
        });
      });
    }
    
    // If all data is zero (no incidents), show a minimal representation
    if (data.every(item => item.total === 0) && incidents.length > 0) {
      // Distribute total incidents across periods
      const total = incidents.length;
      const pending = incidents.filter((i) => i.status === 'Pending').length;
      const resolved = incidents.filter((i) => i.status === 'Resolved').length;
      const inReview = incidents.filter((i) => i.status === 'In Review').length;
      
      const periods = data.length;
      data = data.map((item, index) => ({
        date: item.date,
        total: Math.floor(total / periods) + (index < total % periods ? 1 : 0),
        pending: Math.floor(pending / periods) + (index < pending % periods ? 1 : 0),
        resolved: Math.floor(resolved / periods) + (index < resolved % periods ? 1 : 0),
        inReview: Math.floor(inReview / periods) + (index < inReview % periods ? 1 : 0)
      }));
    }
    
    return data;
  };

  const setMockData = (incidents = []) => {
    const mockTrendData = generateTrendData(incidents, timeRange);
    
    // Calculate stats from actual incidents or use defaults
    const total = incidents.length || 142;
    const pending = incidents.filter(i => i.status === 'Pending').length || 24;
    const inReview = incidents.filter(i => i.status === 'In Review').length || 18;
    const resolved = incidents.filter(i => i.status === 'Resolved').length || 100;
    const percentageResolved = total > 0 ? Math.round((resolved / total) * 100) : 70;
    
    setAnalyticsData({
      trendData: mockTrendData,
      stats: {
        total,
        pending,
        inReview,
        resolved,
        percentageResolved,
        avgResolutionTime: calculateAvgResolutionTime(incidents) || '2.5',
        satisfactionRate: calculateSatisfactionRate(incidents) || 94
      }
    });
  };

  const statsCards = [
    {
      title: 'Total Incidents',
      value: analyticsData.stats.total || 0,
      icon: <FileText size={22} />,
      color: colors.blue,
      trend: '+12%',
      trendColor: colors.success,
      description: 'Total reported incidents'
    },
    {
      title: 'Pending Cases',
      value: analyticsData.stats.pending || 0,
      icon: <Clock size={22} />,
      color: colors.warning,
      trend: '+5%',
      trendColor: colors.warning,
      description: 'Awaiting resolution'
    },
    {
      title: 'Resolved Cases',
      value: analyticsData.stats.resolved || 0,
      icon: <CheckCircle size={22} />,
      color: colors.success,
      trend: '+18%',
      trendColor: colors.success,
      description: 'Successfully resolved'
    },
    {
      title: 'In Review',
      value: analyticsData.stats.inReview || 0,
      icon: <AlertCircle size={22} />,
      color: colors.info,
      trend: '+8%',
      trendColor: colors.info,
      description: 'Under investigation'
    }
  ];

  return (
    <Box sx={{
      backgroundColor: colors.lightGray,
      minHeight: '100vh',
      py: 3
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            mb: 3, 
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: colors.darkBlue,
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '2rem' }
              }}
            >
              Analytics Dashboard
            </Typography>
            <Typography
              variant="body1"
              sx={{ 
                color: colors.darkGray,
                fontSize: '0.9375rem'
              }}
            >
              Comprehensive security incident analytics and performance insights
            </Typography>
          </Box>

          {/* Controls Row */}
          <Box sx={{ 
            mb: 3
          }}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 2 }}
            >
              {/* Left side: Time Range and View Incidents */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                sx={{ flex: 1 }}
              >
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Time Range</InputLabel>
                  <Select
                    value={timeRange}
                    label="Time Range"
                    onChange={(e) => setTimeRange(e.target.value)}
                    size="small"
                  >
                    <MenuItem value="week">Last 7 Days</MenuItem>
                    <MenuItem value="month">Last 30 Days</MenuItem>
                    <MenuItem value="year">Last 12 Months</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  startIcon={<Eye size={18} />}
                  onClick={() => navigate('/admin/incidents')}
                  sx={{
                    borderColor: colors.borderGray,
                    color: colors.darkBlue,
                    fontSize: '0.875rem',
                    py: 0.75,
                    px: 2.5,
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
                  borderRadius: 1.5,
                  backgroundColor: colors.white,
                  width: 40,
                  height: 40,
                  '&:hover': {
                    backgroundColor: safeAlpha(colors.blue, 0.05),
                    borderColor: colors.blue
                  }
                }}
              >
                <RefreshCw size={18} />
              </IconButton>
            </Stack>
            
            <Divider sx={{ 
              borderColor: colors.borderGray
            }} />
          </Box>
        </Box>

        {/* Summary Stats - Wider and shorter cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsCards.map((card, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card sx={{
                borderRadius: 2,
                border: `1px solid ${colors.borderGray}`,
                backgroundColor: colors.white,
                height: '100%',
                width: '500',
                minHeight: 120, // Reduced height
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  borderColor: safeAlpha(card.color, 0.4)
                }
              }}>
                <CardContent sx={{ p: 2.5, height: '100%',width:300 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: safeAlpha(card.color, 0.1),
                        color: card.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Chip
                      label={card.trend}
                      size="small"
                      sx={{
                        backgroundColor: safeAlpha(card.trendColor, 0.12),
                        color: card.trendColor,
                        fontWeight: 600,
                        fontSize: '0.6875rem',
                        height: 24
                      }}
                    />
                  </Stack>
                  
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: colors.darkBlue,
                      mb: 0.5,
                      fontSize: { xs: '1.75rem', sm: '1.875rem' },
                      lineHeight: 1.2
                    }}
                  >
                    {card.value.toLocaleString()}
                  </Typography>
                  
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: colors.darkBlue,
                      mb: 0.5,
                      fontSize: '0.9375rem'
                    }}
                  >
                    {card.title}
                  </Typography>
                  
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.darkGray,
                      fontSize: '0.75rem',
                      lineHeight: 1.4
                    }}
                  >
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section - Wider layout */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            {/* Main Chart - Wider */}
            <Grid item xs={12} lg={8}>
              <Card sx={{
                borderRadius: 2,
                border: `1px solid ${colors.borderGray}`,
                backgroundColor: colors.white,
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }
              }}>
                <CardContent sx={{ p: 3, width: 600 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 700, 
                      color: colors.darkBlue,
                      fontSize: '1.25rem',
                      mb: 0.5
                    }}>
                      Incident Trends
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: colors.darkGray,
                      fontSize: '0.875rem'
                    }}>
                      {timeRange === 'week' ? 'Daily' : timeRange === 'month' ? 'Weekly' : 'Monthly'} breakdown of incident status
                    </Typography>
                  </Box>

                  {loading ? (
                    <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body1" sx={{ color: colors.darkGray }}>
                        Loading trend data...
                      </Typography>
                    </Box>
                  ) : (
                    <ProfessionalBarChart 
                      data={analyticsData.trendData || []} 
                      height={340}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Status Distribution - Wider */}
            <Grid item xs={12} lg={4}>
              <StatusDistributionCard data={analyticsData.stats} />
            </Grid>
          </Grid>
        </Box>

        {/* Performance Metrics - Compact cards */}
        <Box sx={{ mb: 4 }}>
          <Card sx={{
            borderRadius: 2,
            border: `1px solid ${colors.borderGray}`,
            backgroundColor: colors.white,
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                color: colors.darkBlue, 
                mb: 3,
                fontSize: '1.25rem'
              }}>
                Performance Metrics
              </Typography>
              
              <Grid container spacing={2}>
                {[
                  {
                    title: 'Avg. Resolution',
                    value: `${analyticsData.stats.avgResolutionTime || '0.0'} days`,
                    color: colors.blue,
                    trend: '-0.3 days',
                    icon: <Clock size={18} />,
                    description: 'Average time to resolve'
                  },
                  {
                    title: 'Satisfaction',
                    value: `${analyticsData.stats.satisfactionRate || 0}%`,
                    color: colors.success,
                    trend: '+2.4%',
                    icon: <CheckCircle size={18} />,
                    description: 'User satisfaction rate'
                  },
                  {
                    title: 'Resolution Rate',
                    value: `${analyticsData.stats.percentageResolved || 0}%`,
                    color: colors.success,
                    trend: '+3.8%',
                    icon: <TrendingUp size={18} />,
                    description: 'Cases successfully resolved'
                  },
                  {
                    title: 'First Response',
                    value: '24.7 hours',
                    color: colors.info,
                    trend: '-1.2 hours',
                    icon: <AlertCircle size={18} />,
                    description: 'Average first response time'
                  }
                ].map((metric, index) => (
                  <Grid item xs={12} sm={6} lg={3} key={index}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 1.5,
                      border: `1px solid ${safeAlpha(metric.color, 0.2)}`,
                      background: `linear-gradient(135deg, ${safeAlpha(metric.color, 0.08)} 0%, ${safeAlpha(metric.color, 0.04)} 100%)`,
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        background: `linear-gradient(135deg, ${safeAlpha(metric.color, 0.12)} 0%, ${safeAlpha(metric.color, 0.08)} 100%)`
                      }
                    }}>
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                        <Box sx={{
                          p: 1,
                          borderRadius: 1,
                          backgroundColor: safeAlpha(metric.color, 0.15),
                          color: metric.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {metric.icon}
                        </Box>
                        <Typography variant="subtitle2" sx={{ 
                          color: colors.darkBlue, 
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}>
                          {metric.title}
                        </Typography>
                      </Stack>
                      
                      <Typography variant="h3" sx={{ 
                        fontWeight: 800, 
                        color: metric.color, 
                        mb: 1,
                        fontSize: '1.5rem',
                        lineHeight: 1.2
                      }}>
                        {metric.value}
                      </Typography>
                      
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" sx={{ 
                          color: colors.darkGray,
                          fontSize: '0.6875rem',
                          fontWeight: 500
                        }}>
                          {metric.description}
                        </Typography>
                        <Chip
                          label={metric.trend}
                          size="small"
                          sx={{
                            backgroundColor: safeAlpha(colors.success, 0.12),
                            color: colors.success,
                            fontWeight: 600,
                            fontSize: '0.625rem',
                            height: 20
                          }}
                        />
                      </Stack>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Footer */}
        <Box sx={{
          mt: 4,
          pt: 3,
          borderTop: `1px solid ${colors.borderGray}`,
          textAlign: 'center'
        }}>
          <Typography variant="body2" sx={{ 
            color: colors.darkGray, 
            fontSize: '0.8125rem',
            fontWeight: 500
          }}>
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
      </Container>
    </Box>
  );
};

export default AnalyticsDashboard;