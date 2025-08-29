// /src/main.jsx
// we wrap the whole app in the AuthProvider and Router.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // assuming you have tailwind setup here
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);