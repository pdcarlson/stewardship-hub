// /src/components/AdminRoute.jsx
// this component guards routes that require a user to be an admin.
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // if there's a user and they are an admin, render the child route.
  // otherwise, redirect them. non-admins are sent to the member page.
  return user && isAdmin ? <Outlet /> : <Navigate to="/member" />;
};

export default AdminRoute;