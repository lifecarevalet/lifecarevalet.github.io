import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import UserForm from './UserForm'; // Naya User banana aur update karna

const ManageUsers = ({ authToken }) => {
    const [users, setUsers] = useState([]);
    const [points, setPoints] = useState([]); // Location data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // Null = new user, object = editing

    const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch Users
            const userResponse = await fetch(`${API_BASE_URL}/users/admin/users`, {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            const userData = await userResponse.json();
            if (!userResponse.ok) throw new Error(userData.message || 'Failed to fetch users');

            // 2. Fetch Points
            const pointResponse = await fetch(`${API_BASE_URL}/points`, {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            const pointData = await pointResponse.json();
            if (!pointResponse.ok) throw new Error(pointData.message || 'Failed to fetch points');

            setUsers(userData);
            setPoints(pointData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId, username) => {
        if (!window.confirm(`Are you sure you want to DELETE user: ${username}?`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/users/admin/delete-user/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete user');
            }

            alert(`User ${username} deleted successfully.`);
            fetchAllData();
        } catch (err) {
            setError(err.message);
            alert(`Error: ${err.message}`);
        }
    };

    const handleFormSubmit = () => {
        setIsFormOpen(false);
        setEditingUser(null);
        fetchAllData(); // Refresh list after CUD
    };

    useEffect(() => {
        fetchAllData();
    }, [authToken]);

    if (loading) return <div className="text-center p-4">Loading users and points...</div>;
    if (error) return <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>;

    return (
        <div className="space-y-6">
            <button
                onClick={() => { setEditingUser(null); setIsFormOpen(true); }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg"
            >
                + Create New Manager / Driver
            </button>

            <h3 className="text-lg font-bold mt-6 border-t pt-4">User List ({users.length})</h3>
            <div className="space-y-3">
                {users.map(user => (
                    <div key={user._id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-gray-400">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-lg">{user.fullName} <span className="text-xs font-normal bg-gray-200 px-2 py-0.5 rounded-full">{user.role.toUpperCase()}</span></p>
                                <p className="text-sm text-gray-700">@{user.username}</p>
                                <p className="text-xs text-blue-500 mt-1">{user.pointId?.name}</p>
                                {user.managerId && <p className="text-xs text-gray-500">Manager: {user.managerId.fullName}</p>}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => { setEditingUser(user); setIsFormOpen(true); }}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold py-1 px-3 rounded-full"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(user._id, user.username)}
                                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-3 rounded-full"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* User Create/Edit Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <UserForm 
                        authToken={authToken}
                        onClose={() => { setIsFormOpen(false); setEditingUser(null); }}
                        onSubmit={handleFormSubmit}
                        userToEdit={editingUser}
                        pointsList={points}
                        managerList={users.filter(u => u.role === 'manager')} // Filter managers for assignment
                    />
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
