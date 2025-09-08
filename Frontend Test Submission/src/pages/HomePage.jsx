import React, { useState, useEffect } from 'react';
import { urlService } from '../services/url.service';
import { Log } from 'logging-middleware'; 
import './HomePage.css'; 

function HomePage() {
  const [longUrl, setLongUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [expiry, setExpiry] = useState('');
  
  const [error, setError] = useState('');
  const [successLink, setSuccessLink] = useState(null);
  useEffect(() => {
    Log('info', 'HomePage loaded');
  }, []);
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessLink(null);

    await Log('info', 'Submit button clicked');
    if (!longUrl) {
      await Log('warn', 'Form submission failed: No URL provided.');
      setError('Please enter a URL to shorten.');
      return;
    }
    if (!isValidUrl(longUrl)) {
      await Log('warn', 'Form submission failed: Invalid URL.', { url: longUrl });
      setError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }
    try {
      const newLink = urlService.createShortUrl(longUrl, customCode, expiry);
      const fullShortLink = `${window.location.origin}/${newLink.shortCode}`;
      
      setSuccessLink(fullShortLink);
      await Log('info', 'Successfully created new short link', { code: newLink.shortCode, target: newLink.longUrl });
      setLongUrl('');
      setCustomCode('');
      setExpiry('');

    } catch (err) {
      await Log('error', 'Failed to create link', { error: err.message });
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h2>Shorten a new URL</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="longUrl">Your Long URL</label>
            <input
              type="url"
              id="longUrl"
              placeholder="https://your-very-long-link-goes-here.com/..."
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
            />
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="customCode">Optional: Custom Shortcode</label>
              <input
                type="text"
                id="customCode"
                placeholder="e.g., mylink"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="expiry">Optional: Expiry (in minutes)</label>
              <input
                type="number"
                id="expiry"
                placeholder="e.g., 60"
                min="1"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">Shorten!</button>
        </form>

        {error && (
          <div className="message-box error-box">
            <strong>Error:</strong> {error}
          </div>
        )}

        {successLink && (
          <div className="message-box success-box">
            <strong>Success! Your link is:</strong>
            <a href={successLink} target="_blank" rel="noopener noreferrer">{successLink}</a>
          </div>
        )}

      </div>
    </div>
  );
}

export default HomePage;