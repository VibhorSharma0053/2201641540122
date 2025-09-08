import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Log } from '../utils/logger.js';
import { STORAGE_KEY } from '../utils/helpers.js';

const RedirectHandler = () => {
    const { shortCode } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        Log('frontend', 'info', 'RedirectHandler', `Attempting to redirect for shortcode: ${shortCode}`);
        const storedLinks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const link = storedLinks.find(l => l.shortCode === shortCode);

        if (link) {
            const now = new Date();
            if (new Date(link.expiresAt) < now) {
                Log('frontend', 'warn', 'RedirectHandler', `Attempted to access expired link: ${shortCode}`);
                setError(`Link has expired on ${new Date(link.expiresAt).toLocaleString()}`);
                return;
            }

            
            link.clicks = (link.clicks || 0) + 1;
            link.clickData = link.clickData || [];
            link.clickData.push({ timestamp: now.toISOString() }); // In a real app, you'd add geo/source
            localStorage.setItem(STORAGE_KEY, JSON.stringify(storedLinks));
            
            Log('frontend', 'info', 'RedirectHandler', `Redirecting ${shortCode} to ${link.longUrl}`);
            window.location.href = link.longUrl;
        } else {
            Log('frontend', 'error', 'RedirectHandler', `Shortcode not found: ${shortCode}`);
            setError('This shortened link was not found or has been deleted.');
        }
    }, [shortCode, navigate]);

    if (error) {
        return (
            <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold text-red-400 mb-4">Redirect Failed</h1>
                <p className="text-gray-300">{error}</p>
                <button onClick={() => navigate('/')} className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-300">Redirecting...</h1>
        </div>
    );
};

export default RedirectHandler;

