// /src/components/ProtectedRoute.jsx
// this component guards routes that require a user to be logged in.
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // you can replace this with a nice loading spinner component
    return <div>Loading...</div>;
  }

  // if there's a user, render the child route. otherwise, redirect to login.
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;