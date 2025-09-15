// /src/context/AuthContext.jsx
// this file creates a global state (context) for authentication.
import { createContext, useState, useEffect, useContext } from 'react';
import { account, isUserAdmin, updateUserPrefs } from '../lib/appwrite';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [prefs, setPrefs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // check for a logged-in user when the app first loads.
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        setPrefs(currentUser.prefs || {});
        const adminStatus = await isUserAdmin();
        setIsAdmin(adminStatus);
      } catch (error) {
        // if no user is found, 'user' remains null.
        setUser(null);
        setIsAdmin(false);
        setPrefs({});
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
    setPrefs(currentUser.prefs || {});
    const adminStatus = await isUserAdmin();
    setIsAdmin(adminStatus);
    // redirect to the appropriate dashboard after login
    navigate(adminStatus ? '/admin' : '/member');
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
    setIsAdmin(false);
    setPrefs({});
    navigate('/login');
  };
  
  // new function to update preferences
  const updatePrefs = async (newPrefs) => {
    try {
      // merge with existing prefs to not overwrite other settings
      const updatedPrefs = { ...prefs, ...newPrefs };
      await updateUserPrefs(updatedPrefs);
      setPrefs(updatedPrefs);
    } catch (error) {
      console.error("failed to update preferences:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, isLoading, prefs, updatePrefs }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook to easily access auth context data
export const useAuth = () => {
  return useContext(AuthContext);
};