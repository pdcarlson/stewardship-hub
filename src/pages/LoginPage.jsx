// /src/pages/LoginPage.jsx
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';

const LoginPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { user, isAdmin, isLoading } = useAuth();

  // wait until the auth state is confirmed
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // if a user is logged in, redirect them away from the login page
  if (user) {
    return isAdmin ? <Navigate to="/admin" /> : <Navigate to="/member" />;
  }
  
  // if no user, render the login page
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLoginView ? 'Stewardship Hub Login' : 'Create an Account'}
        </h2>
        
        {isLoginView ? <LoginForm /> : <SignUpForm />}

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {isLoginView
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;