import React from 'react';
import ReactDOM from 'react-dom/client';
// -----------------------------------------------------------------
// ✅ FIX 2: App component ko uske sahi naam aur extension '.js' se import kiya
import App from './app.js'; 
// -----------------------------------------------------------------
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
