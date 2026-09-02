import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoDark from '../../assets/logos/logo-dark.png';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [homeSection, setHomeSection] = useState('hero');
  const menuRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== '/home') {
      setHomeSection('hero');
      return;
    }
    const hotelsSection = document.querySelector('.home-hotels-section');
    const heroSection = document.querySelector('.home-hero');
    if (!hotelsSection) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === hotelsSection) setHomeSection('hotels');
            else if (entry.target === heroSection) setHomeSection('hero');
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    if (hotelsSection) observer.observe(hotelsSection);
    if (heroSection) observer.observe(heroSection);
    return () => observer.disconnect();
  }, [pathname]);

  const isHomeActive = pathname === '/home' && homeSection === 'hero';
  const isHotelsActive = pathname === '/home' && homeSection === 'hotels';

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
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/home" className="navbar-logo" onClick={() => setMobileOpen(false)}>
          <img src={logoDark} alt="StayVora" className="navbar-logo-img" />
        </Link>
        <div className="navbar-links">
          <Link
            to="/home"
            onClick={(e) => {
              if (pathname === '/home') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setHomeSection('hero');
              }
            }}
            className={`navbar-link ${isHomeActive ? 'active' : ''}`}
          >Home</Link>
          <Link
            to="/home"
            onClick={(e) => {
              if (pathname === '/home') {
                e.preventDefault();
                const el = document.querySelector('.home-hotels-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                  setHomeSection('hotels');
                }
              }
            }}
            className={`navbar-link ${isHotelsActive ? 'active' : ''}`}
          >Hotels</Link>
          <NavLink to="/about" className="navbar-link">About Us</NavLink>
          <NavLink to="/contact" className="navbar-link">Contact Us</NavLink>
          <NavLink to="/hotel-owner-portal" className="navbar-link navbar-link-purple">Hotel Owner Portal</NavLink>
        </div>
        <div className="navbar-right" ref={menuRef}>
          <button
            className={`navbar-menu-toggle ${mobileOpen ? 'navbar-menu-toggle-open' : ''}`}
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>
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

      <div className={`navbar-mobile-menu ${mobileOpen ? 'navbar-mobile-menu-open' : ''}`}>
        <Link
          to="/home"
          onClick={(e) => {
            setMobileOpen(false);
            if (pathname === '/home') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setHomeSection('hero');
            }
          }}
          className={`navbar-mobile-link ${isHomeActive ? 'active' : ''}`}
        >Home</Link>
        <Link
          to="/home"
          onClick={(e) => {
            setMobileOpen(false);
            if (pathname === '/home') {
              e.preventDefault();
              const el = document.querySelector('.home-hotels-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                setHomeSection('hotels');
              }
            }
          }}
          className={`navbar-mobile-link ${isHotelsActive ? 'active' : ''}`}
        >Hotels</Link>
        <NavLink to="/about" className="navbar-mobile-link" onClick={() => setMobileOpen(false)}>About Us</NavLink>
        <NavLink to="/contact" className="navbar-mobile-link" onClick={() => setMobileOpen(false)}>Contact Us</NavLink>
        <NavLink to="/hotel-owner-portal" className="navbar-mobile-link" onClick={() => setMobileOpen(false)}>Hotel Owner Portal</NavLink>
        <div className="navbar-mobile-footer">
          <Link to="/my-bookings" className="navbar-mobile-link" onClick={() => setMobileOpen(false)}>My Bookings</Link>
          <button className="navbar-mobile-link navbar-mobile-logout" onClick={() => { setMobileOpen(false); logout(); }}>Logout</button>
        </div>
      </div>
    </nav>
  );
}