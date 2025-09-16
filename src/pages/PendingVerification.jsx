// /src/pages/PendingVerification.jsx
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const PendingVerification = () => {
  const { user, logout } = useAuth();

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
          <Button onClick={() => alert('Request Access feature coming soon!')} className="w-full">
            Request Access
          </Button>
          <Button onClick={logout} variant="secondary" className="w-full">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingVerification;