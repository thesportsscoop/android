import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CenteredCardPage from "../components/CenteredCardPage";

export default function ForgotPassword() {
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
        fontSize: '1.32rem',
        color: '#f3f6fa',
        fontWeight: 600,
        letterSpacing: '0.01em',
        marginBottom: '0.3rem',
        textShadow: '0 1.5px 8px #2c536466'
      }}>Forgot Password</div>
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
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { showToast } = useAuth();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("A password reset link has been sent to your email.");
      showToast("Password reset email sent!", "success");
    } catch (err) {
      let msg = err.message;
      if (msg.includes("user-not-found")) msg = "No user found with this email.";
      else if (msg.includes("invalid-email")) msg = "Please enter a valid email.";
      setError(msg);
      showToast(msg, "error");
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
                <div className="program-card-title">Forgot Password</div>
                <div className="program-card-desc">Enter your email to reset your password</div>
                <form className="auth-card-form" onSubmit={handleReset}>
                  <div className="form-group">
                    <label htmlFor="forgot-email">Email</label>
                    <input
                      id="forgot-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit">Send Reset Link</button>
                  {message && <p style={{color: 'green', marginTop: 12}}>{message}</p>}
                  {error && <p style={{color: 'red', marginTop: 12}}>{error}</p>}
                  <div style={{marginTop: 16, textAlign: 'center', width: '100%'}}>
                    <Link to="/login">Back to Login</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </CenteredCardPage>
    </>
  );
}
