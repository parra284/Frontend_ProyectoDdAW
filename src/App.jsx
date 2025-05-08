import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css';
import Router from './router';
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Router />
  </AuthProvider>
);