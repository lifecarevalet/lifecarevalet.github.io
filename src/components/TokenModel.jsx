import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

const TokenModal = ({ isOpen, onClose, onTokenGenerated, authToken }) => {
    const [carNumber, setCarNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successToken, setSuccessToken] = useState(null);

    const resetForm = () => {
        setCarNumber('');
        setCustomerName('');
        setError(null);
        setSuccessToken(null);
        setLoading(false);
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessToken(null);

        try {
            const response = await fetch(`${API_BASE_URL}/tokens/in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ carNumber, customerName }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Token generation failed');
            }

            setSuccessToken(data.token);
            onTokenGenerated(); // Refresh token list
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    // Close modal function (resets state)
    const handleClose = () => {
        resetForm();
        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative">
                
                <h3 className="text-2xl font-bold mb-4 border-b pb-2 text-green-700">Generate Token</h3>
                
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                {successToken ? (
                    // --- SUCCESS VIEW (Token Display) ---
                    <div className="text-center">
                        <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h4 className="text-xl font-bold mb-2">Token #{successToken.tokenNumber} Generated!</h4>
                        
                        <div className="text-left bg-gray-50 p-4 rounded-lg">
                            <p className="text-lg font-bold">Car: {successToken.carNumber}</p>
                            <p className="text-sm">Time IN: {new Date(successToken.inTime).toLocaleString()}</p>
                            <p className="text-sm">Driver: {successToken.driverId}</p>
                        </div>

                        {/* Owner Details (Footer) */}
                        <div className="mt-4 text-xs text-gray-600 border-t pt-2">
                            <p className="font-bold">Life Care Valet Parking</p>
                            {successToken.ownerDetails.map((owner, index) => (
                                <p key={index}>
                                    {owner.name} Mo. {owner.contact}
                                </p>
                            ))}
                        </div>

                        <button 
                            onClick={handleClose}
                            className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    // --- GENERATE FORM ---
                    <form onSubmit={handleGenerate}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Car Number</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 uppercase"
                                value={carNumber}
                                onChange={(e) => setCarNumber(e.target.value.toUpperCase())}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name (Optional)</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-t-2 border-white border-opacity-30 rounded-full animate-spin mr-2"></div>
                                ) : 'Generate Token'}
                            </button>
                        </div>
                    </form>
                )}
                
            </div>
        </div>
    );
};

export default TokenModal;
