import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx'; // <--- App component ko import kiya
import './index.css'; // <--- Tailwind CSS directives ko load kiya

// Window mein React App ko '#root' div ke andar daalo
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
