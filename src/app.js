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

  // ------------------- SPLASH SCREEN UI -------------------
  if (isSplash) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-700 text-white animate-fadeIn">
        <h1 className="text-5xl font-extrabold tracking-widest">LIFE CARE</h1>
        <p className="text-xl mt-2 font-light">VALET PARKING</p>
        <div className="mt-8">
            <div className="w-8 h-8 border-4 border-t-4 border-white border-opacity-30 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // ------------------- MAIN APP FLOW -------------------
  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return <LoginPage onLogin={handleLogin} />;
}

export default App;
                
