import ReactDOM from 'react-dom/client';
import React from 'react';
import './main.css';
import Router from './router';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);