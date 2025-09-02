// /src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute'; // import the new admin route

// a special component to redirect logged-in users from the root path
const HomeRedirect = () => {
    const { user, isAdmin, isLoading } = useAuth();

    if (isLoading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    
    return isAdmin ? <Navigate to="/admin" /> : <Navigate to="/member" />;
};

function App() {
  return (
    <Routes>
      {/* public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* protected routes for any logged-in user */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/member" element={<MemberDashboard />} />

        {/* protected routes for admins only */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
      
      {/* add a fallback for any other path */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;