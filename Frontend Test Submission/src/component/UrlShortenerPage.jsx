import React, { useState, useEffect } from 'react';
import { Log } from '../utils/logger.js';
import { MAX_URLS, DEFAULT_VALIDITY_MINS, STORAGE_KEY, generateShortCode } from '../utils/helpers.js';

const UrlShortenerPage = () => {
  const [inputs, setInputs] = useState([{ id: 1, longUrl: '', validity: '', customShortcode: '', error: '' }]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    Log('frontend', 'info', 'UrlShortenerPage', 'Component mounted.');
  }, []);

  const handleInputChange = (id, field, value) => {
    setInputs(inputs.map(input => (input.id === id ? { ...input, [field]: value, error: '' } : input)));
  };

  const addUrlField = () => {
    if (inputs.length < MAX_URLS) {
      setInputs([...inputs, { id: Date.now(), longUrl: '', validity: '', customShortcode: '', error: '' }]);
      Log('frontend', 'debug', 'UrlShortenerPage', 'Added a new URL input field.');
    }
  };

  const removeUrlField = (id) => {
    setInputs(inputs.filter(input => input.id !== id));
    Log('frontend', 'debug', 'UrlShortenerPage', `Removed URL input field ID: ${id}.`);
  };
  
  const validateUrl = (url) => {
      try {
          new URL(url);
          return true;
      } catch (_) {
          return false;
      }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Log('frontend', 'info', 'UrlShortenerPage', 'Submit button clicked.');
    
    let allValid = true;
    const newInputs = [...inputs];

    const storedLinks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const existingShortcodes = new Set(storedLinks.map(l => l.shortCode));

    inputs.forEach(input => {
      if (!input.longUrl) return; 

      if (!validateUrl(input.longUrl)) {
        input.error = 'Please enter a valid URL (e.g., https://example.com).';
        allValid = false;
        Log('frontend', 'warn', 'UrlShortenerPage.validation', `Invalid URL format: ${input.longUrl}`);
      } else if (input.customShortcode && existingShortcodes.has(input.customShortcode)) {
        input.error = 'This custom shortcode is already taken.';
        allValid = false;
        Log('frontend', 'warn', 'UrlShortenerPage.validation', `Shortcode collision: ${input.customShortcode}`);
      } else if (input.validity && (!Number.isInteger(Number(input.validity)) || Number(input.validity) <= 0)) {
          input.error = 'Validity must be a positive whole number (in minutes).';
          allValid = false;
          Log('frontend', 'warn', 'UrlShortenerPage.validation', `Invalid validity period: ${input.validity}`);
      }
    });

    if (!allValid) {
      setInputs(newInputs);
      return;
    }
    
    const newResults = [];
    inputs.forEach(input => {
      if (!input.longUrl) return;

      const shortCode = input.customShortcode || generateShortCode();
      const validityMins = input.validity ? parseInt(input.validity, 10) : DEFAULT_VALIDITY_MINS;
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + validityMins * 60000);

      const newLink = {
        longUrl: input.longUrl,
        shortCode,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        clicks: 0,
        clickData: []
      };
      
      storedLinks.push(newLink);
      newResults.push(newLink);
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedLinks));
    setResults(prev => [...newResults, ...prev]);
    setInputs([{ id: 1, longUrl: '', validity: '', customShortcode: '', error: '' }]); // Reset form
    Log('frontend', 'info', 'UrlShortenerPage.submit', `Successfully created ${newResults.length} new short links.`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Shorten Your Links</h1>
        <p className="mt-2 text-lg text-gray-400">Create up to 5 short links at once. Simple and fast.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-800/50 p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700 space-y-6">
        {inputs.map((input, index) => (
          <div key={input.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <div className="md:col-span-5">
              <input 
                type="url" 
                placeholder="https://your-long-url.com" 
                value={input.longUrl}
                onChange={(e) => handleInputChange(input.id, 'longUrl', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>
            <div className="md:col-span-3">
              <input 
                type="text" 
                placeholder="Custom shortcode (optional)" 
                value={input.customShortcode}
                onChange={(e) => handleInputChange(input.id, 'customShortcode', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>
            <div className="md:col-span-2">
              <input 
                type="number" 
                placeholder={`Validity (mins, default ${DEFAULT_VALIDITY_MINS})`} 
                value={input.validity}
                onChange={(e) => handleInputChange(input.id, 'validity', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>
            <div className="md:col-span-2 flex items-center justify-end">
              {inputs.length > 1 && (
                <button type="button" onClick={() => removeUrlField(input.id)} className="text-red-400 hover:text-red-500 font-bold p-2 rounded-full hover:bg-gray-700 transition-colors">
                  Remove
                </button>
              )}
            </div>
             {input.error && <p className="md:col-span-12 text-red-400 text-sm mt-1">{input.error}</p>}
          </div>
        ))}
        
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
          <button 
            type="button" 
            onClick={addUrlField} 
            disabled={inputs.length >= MAX_URLS}
            className="w-full sm:w-auto bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            Add Another URL
          </button>
           <button 
            type="submit" 
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-2 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Shorten
          </button>
        </div>
      </form>
      
      {results.length > 0 && (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-center mb-4">Your New Links!</h2>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 space-y-3">
                {results.map((res) => (
                    <div key={res.shortCode} className="p-3 bg-gray-700/50 rounded-md flex flex-col sm:flex-row justify-between items-center gap-2">
                        <p className="text-gray-300 truncate text-sm sm:text-base">{res.longUrl}</p>
                        <div className="flex items-center gap-3">
                           <a href={`${window.location.origin}/${res.shortCode}`} target="_blank" rel="noopener noreferrer" className="font-mono text-indigo-400 hover:underline">
                              {`${window.location.host}/${res.shortCode}`}
                           </a>
                           <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${res.shortCode}`)} className="bg-indigo-500 text-xs px-2 py-1 rounded hover:bg-indigo-600">Copy</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default UrlShortenerPage;

