// /src/context/AuthContext.jsx
// this file creates a global state (context) for authentication.
import { createContext, useState, useEffect, useContext } from 'react';
import { account, isUserAdmin } from '../lib/appwrite';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // check for a logged-in user when the app first loads.
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        const adminStatus = await isUserAdmin();
        setIsAdmin(adminStatus);
      } catch (error) {
        // if no user is found, 'user' remains null.
        setUser(null);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    await account.createEmailPasswordSession(email, password);
    const currentUser = await account.get();
    setUser(currentUser);
    const adminStatus = await isUserAdmin();
    setIsAdmin(adminStatus);
    // redirect to the appropriate dashboard after login
    navigate(adminStatus ? '/admin' : '/member');
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
    setIsAdmin(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook to easily access auth context data
export const useAuth = () => {
  return useContext(AuthContext);
};