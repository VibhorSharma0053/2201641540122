import React, { useState, useEffect } from 'react';
import { urlService } from '../services/url.service';
import { Log } from 'logging-middleware';
import './StatsPage.css'; 

function StatsPage() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    Log('info', 'StatsPage loaded');
    const allLinks = urlService.getAllUrlsAsArray();
    setLinks(allLinks);
  }, []);

  const formatShortLink = (code) => {
    return `${window.location.origin}/${code}`;
  };

  const formatDisplayDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString();
  };

  return (
    <div className="page-container stats-container">
      <h2>Link Statistics</h2>
      {links.length === 0 ? (
        <p className="no-links-message">You haven't created any short links yet.</p>
      ) : (
        <div className="stats-table-wrapper">
          <table className="stats-table">
            <thead>
              <tr>
                <th>Short Link</th>
                <th>Original URL</th>
                <th>Clicks</th>
                <th>Created</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.shortCode}>
                  <td data-label="Short Link">
                    <a href={formatShortLink(link.shortCode)} target="_blank" rel="noopener noreferrer">
                      {formatShortLink(link.shortCode)}
                    </a>
                  </td>
                  <td data-label="Original URL" className="original-url-cell">
                    {link.longUrl}
                  </td>
                  <td data-label="Clicks">{link.clicks}</td>
                  <td data-label="Created">{formatDisplayDate(link.createdAt)}</td>
                  <td data-label="Expires">{formatDisplayDate(link.expiresAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StatsPage;