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
import AnalyticsDashboard from './pages/AnalyticsDasboard';
import UserManagement from './pages/UserManagement';
import IncidentDetailPage from './pages/IncidentDetailPage';
import EditIncidentPage from './pages/EditIncidentPage';

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

            {/* Add this route for student incident detail */}
            <Route
              path="/student/incidents/:id"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <IncidentDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Add this route for student incident edit */}
            <Route
              path="/student/incidents/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <EditIncidentPage />
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

            {/* Add these routes for staff incident detail */}
            <Route
              path="/staff/incidents/:id"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <IncidentDetailPage />
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

            {/* Add these routes for admin incident detail */}
            <Route
              path="/admin/incidents/:id"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <IncidentDetailPage />
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

            <Route
              path="/user-creation"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserCreationForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user-management"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-creation"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminCreationForm />
                </ProtectedRoute>
              }
            />

            {/* Generic incident detail route (for backward compatibility) */}
            <Route
              path="/incidents/:id"
              element={
                <ProtectedRoute allowedRoles={['student', 'staff', 'admin']}>
                  <IncidentDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Generic incident edit route */}
            <Route
              path="/incidents/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <EditIncidentPage />
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

            {/* Add this route for incident details */}
            <Route
              path="/incidents/:id"
              element={
                <ProtectedRoute allowedRoles={['student', 'staff', 'admin']}>
                  <IncidentDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Add this route for editing incidents */}
            <Route
              path="/incidents/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <EditIncidentPage />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;