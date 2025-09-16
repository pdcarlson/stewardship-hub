// /src/components/MemberRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MemberRoute = () => {
  const { user, isMember, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // if a user is logged in and is a verified member, render the child route.
  // otherwise, they will be redirected.
  return user && isMember ? <Outlet /> : <Navigate to="/" />;
};

export default MemberRoute;