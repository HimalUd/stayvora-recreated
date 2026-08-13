import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/home" className="navbar-logo">StayVora</Link>
        <div className="navbar-links">
          <NavLink to="/home" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>Home</NavLink>
          <NavLink to="/home" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>Hotels</NavLink>
          <NavLink to="/about" className="navbar-link">About Us</NavLink>
          <NavLink to="/contact" className="navbar-link">Contact Us</NavLink>
          <NavLink to="/hotel-owner-portal" className="navbar-link">Hotel Owner Portal</NavLink>
        </div>
        <div className="navbar-right" ref={menuRef}>
          <div className="navbar-profile-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="navbar-username">{user?.name || 'User'}</span>
            <div className="navbar-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
          </div>
          {menuOpen && (
            <div className="navbar-dropdown">
              <div className="navbar-dropdown-header">
                <div className="navbar-dropdown-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                <div>
                  <div className="navbar-dropdown-name">{user?.name || 'User'}</div>
                  <div className="navbar-dropdown-email">{user?.email || ''}</div>
                </div>
              </div>
              <div className="navbar-dropdown-divider" />
              <Link to="/my-bookings" className="navbar-dropdown-item" onClick={() => setMenuOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 14V5.5L8 1.5L14 5.5V14H10V9H6V14H2Z" stroke="currentColor" strokeWidth="1.33" strokeLinejoin="round"/>
                </svg>
                My Bookings
              </Link>
              <div className="navbar-dropdown-divider" />
              <button className="navbar-dropdown-item navbar-dropdown-logout" onClick={() => { setMenuOpen(false); logout(); }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 14H2.67C2.3 14 2 13.7 2 13.33V2.67C2 2.3 2.3 2 2.67 2H6" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.67 11.33L14 8L10.67 4.67" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 8H6" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round"/>
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
