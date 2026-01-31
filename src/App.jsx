import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RouteProvider } from './context/RouteContext';
import { Login, Register } from './components/Auth/AuthForms';
import PassengerDashboard from './pages/PassengerDashboard';
import ConductorDashboard from './pages/ConductorDashboard';
import OperatorDashboard from './pages/OperatorDashboard';
import ProfilePage from './pages/ProfilePage';
import NavigationRoute from './pages/NavigationRoute';
import MainLayout from './components/Layout/MainLayout';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // Or unauthorized page
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <RouteProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<MainLayout />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/navigate"
                element={
                  <ProtectedRoute allowedRoles={['passenger']}>
                    <NavigationRoute />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </RouteProvider>
    </AuthProvider>
  );
}

// Helper to route to correct dashboard based on role
function DashboardRouter() {
  const { user } = useAuth();
  switch (user.role) {
    case 'passenger': return <PassengerDashboard />;
    case 'conductor': return <ConductorDashboard />;
    case 'operator': return <OperatorDashboard />;
    default: return <Navigate to="/" />;
  }
}
