// /src/components/MemberRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MemberRoute = () => {
  const { user, isMember, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // admins can also access member pages
  if (user && (isMember || isAdmin)) {
    return <Outlet />;
  }

  // logged-in but not verified members go to pending page
  if (user) {
    return <Navigate to="/pending-verification" />;
  }

  // not logged in at all, go to login page
  return <Navigate to="/login" />;
};

export default MemberRoute;