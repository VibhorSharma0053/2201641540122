import React, { useState, useEffect } from 'react';
import { Log } from '../utils/logger.js';
import { STORAGE_KEY } from '../utils/helpers.js';


const StatisticsPage = () => {
    const [links, setLinks] = useState([]);

    useEffect(() => {
        Log('frontend', 'info', 'StatisticsPage', 'Component mounted.');
        try {
            const storedLinks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            // Sort by most recently created
            storedLinks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setLinks(storedLinks);
            Log('frontend', 'info', 'StatisticsPage', `Loaded ${storedLinks.length} links from localStorage.`);
        } catch (error) {
            Log('frontend', 'error', 'StatisticsPage', `Failed to parse links: ${error.message}`);
        }
    }, []);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Link Statistics</h1>
                <p className="mt-2 text-lg text-gray-400">An overview of your shortened links.</p>
            </div>

            {links.length > 0 ? (
                <div className="overflow-x-auto bg-gray-800/50 p-1 rounded-2xl border border-gray-700 shadow-2xl">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Original URL</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Short Link</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Expires</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Clicks</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800/60 divide-y divide-gray-700">
                            {links.map((link) => (
                                <tr key={link.shortCode} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-300 truncate max-w-xs">{link.longUrl}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <a href={`${window.location.origin}/${link.shortCode}`} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:underline">
                                           {`${window.location.host}/${link.shortCode}`}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(link.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(link.expiresAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-bold">{link.clicks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-300">No links yet!</h2>
                    <p className="text-gray-400 mt-2">Go to the shortener page to create your first link.</p>
                </div>
            )}
        </div>
    );
};

export default StatisticsPage;

