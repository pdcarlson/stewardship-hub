// /src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import PublicDashboard from './pages/PublicDashboard';
import AdminDashboardContainer from './containers/AdminDashboardContainer';
import MemberDashboardContainer from './containers/MemberDashboardContainer';
import AdminRoute from './components/AdminRoute';
import MemberRoute from './components/MemberRoute';

// a special component to redirect logged-in users from the login path
const LoginRedirect = () => {
    const { user, isAdmin, isLoading } = useAuth();

    if (isLoading) return <div>Loading...</div>;
    // if a user is logged in, send them to the correct dashboard
    if (user) {
      return isAdmin ? <Navigate to="/admin" /> : <Navigate to="/member" />;
    }
    // if no user, show the login page
    return <LoginPage />;
};

function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<PublicDashboard />} />
      <Route path="/login" element={<LoginRedirect />} />

      {/* protected routes for admins only */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboardContainer />} />
      </Route>

      {/* protected routes for verified members */}
      <Route element={<MemberRoute />}>
        <Route path="/member" element={<MemberDashboardContainer />} />
      </Route>
      
      {/* add a fallback for any other path */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;