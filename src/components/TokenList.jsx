import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import TokenModal from './TokenModal'; // Token Generate/View Popup
import TokenCard from './TokenCard'; // Individual Token Display

const TokenList = ({ user }) => {
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const authToken = user.token;

    const fetchTokens = async () => {
        setIsRefreshing(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/tokens/data`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch tokens');
            }
            setTokens(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleCarOut = async (tokenId) => {
        if (!window.confirm("Are you sure you want to mark this car as OUT?")) return;

        try {
            const response = await fetch(`${API_BASE_URL}/tokens/out/${tokenId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to mark OUT');
            }
            
            // Refresh the list after successful OUT
            fetchTokens();
            alert('Car marked OUT successfully!');
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    useEffect(() => {
        fetchTokens();
    }, []);

    const tokenInCount = tokens.filter(t => t.outTime === null).length;

    if (loading) {
        return <div className="text-center p-8">Loading token data...</div>;
    }

    return (
        <div>
            {/* Generate Token Button */}
            {(user.role === 'manager' || user.role === 'driver') && (
                <div className="mb-4 sticky top-16 bg-gray-50 z-5 p-2">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center text-lg"
                    >
                        + Generate New Token ({tokenInCount} Cars In)
                    </button>
                </div>
            )}
            
            {/* Refresh Button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={fetchTokens}
                    disabled={isRefreshing}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-1 px-3 rounded-full text-sm flex items-center"
                >
                    {isRefreshing ? (
                        <div className="w-4 h-4 border-2 border-t-2 border-gray-800 border-opacity-30 rounded-full animate-spin mr-2"></div>
                    ) : 'Refresh Data'}
                </button>
            </div>


            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

            <h2 className="text-xl font-bold mb-3 border-b pb-2">
                {user.role === 'driver' ? 'My Tokens' : 'Total Tokens'} ({tokens.length})
            </h2>

            <div className="space-y-4">
                {tokens.length === 0 ? (
                    <p className="text-center text-gray-500">No tokens found.</p>
                ) : (
                    tokens.map(token => (
                        <TokenCard 
                            key={token._id} 
                            token={token} 
                            onCarOut={handleCarOut} 
                            canManage={user.role === 'owner' || (user.role === 'manager' && token.outTime === null)} // Owner can see, Manager can mark out
                        />
                    ))
                )}
            </div>

            {/* Token Generate Modal */}
            <TokenModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTokenGenerated={fetchTokens}
                authToken={authToken}
            />
        </div>
    );
};

export default TokenList;
