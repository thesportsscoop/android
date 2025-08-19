import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CenteredCardPage from "../components/CenteredCardPage";

import { useEffect } from "react";
import { getAuth, signInWithCustomToken } from "firebase/auth";

export default function Login() {
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
        letterSpacing: '0.02em',
        marginBottom: '0.3rem',
        textShadow: '0 1.5px 8px #2c536466',
        fontFamily: '"Oswald", sans-serif'
      }}>LOGIN</div>
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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signInWithGoogle, showToast, getFriendlyErrorMessage } = useAuth();

  // --- MQL5 OAuth Redirect Handler ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mql5Code = params.get("code");
    if (mql5Code) {
      // Exchange code for Firebase token
      fetch("/api/mql5-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: mql5Code }),
      })
        .then(res => res.json())
        .then(async data => {
          if (data.firebaseToken) {
            await signInWithCustomToken(getAuth(), data.firebaseToken);
            navigate("/", { replace: true });
          } else {
            setError("MQL5 login failed: " + (data.error || "Unknown error"));
          }
        })
        .catch(err => {
          setError("MQL5 login error: " + err.message);
        });
    }
  }, [location, navigate]);
  // --- End MQL5 OAuth Handler ---


  const handleResendVerification = async () => {
    try {
      setIsLoading(true);
      
      await login(email, password);
      
      showToast("Verification email sent. Please check your inbox.", "success");
    } catch (err) {
      console.error('Resend verification error:', err);
      const errorMessage = getFriendlyErrorMessage(err);
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      const redirectTo = location.state?.from?.pathname || "/";
      showToast("Login successful!", "success");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.code === 'auth/email-not-verified' || err.message.includes('verify your email')) {
        const userEmail = err.email || email;
        setError(
          <div style={{ lineHeight: '1.5' }}>
            <div>Please verify your email before signing in. Check your inbox for the verification link.</div>
            <div style={{ marginTop: '0.75rem' }}>
              <button 
                onClick={() => handleResendVerification(userEmail)}
                disabled={isLoading}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  color: '#2c5364',
                  cursor: 'pointer',
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                  ':hover': {
                    backgroundColor: '#f1f5f9',
                    borderColor: '#cbd5e1'
                  },
                  ':disabled': {
                    opacity: 0.7,
                    cursor: 'not-allowed'
                  }
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M3 8L10.89 13.26C11.2186 13.4793 11.5993 13.5929 12 13.5929C12.4007 13.5929 12.7814 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Resend verification email
              </button>
            </div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.75rem', color: '#475569' }}>
              Didn't receive the email? Check your spam folder or try again.
            </div>
          </div>
        );
      } else {
        const errorMessage = getFriendlyErrorMessage(err);
        setError(errorMessage);
        showToast(errorMessage, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
      showToast("Login successful!", "success");
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      const errorMessage = err.message || "Failed to sign in with Google";
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
                  fontSize: '1.02rem',
                  marginBottom: '1.5rem',
                  lineHeight: '1.65',
                  color: '#2c3e50',
                  letterSpacing: '0.01em',
                  fontFamily: "'Roboto Mono', 'Manrope', 'Inter', 'Segoe UI', Arial, sans-serif"
                }}>
                  Sign in to your <span className="brand-blueshadow" style={{ display: 'inline-flex' }}>
                    <span className="brand-blue" style={{
                      fontFamily: '"Outfit", "Oswald", "Montserrat", Arial, sans-serif',
                      fontWeight: 700,
                      fontSize: '1.25rem',
                      letterSpacing: '0.5px'
                    }}>LightTrade</span>
                    <span className="brand-yellow" style={{
                      fontFamily: '"Merriweather", serif',
                      fontStyle: 'italic',
                      fontWeight: 700,
                      marginLeft: '2px',
                      fontSize: '1.25rem',
                      textShadow: '0 1px 1px rgba(0,0,0,0.1)'
                    }}>FOREX</span>
                  </span> account
                </div>
                <form className="auth-card-form" onSubmit={handleLogin}>
                  <div className="form-group">
                    <label htmlFor="login-email" style={{
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      marginBottom: '0.5rem',
                      display: 'block',
                      color: '#2c3e50'
                    }}>Email</label>
                    <input 
                      id="login-email" 
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
                  <div className="form-group">
                    <label htmlFor="login-password" style={{
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      marginBottom: '0.5rem',
                      display: 'block',
                      color: '#2c3e50'
                    }}>Password</label>
                    <input 
                      id="login-password" 
                      aria-label="Password" 
                      type="password" 
                      placeholder="Enter your password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
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
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleGoogle} 
                    disabled={isLoading}
                    style={{
                      marginTop: '0.5rem',
                      width: '100%',
                      padding: '1.05rem 1.2rem',
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '1.08rem',
                      fontWeight: 600,
                      letterSpacing: '0.01em',
                      color: '#fff',
                      background: 'linear-gradient(120deg, #5bc6ff 0%, #6f7bfd 70%, #ffe066 100%)',
                      boxShadow: '0 2px 10px 0 #6f7bfd22, 0 1.5px 6px 0 #ffe06622 inset',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.22s',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      margin: '0.5rem auto 0 auto',
                      maxWidth: '320px'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(120deg, #6f7bfd 0%, #5bc6ff 70%, #ffe066 100%)';
                      e.currentTarget.style.boxShadow = '0 0 0 2px #6f7bfd22, 0 2px 10px 0 #6f7bfd33, 0 1.5px 6px 0 #ffe06633 inset';
                      e.currentTarget.style.transform = 'translateY(-1px) scale(1.01)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(120deg, #5bc6ff 0%, #6f7bfd 70%, #ffe066 100%)';
                      e.currentTarget.style.boxShadow = '0 2px 10px 0 #6f7bfd22, 0 1.5px 6px 0 #ffe06622 inset';
                      e.currentTarget.style.transform = 'none';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(120deg, #5bc6ff 0%, #ffe066 80%, #6f7bfd 100%)';
                      e.currentTarget.style.boxShadow = '0 0 0 2px #ffe06622, 0 2px 10px 0 #5bc6ff33, 0 1.5px 6px 0 #ffe06644 inset';
                      e.currentTarget.style.transform = 'scale(0.99)';
                    }}
                  >
                    <img 
                      src="https://www.google.com/favicon.ico" 
                      alt="Google" 
                      style={{ 
                        width: '18px', 
                        height: '18px',
                        borderRadius: '2px',
                        backgroundColor: 'white',
                        padding: '2px'
                      }} 
                    />
                    {isLoading ? 'Signing in...' : 'Sign in with Google'}
                  </button>
                  {/* MQL5 Login Button */}
                  <a
                    href={`https://www.mql5.com/en/oauth/login?client_id=j007yl&redirect_uri=${encodeURIComponent(window.location.origin + '/login')}&response_type=code`}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(120deg, #f5c542 0%, #2c5364 100%)',
                      color: '#222',
                      fontWeight: 600,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.65rem 0',
                      fontSize: '1.08rem',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      margin: '0.5rem auto 0 auto',
                      maxWidth: '320px',
                      textDecoration: 'none',
                      boxShadow: '0 2px 10px 0 #f5c54233, 0 1.5px 6px 0 #2c536422 inset'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = 'linear-gradient(120deg, #ffe066 0%, #f5c542 70%, #2c5364 100%)';
                      e.currentTarget.style.boxShadow = '0 0 0 2px #ffe06622, 0 2px 10px 0 #f5c54233, 0 1.5px 6px 0 #2c536444 inset';
                      e.currentTarget.style.transform = 'translateY(-1px) scale(1.01)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = 'linear-gradient(120deg, #f5c542 0%, #2c5364 100%)';
                      e.currentTarget.style.boxShadow = '0 2px 10px 0 #f5c54233, 0 1.5px 6px 0 #2c536422 inset';
                      e.currentTarget.style.transform = 'none';
                    }}
                    onMouseDown={e => {
                      e.currentTarget.style.background = 'linear-gradient(120deg, #ffe066 0%, #2c5364 80%, #f5c542 100%)';
                      e.currentTarget.style.boxShadow = '0 0 0 2px #2c536422, 0 2px 10px 0 #ffe06633, 0 1.5px 6px 0 #2c536444 inset';
                      e.currentTarget.style.transform = 'scale(0.99)';
                    }}
                  >
                    <img 
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAe1BMVEVHcEz/////////////////////////////89j71Hz+5a//wAD/zU//wg34wSvR2u6NptixwePCz+oAUbkcXryDn9X2xUVagsomYr90lNFqjc/s8fnwtgoPWrv/ww74vQ1AcsS2uLzZw5pPaJf/xgCejnhXbpp0e46qoZBac37jAAAACHRSTlMAOqHW8f+5O2tPWfUAAAEBSURBVHgBrJIFcsNQDAXNJLMMP8xw/xNWkklNmwzlDe6sQWRRbMf1/F/xXMe2JIH/b4IPTmyoMIrjRGFoOcoBRVnHchdIIcsyWNi1VJ35i/QsX1KUle/HQC4fgTPIGhtsfb8DgEigVLJvjEEuKZpAyRVxw5JrXTMouWkQa/7ptov8zY5gkpJi4ycA++12GwtoSQGqleThABGRlsXxRG6U56NuZbPG5nKd5PWGu2MxSWrMNHcld9RLOcqK4FU2q29IyiIfzSS9UWIOk2wIm9b3PVk2Mj2ug4QbIw/QlTMpsGkafAIAj09gLWdiyxTavudtp10cjUD5GSO+pIk/UePNDgBi3ySKU7wkwgAAAABJRU5ErkJggg==" 
                      alt="MQL5" 
                      style={{ width: '18px', height: '18px', borderRadius: '2px', backgroundColor: 'white', padding: '2px' }} 
                    />
                    Sign in with MQL5
                  </a>
                  {error && (
                  <div style={{
                    color: '#b91c1c',
                    fontSize: '0.9rem',
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: '#fef2f2',
                    borderRadius: '0.5rem',
                    border: '1px solid #fecaca',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                  }}>
                    {error}
                  </div>
                )}
                </form>
                <div style={{marginTop: 18, textAlign: 'center', width: '100%'}}>
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CenteredCardPage>
    </>
  );
}
