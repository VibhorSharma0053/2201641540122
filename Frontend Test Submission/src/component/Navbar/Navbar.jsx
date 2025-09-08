import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">BrowserURL Shortener</div>
        <ul className="navbar-links">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Shorten
            </NavLink>
          </li>
          <li>
            <NavLink to="/stats" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Statistics
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;