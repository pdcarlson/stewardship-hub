// /src/pages/MemberDashboard.jsx
// a simple placeholder for the member's main view.
import { useAuth } from '../context/AuthContext';

const MemberDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <h1>Member Dashboard</h1>
      <p>Welcome, {user?.name || 'Member'}!</p>
      <button onClick={logout} className="p-2 bg-red-500 text-white rounded">Logout</button>
    </div>
  );
};

export default MemberDashboard;