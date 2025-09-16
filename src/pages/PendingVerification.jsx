// /src/pages/PendingVerification.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createVerificationRequest, getUserVerificationRequest } from '../lib/appwrite';
import Button from '../components/ui/Button';

const PendingVerification = () => {
  const { user, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestStatus, setRequestStatus] = useState('idle'); // 'idle', 'sent', 'already_pending'

  // check if a request already exists when the page loads
  useEffect(() => {
    if (user) {
      getUserVerificationRequest(user.$id).then(response => {
        if (response.total > 0) {
          setRequestStatus('already_pending');
        }
      });
    }
  }, [user]);

  const handleRequestAccess = async () => {
    setIsSubmitting(true);
    try {
      await createVerificationRequest();
      setRequestStatus('sent');
    } catch (error) {
      console.error('failed to create verification request:', error);
      alert('there was an error submitting your request. please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonText = () => {
    if (requestStatus === 'sent' || requestStatus === 'already_pending') {
      return 'Request Sent';
    }
    return 'Request Access';
  };

  return (
    <div className="min-h-svh bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Access Pending
        </h2>
        <p className="text-gray-600 mb-6">
          Welcome, {user?.name}! Your account is currently awaiting verification from an admin.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={handleRequestAccess}
            className="w-full"
            disabled={isSubmitting || requestStatus !== 'idle'}
          >
            {isSubmitting ? 'Submitting...' : getButtonText()}
          </Button>
          <Button onClick={logout} variant="secondary" className="w-full">
            Logout
          </Button>
        </div>
        {(requestStatus === 'sent' || requestStatus === 'already_pending') && (
          <p className="text-sm text-gray-500 mt-4">
            An admin has been notified. We'll let you know when your access has been approved.
          </p>
        )}
      </div>
    </div>
  );
};

export default PendingVerification;