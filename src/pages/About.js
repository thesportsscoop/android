import React from "react";
import "../App.css";

export default function About() {
  const banner = (
    <div className="about-banner-blur" style={{
      width: '100vw',
      margin: 0,
      left: 0,
      right: 0,
      textAlign: 'center',
      background: 'linear-gradient(120deg, rgba(44,83,100,0.93) 60%, rgba(15,32,39,0.93) 100%)',
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
      }}>About</div>
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
        <h2 style={{
          fontWeight: 700, 
          color: '#2c5364', 
          marginBottom: '1.5rem',
          fontSize: '1.8rem',
          fontFamily: '"Outfit", "Oswald", "Montserrat", Arial, sans-serif',
          lineHeight: 1.3,
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem'
        }}>
          <span>About</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            <span className="brand-blue" style={{
              fontFamily: '"Outfit", "Oswald", "Montserrat", Arial, sans-serif',
              fontWeight: 700,
              letterSpacing: '0.5px',
              lineHeight: 1.2,
              paddingBottom: '2px'
            }}>LightTrade</span>
            <span className="brand-yellow" style={{
              fontFamily: '"Merriweather", serif',
              fontStyle: 'italic',
              fontWeight: 700,
              textShadow: '0 1px 1px rgba(0,0,0,0.1)',
              lineHeight: 1.2,
              paddingBottom: '2px'
            }}>FOREX</span>
          </span>
        </h2>
        <p style={{
          fontSize: '1.05rem',
          color: '#2c3e50',
          marginBottom: '1.5rem',
          lineHeight: 1.65,
          letterSpacing: '0.01em',
          fontFamily: "'Roboto Mono', 'Manrope', 'Inter', 'Segoe UI', Arial, sans-serif"
        }}>
          At LightTradeFOREX, our greatest passion is helping people unlock financial independence and confidence through real, practical trading education. We believe that anyone—regardless of background—can learn to navigate the forex markets with the right guidance, support, and mindset.
        </p>
        <h3 style={{
          color: '#1a365d',
          fontWeight: 600,
          marginTop: '1.8rem',
          marginBottom: '0.8rem',
          fontSize: '1.3rem',
          fontFamily: '"Outfit", "Oswald", "Inter", Arial, sans-serif',
          letterSpacing: '0.01em'
        }}>Our Purpose</h3>
        <p style={{
          marginBottom: '1.2rem',
          color: '#2c3e50',
          fontSize: '1.02rem',
          lineHeight: 1.65,
          letterSpacing: '0.01em',
          fontFamily: "'Roboto Mono', 'Manrope', 'Inter', 'Segoe UI', Arial, sans-serif"
        }}>
          We teach not just to explain charts and strategies, but to demystify finance, empower decision-making, and help you build a skillset for life. Our mission is to bridge the gap between theory and real-world trading, so you can make informed choices and avoid common pitfalls.
        </p>
        <h3 style={{
          color: '#1a365d',
          fontWeight: 600,
          marginTop: '1.8rem',
          marginBottom: '0.8rem',
          fontSize: '1.3rem',
          fontFamily: '"Outfit", "Oswald", "Inter", Arial, sans-serif',
          letterSpacing: '0.01em'
        }}>What Makes Us Different?</h3>
        <ul style={{
          marginBottom: '1.5rem',
          color: '#2c3e50',
          fontSize: '1.02rem',
          lineHeight: 1.7,
          paddingLeft: '1.5rem',
          fontFamily: "'Roboto Mono', 'Manrope', 'Inter', 'Segoe UI', Arial, sans-serif"
        }}>
          <li><strong>Real-World Experience:</strong> Our instructors are active traders who share proven strategies and honest lessons from the market.</li>
          <li><strong>Supportive Community:</strong> We foster a culture of encouragement, mentorship, and collaboration—no question is too small.</li>
          <li><strong>Step-by-Step Learning:</strong> Our Beginner, Intermediate, and Advanced programs are structured to build confidence and mastery at your pace.</li>
          <li><strong>Modern, Accessible Tools:</strong> We use up-to-date platforms and resources to ensure you’re ready for today’s trading environment.</li>
          <li><strong>Integrity & Transparency:</strong> We teach with honesty—no hype, no empty promises, just practical skills and real support.</li>
        </ul>
        <h3 style={{
          color: '#1a365d',
          fontWeight: 600,
          marginTop: '1.8rem',
          marginBottom: '0.8rem',
          fontSize: '1.3rem',
          fontFamily: '"Outfit", "Oswald", "Inter", Arial, sans-serif',
          letterSpacing: '0.01em'
        }}>Our Commitment</h3>
        <p>
          Whether you’re just starting or looking to refine your edge, LightTrade is here to guide you with integrity, expertise, and a genuine desire to see you succeed. Let’s build your trading journey—together.
        </p>
      </div>
    </>
  );
}
