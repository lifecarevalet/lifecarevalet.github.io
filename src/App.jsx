import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function App() {
  const [isSplash, setIsSplash] = useState(true);
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    
    // 3 seconds splash screen, even if user is auto-logged in
    const timer = setTimeout(() => {
      setIsSplash(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

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
