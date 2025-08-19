import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function UserMenu({ user, plan, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const toggle = () => setOpen(o => !o);

  useEffect(() => {
    if (!open) return undefined;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const initials = user?.displayName
    ? user.displayName.trim().split(/\s+/).slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?';

  // Determine accessible programs based on subscription plan
  const getAccessiblePrograms = () => {
    if (plan === 'admin') {
      return ['Beginner', 'Intermediate', 'Advanced', 'Admin Panel'];
    } else if (plan === 'premium') {
      return ['Beginner', 'Intermediate', 'Advanced'];
    } else if (plan === 'legacyFree' || !plan) {
      return ['Beginner'];
    }
    return ['Beginner']; // Default fallback
  };

  const accessiblePrograms = getAccessiblePrograms();

  return (
    <div className="user-menu" ref={menuRef}>
      <button type="button" className="user-avatar" onClick={toggle} aria-label="User menu">
        {initials}
      </button>
      {open && (
        <div className="user-popout">
          <div className="user-email">{user.email}</div>
          <div className="user-plan-section">
            <div className="user-plan-title">Access Level: {plan || 'Free'}</div>
            <div className="accessible-programs">
              <div className="programs-title">Available Programs:</div>
              <ul className="programs-list">
                {accessiblePrograms.map((program, index) => (
                  <li key={index} className="program-item">{program}</li>
                ))}
              </ul>
            </div>
          </div>
          <Link to="/subscription" className="manage-subscription-link">Manage Subscription</Link>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}
