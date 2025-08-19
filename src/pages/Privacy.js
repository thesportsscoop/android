import React from "react";

export default function Privacy() {
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
      }}>Privacy</div>
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
      <div className="about-card" style={{marginTop: '2.5rem'}}>
        <h2 style={{fontWeight: 700, color: '#2c5364', marginBottom: '1.2rem'}}>Privacy Policy</h2>
        <p>Last updated: June 2025</p>
        <h3>1. Introduction</h3>
        <p>LightTradeFOREX Academy ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.</p>
        <h3>2. Information We Collect</h3>
        <ul>
          <li><strong>Personal Information:</strong> Name, email address, and other information you provide when registering or contacting us.</li>
          <li><strong>Usage Data:</strong> Information about how you use our site, such as pages visited, time spent, and device/browser details.</li>
        </ul>
        <h3>3. How We Use Information</h3>
        <ul>
          <li>To provide and improve our educational services</li>
          <li>To communicate with you about updates, programs, and support</li>
          <li>To analyze usage and improve user experience</li>
          <li>To comply with legal obligations</li>
        </ul>
        <h3>4. Cookies & Tracking</h3>
        <p>We use cookies and similar technologies to enhance your experience and analyze site usage. You may disable cookies in your browser settings, but some features may not function properly.</p>
        <h3>5. Third-Party Services</h3>
        <p>We may use third-party services (such as analytics or payment processors) that collect, use, and share your information according to their own privacy policies. We are not responsible for the privacy practices of these third parties.</p>
        <h3>6. Data Security</h3>
        <p>We implement reasonable security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
        <h3>7. Children's Privacy</h3>
        <p>Our services are not intended for children under 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us.</p>
        <h3>8. Changes to This Policy</h3>
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</p>
        <h3>9. Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please contact us at lighttradeforex@gmail.com.</p>
      </div>
    </>
  );
}
