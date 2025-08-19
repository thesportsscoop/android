import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CenteredCardPage from '../components/CenteredCardPage';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');
  const { verifyEmail, resendVerificationEmail, showToast } = useAuth();
  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    const verify = async () => {
      if (!oobCode) {
        setStatus('error');
        setError('Invalid verification link');
        return;
      }

      try {
        await verifyEmail(oobCode);
        setStatus('success');
        showToast('Email verified successfully!', 'success');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setError(err.message || 'Failed to verify email. The link may have expired.');
      }
    };

    verify();
  }, [oobCode, verifyEmail, navigate, showToast]);

  const handleResend = async () => {
    try {
      await resendVerificationEmail();
      showToast('Verification email resent. Please check your inbox.', 'success');
    } catch (err) {
      console.error('Resend error:', err);
      showToast(err.message || 'Failed to resend verification email.', 'error');
    }
  };

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
      }}>EMAIL VERIFICATION</div>
      <div style={{
        width: 54,
        height: 4,
        background: 'linear-gradient(90deg,#FFD600 0%,#2c5364 100%)',
        borderRadius: 4,
        margin: '0.4rem auto 0.7rem auto'
      }} />
    </div>
  );

  return (
    <>
      {banner}
      <CenteredCardPage>
        <div className="home-card">
          <div className="program-cards">
            <div className="program-card">
              <div className="program-card-content" style={{ textAlign: 'center' }}>
                {status === 'verifying' && (
                  <div>
                    <h3>Verifying your email...</h3>
                    <p>Please wait while we verify your email address.</p>
                  </div>
                )}

                {status === 'success' && (
                  <div>
                    <h3>Email Verified Successfully!</h3>
                    <p>Your email has been verified. Redirecting you to login...</p>
                    <p>If you're not redirected, <a href="/login" style={{ color: '#2c5364', fontWeight: 'bold' }}>click here</a>.</p>
                  </div>
                )}

                {status === 'error' && (
                  <div>
                    <h3>Verification Failed</h3>
                    <p style={{ color: '#e53e3e', marginBottom: '1.5rem' }}>{error}</p>
                    <button
                      onClick={handleResend}
                      style={{
                        backgroundColor: '#2c5364',
                        color: 'white',
                        border: 'none',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginTop: '1rem',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#1e3a4a'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#2c5364'}
                    >
                      Resend Verification Email
                    </button>
                    <p style={{ marginTop: '1rem' }}>
                      <a href="/login" style={{ color: '#2c5364', fontWeight: 'bold' }}>Back to Login</a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CenteredCardPage>
    </>
  );
}
