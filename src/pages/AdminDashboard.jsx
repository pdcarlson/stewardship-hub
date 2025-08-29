// /src/pages/AdminDashboard.jsx
// a simple placeholder for the admin's main view.
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name || 'Admin'}!</p>
      <button onClick={logout} className="p-2 bg-red-500 text-white rounded">Logout</button>
    </div>
  );
};

export default AdminDashboard;