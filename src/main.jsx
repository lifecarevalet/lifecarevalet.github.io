import React from 'react';
import ReactDOM from 'react-dom/client';
// -------------------------------------------------------------
// YAHAN BADALNA HAI: Filename ko exact match karein: app.js
import App from './app.js'; 
// -------------------------------------------------------------
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
