// /src/context/AuthContext.jsx
// this file creates a global state (context) for authentication.
import { createContext, useState, useEffect, useContext } from 'react';
import { account, isUserAdmin, isUserMember, updateUserPrefs } from '../lib/appwrite';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false); // add member status state
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
        
        // check both admin and member status
        const [adminStatus, memberStatus] = await Promise.all([isUserAdmin(), isUserMember()]);
        setIsAdmin(adminStatus);
        setIsMember(memberStatus);

      } catch (error) {
        // if no user is found, reset all state
        setUser(null);
        setIsAdmin(false);
        setIsMember(false);
        setPrefs({});
      } finally {
        setIsLoading(false);
        // clean up the url after an oauth redirect
        if (window.location.hash.includes('secret')) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    await account.createEmailPasswordSession(email, password);
    const currentUser = await account.get();
    setUser(currentUser);
    setPrefs(currentUser.prefs || {});

    const [adminStatus, memberStatus] = await Promise.all([isUserAdmin(), isUserMember()]);
    setIsAdmin(adminStatus);
    setIsMember(memberStatus);

    // redirect to the appropriate dashboard after login
    navigate(adminStatus ? '/admin' : '/member');
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
    setIsAdmin(false);
    setIsMember(false);
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
    <AuthContext.Provider value={{ user, isAdmin, isMember, login, logout, isLoading, prefs, updatePrefs }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook to easily access auth context data
export const useAuth = () => {
  return useContext(AuthContext);
};