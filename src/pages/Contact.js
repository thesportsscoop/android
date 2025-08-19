import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import CenteredCardPage from "../components/CenteredCardPage";

export default function Contact() {
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
      }}>Contact</div>
      <div style={{
        width: 54,
        height: 4,
        background: 'linear-gradient(90deg,#FFD600 0%,#2c5364 100%)',
        borderRadius: 4,
        margin: '0.4rem auto 0.7rem auto'
      }} />
    </div>
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { showToast } = useAuth() || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    try {
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        message,
        created: Timestamp.now(),
      });
      fetch('https://script.google.com/macros/s/AKfycbyrwgXu9z-CFYhrp_0yNzBzgSDKDNvTzZm7MPKdp7d6_lGKnKhughfbpbl-C2am7htd1w/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
        mode: 'no-cors'
      });
      setTimeout(() => {
        setSuccess("Message sent! We'll get back to you soon.");
        setName(""); setEmail(""); setMessage("");
        if (showToast) showToast("Message sent!", "success");
        setLoading(false);
        setTimeout(() => setSuccess(""), 4000); 
      }, 3000);
      return;
    } catch (err) {
      setError("Failed to send. Please try again later.");
      if (showToast) showToast("Failed to send message.", "error");
    }
    setLoading(false);
  };

  return (
    <>
      {banner}
      <CenteredCardPage>
        <div className="home-card">
          <div className="program-cards">
            <div className="program-card">
              <div className="program-card-content">
                <div className="program-card-desc" style={{fontSize: '1.1rem', marginBottom: '1.5rem'}}>We'd love to hear from you! Fill out the form below and we'll get back to you soon.</div>
                <form className="auth-card-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="contact-name">Your Name</label>
                    <input
                      id="contact-name"
                      aria-label="Your Name"
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-email">Your Email</label>
                    <input
                      id="contact-email"
                      aria-label="Your Email"
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-message">Your Message</label>
                    <textarea
                      id="contact-message"
                      aria-label="Your Message"
                      placeholder="Your Message"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={5}
                      style={{resize: 'vertical'}}
                      required
                    />
                  </div>
                  {error && <p style={{color: 'red'}}>{error}</p>}
                  <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</button>
                  {success && <p style={{color: 'green'}}>{success}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </CenteredCardPage>
    </>
  );
}
