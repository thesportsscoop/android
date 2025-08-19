import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CenteredCardPage from "../components/CenteredCardPage";

export default function Register() {
  const banner = (
    <div style={{
      width: '100vw',
      margin: 0,
      left: 0,
      right: 0,
      textAlign: 'center',
      background: 'linear-gradient(120deg, rgba(44,83,100,0.93) 60%, rgba(15,32,39,0.93) 100%)',
      backdropFilter: 'blur(8px) saturate(1.15)',
      WebkitBackdropFilter: 'blur(8px) saturate(1.15)',
      borderRadius: 0,
      boxShadow: '0 2px 18px 0 #00FFD044, 0 1.5px 8px 0 #00A3FF22',
      padding: '0.9rem 1.2rem 0.8rem 1.2rem',
      border: 'none',
      position: 'relative',
      zIndex: 2,
      marginTop: 0
    }}>
      <div style={{
        fontSize: '1.5rem',
        color: '#f3f6fa',
        fontWeight: 700,
        letterSpacing: '0.01em',
        marginBottom: '0.3rem',
        textShadow: '0 1.5px 8px #2c536466'
      }}>Register</div>
      <div style={{
        width: 54,
        height: 4,
        background: 'linear-gradient(90deg,#FFD600 0%,#2c5364 100%)',
        borderRadius: 4,
        margin: '0.4rem auto 0.7rem auto'
      }} />
    </div>
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, showToast } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await signup(email, password, confirmPassword);
      showToast("Registration successful! Please check your email to verify your account.", "success");
      navigate("/login", { state: { from: location.state?.from } });
    } catch (err) {
      const errorMessage = err.message || "Failed to create account. Please try again";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {banner}
      <CenteredCardPage>
      <div className="home-card">
        <div className="program-cards">
          <div className="program-card">
            <div className="program-card-content">
              <div className="program-card-desc" style={{
                fontSize: '1.1rem',
                marginBottom: '1.5rem',
                color: '#2c3e50',
                lineHeight: '1.65',
                fontFamily: "'Roboto Mono', 'Manrope', 'Inter', 'Segoe UI', Arial, sans-serif"
              }}>
                Create your{' '}
                <span className="brand-blueshadow" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <span className="brand-blue" style={{
                    fontFamily: '"Outfit", "Oswald", "Montserrat", Arial, sans-serif',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    lineHeight: 1
                  }}>LightTrade</span>
                  <span className="brand-yellow" style={{
                    fontFamily: '"Merriweather", serif',
                    fontStyle: 'italic',
                    fontWeight: 700,
                    marginLeft: '2px',
                    textShadow: '0 1px 1px rgba(0,0,0,0.1)',
                    lineHeight: 1
                  }}>FOREX</span>
                </span>{' '}
                account
              </div>
              <form className="auth-card-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="register-name" style={{
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    display: 'block',
                    color: '#2c3e50'
                  }}>Full Name</label>
                  <input 
                    id="register-name" 
                    aria-label="Full Name" 
                    type="text" 
                    placeholder="Enter your full name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required
                    style={{
                      fontSize: '1rem',
                      padding: '0.9rem 1rem',
                      width: '100%',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                  <label htmlFor="register-email" style={{
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    display: 'block',
                    color: '#2c3e50'
                  }}>Email</label>
                  <input 
                    id="register-email" 
                    aria-label="Email" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required
                    style={{
                      fontSize: '1rem',
                      padding: '0.9rem 1rem',
                      width: '100%',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                  <label htmlFor="register-password" style={{
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    display: 'block',
                    color: '#2c3e50'
                  }}>Password</label>
                  <input 
                    id="register-password" 
                    aria-label="Password" 
                    type="password" 
                    placeholder="Create a password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    minLength={8}
                    autoComplete="new-password"
                    style={{
                      fontSize: '1rem',
                      padding: '0.9rem 1rem',
                      width: '100%',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="register-confirm-password" style={{
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    display: 'block',
                    color: '#2c3e50'
                  }}>Confirm Password</label>
                  <input 
                    id="register-confirm-password" 
                    aria-label="Confirm Password" 
                    type="password" 
                    placeholder="Confirm your password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    required 
                    minLength={8}
                    autoComplete="new-password"
                    style={{
                      fontSize: '1rem',
                      padding: '0.9rem 1rem',
                      width: '100%',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.2rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#2c5364',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    marginTop: '0.5rem',
                    ':hover': {
                      backgroundColor: '#1e3a4a'
                    },
                    ':disabled': {
                      backgroundColor: '#94a3b8',
                      cursor: 'not-allowed'
                    }
                  }}
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
                {error && <p style={{
                  color: '#e53e3e',
                  fontSize: '0.9rem',
                  marginTop: '1rem',
                  textAlign: 'center'
                }}>{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </CenteredCardPage>
    </>
  );
}
