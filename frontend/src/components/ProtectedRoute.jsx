import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If adminOnly is true and user is not an admin, redirect to home
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the child routes
  return <Outlet />;
};
