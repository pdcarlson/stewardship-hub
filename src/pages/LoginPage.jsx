// /src/pages/LoginPage.jsx
// this is the main page component for the login screen.
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Stewardship Hub Login</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;