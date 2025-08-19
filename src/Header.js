import React, { useState } from "react";
import "./header-logo-padding.css";
import { Link } from "react-router-dom";
import './App.css';
import UserMenu from './components/UserMenu';

export default function Header({ user, plan, isAdmin, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = React.useRef();
  const hamburgerRef = React.useRef();

  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [mobileMenuOpen]);

  React.useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleClick(e) {
      if (hamburgerRef.current && hamburgerRef.current.contains(e.target)) {
        return;
      }
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setMobileMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [mobileMenuOpen]);

  function handleHamburgerClick(e) {
    e.stopPropagation();
    setMobileMenuOpen(open => !open);
  }

  function handleOverlayClick(e) {
    e.stopPropagation();
    setMobileMenuOpen(false);
  }

  function handleNavClick(e) {
    if (e.target.tagName === "A" || e.target.classList.contains("logout-btn")) {
      setMobileMenuOpen(false);
    }
  }

  return (
    <header className="main-header">
      <div className="header-logo">
        <Link to="/" className="brand" tabIndex={0} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
  <span style={{ fontFamily: 'Outfit, Oswald, Montserrat, Arial, sans-serif', fontWeight: 700 }}>
    <span className="brand-blueshadow">
      <span className="brand-blue">LightTrade</span><span className="brand-yellow" style={{ fontFamily: 'Merriweather, serif', fontStyle: 'italic', fontWeight: 700 }}>FOREX</span>
    </span>
  </span>
</Link>
      </div>
      
      <button
        ref={hamburgerRef}
        className={`hamburger-menu${mobileMenuOpen ? ' open' : ''}`}
        aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-nav"
        onClick={handleHamburgerClick}
        tabIndex={0}
        style={{ zIndex: 1200, position: 'relative' }}
      >
        <span className={`hamburger-bar top${mobileMenuOpen ? ' open' : ''}`}></span>
        <span className={`hamburger-bar middle${mobileMenuOpen ? ' open' : ''}`}></span>
        <span className={`hamburger-bar bottom${mobileMenuOpen ? ' open' : ''}`}></span>
      </button>
      {mobileMenuOpen && (
        <div
          className="nav-overlay"
          aria-hidden="true"
          onClick={handleOverlayClick}
        ></div>
      )}
      <nav
        className={`header-nav${mobileMenuOpen ? ' open' : ''}`}
        id="mobile-nav"
        ref={navRef}
        onClick={handleNavClick}
        role="navigation"
        aria-label="Main navigation"
      >
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/program">Program</Link>
        {user && plan === 'legacyFree' && !isAdmin && (
          <Link to="/join-waitlist" style={{ color: '#0aa83f', fontWeight: 600 }}>Join Waitlist</Link>
        )}
        <Link to="/contact">Contact</Link>
        {isAdmin && <Link to="/admin">Admin</Link>}
        {user && <Link to="/subscription">Subscription</Link>}
        {user && (
          <button onClick={onLogout} className="logout-btn mobile-logout">
            Logout
          </button>
        )}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Sign Up</Link>}
        {user && window.innerWidth > 800 && (
           <span className="header-user-avatar">
             <UserMenu user={user} plan={plan} onLogout={onLogout} />
           </span>
         )}
      </nav>
    </header>
  );
}
