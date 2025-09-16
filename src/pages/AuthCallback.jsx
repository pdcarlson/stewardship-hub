// /src/pages/AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const { isAdmin, isMember, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // wait until the auth context has finished loading the user's status
    if (!isLoading && user) {
      if (isAdmin) {
        navigate('/admin');
      } else if (isMember) {
        navigate('/member');
      } else {
        navigate('/pending-verification');
      }
    }
  }, [isLoading, isAdmin, isMember, user, navigate]);

  return (
    <div className="min-h-svh flex items-center justify-center">
      <p className="text-gray-500">Please wait, signing you in...</p>
    </div>
  );
};

export default AuthCallback;