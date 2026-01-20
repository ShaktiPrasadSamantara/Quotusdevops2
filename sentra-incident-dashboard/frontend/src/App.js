import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ReportIncidentPage from './pages/ReportIncidentPage';
import MyIncidentsPage from './pages/MyIncidentsPage';
import StudentDashboard from './pages/StudentDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminIncidentsPage from './pages/AdminIncidentsPage';
import AwarenessHubPage from './pages/AwarenessHubPage';
import Navbar from './components/layout/Navbar';
import getTheme from './theme';
import UserCreationForm from './pages/userCreate'; 
import AdminCreationForm from './pages/adminCreation';
// import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AnalyticsDashboard from './pages/AnalyticsDasboard';
import UserManagement from './pages/UserManagement';


function App() {
  const [mode, setMode] = useState('light');
  const theme = getTheme(mode);

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar onToggleMode={toggleMode} mode={mode} />
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/report"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ReportIncidentPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/my-incidents"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MyIncidentsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/incidents"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <AdminIncidentsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/awareness"
              element={
                <ProtectedRoute allowedRoles={['student', 'staff', 'admin']}>
                  <AwarenessHubPage />
                </ProtectedRoute>
              }
            />

            // In your App.js or router configuration
            <Route path="/user-creation" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserCreationForm />
              </ProtectedRoute>
            } />


            <Route path="/analytics" element={
              
                <AnalyticsDashboard/>
             
            } />
            <Route path="/user-management" element={
              
                <UserManagement/>
             
            } />

            <Route path="/admin-creation" element={
             
                <AdminCreationForm/>
           
            } />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;