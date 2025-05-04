import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css';

function App() {
  return (<h1>Hola</h1>);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);