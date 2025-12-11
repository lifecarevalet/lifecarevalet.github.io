import React from 'react';

const TokenCard = ({ token, onCarOut, canManage }) => {
    const isOut = token.outTime !== null;
    const cardClass = isOut ? 'bg-gray-100 border-gray-300' : 'bg-white border-green-500 shadow-lg';

    // Time Formatting
    const formatTime = (time) => {
        if (!time) return 'N/A';
        return new Date(time).toLocaleString('en-IN', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', day: 'numeric', month: 'short'
        });
    };

    return (
        <div className={`p-4 border-l-4 rounded-lg ${cardClass}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className={`text-2xl font-extrabold ${isOut ? 'text-gray-600' : 'text-green-700'}`}>
                        TOKEN #{token.tokenNumber}
                    </h3>
                    <p className="text-sm text-gray-500">{token.pointId?.name || 'Unassigned Location'}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${isOut ? 'bg-gray-400 text-white' : 'bg-red-500 text-white animate-pulse'}`}>
                    {isOut ? 'CAR OUT' : 'CAR IN'}
                </div>
            </div>
            
            <div className="mt-3 border-t pt-3">
                <p className="text-lg font-bold text-gray-800">{token.carNumber}</p>
                <p className="text-sm text-gray-600">Customer: {token.customerName}</p>
            </div>

            <div className="mt-3 text-xs text-gray-500 grid grid-cols-2 gap-2">
                <div>
                    <span className="font-medium">IN:</span> {formatTime(token.inTime)}
                </div>
                <div>
                    <span className="font-medium">Driver:</span> {token.driverId?.fullName || token.driverId?.username}
                </div>
                <div>
                    <span className="font-medium">OUT:</span> {isOut ? formatTime(token.outTime) : 'Waiting'}
                </div>
                <div>
                    <span className="font-medium">Role:</span> {token.driverRole}
                </div>
            </div>

            {/* Car OUT Button (Only if IN and user can manage) */}
            {!isOut && canManage && (token.driverRole === 'manager' || token.driverRole === 'driver') && (
                <button
                    onClick={() => onCarOut(token._id)}
                    className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold transition"
                >
                    Mark Car OUT
                </button>
            )}
        </div>
    );
};

export default TokenCard;
