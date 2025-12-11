import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

const UserForm = ({ authToken, onClose, onSubmit, userToEdit, pointsList, managerList }) => {
    const isEdit = !!userToEdit;
    const [formData, setFormData] = useState({
        fullName: userToEdit?.fullName || '',
        contactNumber: userToEdit?.contactNumber || '',
        username: userToEdit?.username || '',
        password: '',
        role: userToEdit?.role || 'manager',
        managerId: userToEdit?.managerId?._id || '', // For driver
        pointId: userToEdit?.pointId?._id || '',   // Location assignment
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const endpoint = isEdit 
            ? `${API_BASE_URL}/users/admin/update-user/${userToEdit._id}` 
            : `${API_BASE_URL}/users/admin/create-user`;
        const method = isEdit ? 'PUT' : 'POST';

        // Update mein, agar password empty hai toh use request body se remove kar dein
        const dataToSend = { ...formData };
        if (isEdit && !dataToSend.password) {
            delete dataToSend.password;
        }

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${authToken}` 
                },
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `${isEdit ? 'Update' : 'Creation'} failed`);
            
            alert(`User ${isEdit ? 'updated' : 'created'} successfully!`);
            onSubmit();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 relative overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-green-700">
                {isEdit ? 'Edit User' : 'Create New User'}
            </h3>
            
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Role and Location */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            disabled={isEdit} // Role edit karna allow nahi karna chahiye
                        >
                            <option value="manager">Manager</option>
                            <option value="driver">Driver</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assign Location</label>
                        <select
                            name="pointId"
                            value={formData.pointId}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        >
                            <option value="">-- Select Point --</option>
                            {pointsList.map(point => (
                                <option key={point._id} value={point._id}>{point.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Manager Assignment (Only for Driver) */}
                {formData.role === 'driver' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assign Manager</label>
                        <select
                            name="managerId"
                            value={formData.managerId}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        >
                            <option value="">-- Select Manager --</option>
                            {managerList.map(manager => (
                                <option key={manager._id} value={manager._id}>{manager.fullName} (@{manager.username})</option>
                            ))}
                        </select>
                    </div>
                )}


                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                
                <label className="block text-sm font-medium text-gray-700">Username (Login ID)</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                
                <label className="block text-sm font-medium text-gray-700">Password {isEdit && '(Leave blank to keep same)'}</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded-lg" required={!isEdit} />

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create User')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;
