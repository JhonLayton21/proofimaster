import React from "react";

const Alert = ({ message, type }) => {
    if (!message) return null;
    
    const alertClass = {
        add: 'text-green-600 bg-green-100 border-green-400',
        edit: 'text-blue-600 bg-blue-100 border-blue-400',
        delete: 'text-red-600 bg-red-100 border-red-400',
        error: 'text-yellow-600 bg-yellow-100 border-yellow-400',
    }[type] || 'text-yellow-600 bg-yellow-100 border-yellow-400';

    return (
        <div className={`mb-4 px-4 py-3 rounded relative border ${alertClass}`}>
            {message}
        </div>
    );
};

export default Alert;