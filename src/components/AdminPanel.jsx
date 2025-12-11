import React, { useState } from 'react';
import ManagePoints from './admin/ManagePoints';
import ManageUsers from './admin/ManageUsers';

const AdminPanel = ({ user }) => {
    const [adminTab, setAdminTab] = useState('users'); // 'users' or 'points'

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold border-b pb-2">Owner Admin Control</h2>

            {/* Sub-Tab Navigation */}
            <div className="flex bg-white rounded-lg shadow-sm p-1">
                <button
                    onClick={() => setAdminTab('users')}
                    className={`flex-1 py-2 text-center text-sm font-semibold rounded-lg transition ${
                        adminTab === 'users' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    Manage Users
                </button>
                <button
                    onClick={() => setAdminTab('points')}
                    className={`flex-1 py-2 text-center text-sm font-semibold rounded-lg transition ${
                        adminTab === 'points' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    Manage Locations
                </button>
            </div>

            {/* Content Area */}
            {adminTab === 'users' && <ManageUsers authToken={user.token} />}
            {adminTab === 'points' && <ManagePoints authToken={user.token} />}

            {/* Owner Password Reset Option (Optional) */}
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg text-sm text-yellow-800">
                <p>💡 Password reset option for Owners will be implemented here (using the reset-owner-password API).</p>
            </div>
        </div>
    );
};

export default AdminPanel;
