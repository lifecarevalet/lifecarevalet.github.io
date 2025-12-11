import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

const ManagePoints = ({ authToken }) => {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newPointName, setNewPointName] = useState('');
    const [newPointAddress, setNewPointAddress] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const fetchPoints = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/points`, {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch points');
            setPoints(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePoint = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/points`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify({ name: newPointName, address: newPointAddress }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create point');
            
            alert(`Point "${newPointName}" created successfully!`);
            setNewPointName('');
            setNewPointAddress('');
            fetchPoints();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeletePoint = async (pointId, pointName) => {
        if (!window.confirm(`Are you sure you want to DELETE location: ${pointName}? All assigned users will be unlinked.`)) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/points/${pointId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete point');
            }
            
            alert(`Location "${pointName}" deleted.`);
            fetchPoints();
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchPoints();
    }, [authToken]);

    if (loading) return <div className="text-center p-4">Loading locations...</div>;
    if (error) return <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>;

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold">Create New Location</h3>
            <form onSubmit={handleCreatePoint} className="bg-white p-4 rounded-lg shadow-sm">
                <input
                    type="text"
                    placeholder="Location Name (e.g., Taj Hotel Banquet)"
                    value={newPointName}
                    onChange={(e) => setNewPointName(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-2"
                    required
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={newPointAddress}
                    onChange={(e) => setNewPointAddress(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-4"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg"
                    disabled={isCreating}
                >
                    {isCreating ? 'Creating...' : '+ Add New Point'}
                </button>
            </form>

            <h3 className="text-lg font-bold mt-6 border-t pt-4">Existing Locations ({points.length})</h3>
            <div className="space-y-3">
                {points.map(point => (
                    <div key={point._id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-gray-800">{point.name}</p>
                            <p className="text-sm text-gray-500">{point.address}</p>
                        </div>
                        <button 
                            onClick={() => handleDeletePoint(point._id, point.name)}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-3 rounded-full"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagePoints;
