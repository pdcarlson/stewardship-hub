// /src/App.jsx
// this file now handles all the application routing.
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// a special component to redirect logged-in users from the root path
const HomeRedirect = () => {
    const { user, isAdmin, isLoading } = useAuth();

    if (isLoading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" />;
    
    return isAdmin ? <Navigate to="/admin" /> : <Navigate to="/member" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/member" element={<MemberDashboard />} />
        </Route>
        
        {/* add a fallback for any other path */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;