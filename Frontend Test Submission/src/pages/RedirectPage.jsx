import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlService } from '../services/url.service';
import { Log } from 'logging-middleware'; 
import './RedirectPage.css'; 

function RedirectPage() {
  const { shortCode } = useParams(); 
  const navigate = useNavigate(); 
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const performRedirect = async () => {
      if (!shortCode) return;

      await Log('info', 'Redirect request received', { code: shortCode });
      const urlEntry = urlService.getUrlByCode(shortCode);
      if (!urlEntry) {
        await Log('error', 'Redirect failed: Short code not found', { code: shortCode });
        setErrorMessage('This short link was not found.');
        return;
      }
      if (urlEntry.expiresAt && new Date(urlEntry.expiresAt) < new Date()) {
        await Log('warn', 'Redirect failed: Link expired', { 
          code: shortCode, 
          expiredAt: urlEntry.expiresAt 
        });
        setErrorMessage('This short link has expired.');
        return;
      }
      try {
        urlService.incrementClickCount(shortCode);
        await Log('info', 'Redirecting user', { code: shortCode, target: urlEntry.longUrl });
        window.location.replace(urlEntry.longUrl);

      } catch (err) {
        await Log('critical', 'Redirect logic failed unexpectedly', { error: err.message });
        setErrorMessage('An unexpected error occurred during redirection.');
      }
    };

    performRedirect();

  }, [shortCode, navigate]); 
  return (
    <div className="redirect-page-container">
      {errorMessage ? (
        <div className="redirect-message error">
          <h2>Redirect Failed</h2>
          <p>{errorMessage}</p>
          <button onClick={() => navigate('/')}>Back to Homepage</button>
        </div>
      ) : (
        <div className="redirect-message">
          <h2>Redirecting...</h2>
          <p>Please wait while we send you to your destination.</p>
        </div>
      )}
    </div>
  );
}

export default RedirectPage;