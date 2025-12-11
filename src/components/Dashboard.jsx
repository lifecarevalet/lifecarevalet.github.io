import React, { useState } from 'react';
import TokenList from './TokenList'; 
import AdminPanel from './AdminPanel'; // Owner ka CUD panel

const Dashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('data'); // 'data' ya 'admin'
    
    // Token Management button sirf Driver aur Manager ke liye
    const canGenerateToken = user.role === 'manager' || user.role === 'driver';
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            
            {/* Header / Nav */}
            <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
                <div className="text-left">
                    <h1 className="text-2xl font-extrabold text-green-700 leading-none">LIFE CARE</h1>
                    <p className="text-xs text-gray-500">Welcome, {user.fullName || user.username} ({user.role.toUpperCase()})</p>
                </div>
                
                <button 
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-1 px-3 rounded-full transition"
                >
                    Logout
                </button>
            </header>

            {/* Tab Navigation */}
            <div className="flex justify-around bg-white p-2 border-b border-gray-200">
                {/* Data/Token View Tab */}
                <button
                    onClick={() => setActiveTab('data')}
                    className={`flex-1 py-2 text-center text-sm font-semibold border-b-4 transition duration-150 ${
                        activeTab === 'data' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Token Data
                </button>

                {/* Admin Tab (Only for Owner) */}
                {user.role === 'owner' && (
                    <button
                        onClick={() => setActiveTab('admin')}
                        className={`flex-1 py-2 text-center text-sm font-semibold border-b-4 transition duration-150 ${
                            activeTab === 'admin' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Admin Control
                    </button>
                )}
            </div>

            {/* Main Content */}
            <main className="flex-grow p-4 overflow-y-auto">
                {activeTab === 'data' && <TokenList user={user} canGenerate={canGenerateToken} />}
                {activeTab === 'admin' && user.role === 'owner' && <AdminPanel user={user} />}
            </main>
        </div>
    );
};

export default Dashboard;
