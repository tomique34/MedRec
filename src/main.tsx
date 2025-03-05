import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import DoctorDashboard from './pages/DoctorDashboard.tsx';
import { initializeLanguage } from './lib/i18n.ts';
import './index.css';

// Initialize language from localStorage or default to 'en'
initializeLanguage();

// Authentication check function
const isAuthenticated = () => {
  // In a real app, this would check for a valid token or session
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Get user role from localStorage
const getUserRole = () => {
  return localStorage.getItem('userRole') || '';
};

// Protected route component with role-based access
const ProtectedRoute = ({ element, requiredRole }: { element: React.ReactNode, requiredRole?: 'admin' | 'doctor' }) => {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // If a specific role is required, check if the user has that role
  if (requiredRole && getUserRole() !== requiredRole) {
    // Redirect to login if user doesn't have the required role
    return <Navigate to="/login" replace />;
  }
  
  return <>{element}</>;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} />
        <Route path="/doctor" element={<ProtectedRoute element={<DoctorDashboard />} requiredRole="doctor" />} />
        <Route path="/legacy" element={<App />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
