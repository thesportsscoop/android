import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CenteredCardPage from "../components/CenteredCardPage";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    
    if (currentUser && redirect) {
      navigate(redirect, { replace: true });
    }
  }, [currentUser, navigate, location.search]);

  const handleProgramSelect = (program) => {
    if (currentUser) {
      navigate(`/program?program=${encodeURIComponent(program)}`);
    } else {
      sessionStorage.setItem('selectedProgram', program);
      navigate(`/login?redirect=/program?program=${encodeURIComponent(program)}`);
    }
  };
  return (
    <CenteredCardPage>
      <div className="home-video-banner" style={{
  position: 'relative',
  width: '100vw',
  left: 0,
  right: 0,
  transform: 'none',
  overflow: 'hidden',
  marginBottom: 0,
  boxShadow: '0 8px 32px rgba(44,83,100,0.13)',
  borderRadius: 0
}}>
  <video
    src="/videos/LTSForexForBeginners_v3.mp4"
    autoPlay
    loop
    muted
    playsInline
    style={{
      width: '100vw',
      minHeight: 320,
      maxHeight: 540,
      display: 'block',
      objectFit: 'cover',
      borderRadius: 0
    }}
    aria-label="LightTradeFOREX Academy Introduction Video"
    title="LightTradeFOREX Academy Introduction Video"
  />
  <div role="banner" aria-label="LightTradeForex brand floating over hero video" style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(28,38,64,0.56)',
    padding: '1.1rem 2.2rem',
    borderRadius: 14,
    boxShadow: '0 2px 12px rgba(44,83,100,0.19)',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  }}>
    <img src="/favicon.ico" alt="LightTrade Logo" style={{ width: 160, height: 160, display: 'inline-block', filter: 'drop-shadow(0 0 40px #00eaffcc)', opacity: 0.66 }} />
  </div>
</div>
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
  }}>Start Your Forex Journey With Confidence</div>
  <div style={{
    width: 54,
    height: 4,
    background: 'linear-gradient(90deg,#FFD600 0%,#2c5364 100%)',
    borderRadius: 4,
    margin: '0.4rem auto 0.7rem auto'
  }} />
</div>
      <div className="home-card">
        <div className="program-cards">
          
          <div 
            className="program-card"
            onClick={() => handleProgramSelect('beginner')}
            onKeyDown={(e) => e.key === 'Enter' && handleProgramSelect('beginner')}
            role="button"
            tabIndex={0}
            aria-label="Select Beginner Program"
          >
            <img
              src={require('../images/beginner.png')}
              alt="Beginner program graphic"
              aria-hidden="true"
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
            <div className="program-card-content">
              <div className="program-card-title">Beginner</div>
              <div className="program-card-desc">Duration: 4 Weeks</div>
              <ul>
                <li>Introduction to the forex market: Currency pairs, market hours, and key terminologies (pips, lots, leverage, and spread).</li>
                <li>How to use the MetaTrader 5 Mobile App: Setting up accounts, navigating the interface, and placing trades with virtual cash.</li>
                <li>Basic Order Types: Market orders, limit orders, and stop orders.</li>
                <li>Introductory Risk Management: Understanding stop losses and risk/reward ratios.</li>
              </ul>
            </div>
          </div>
          
          <div 
            className="program-card"
            onClick={() => handleProgramSelect('intermediate')}
            onKeyDown={(e) => e.key === 'Enter' && handleProgramSelect('intermediate')}
            role="button"
            tabIndex={0}
            aria-label="Select Intermediate Program"
          >
            <img
              src={require('../images/intermediate.png')}
              alt="Intermediate program graphic"
              aria-hidden="true"
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
            <div className="program-card-content">
              <div className="program-card-title">Intermediate</div>
              <div className="program-card-desc">Duration: 4 Weeks</div>
              <ul>
                <li>Mastering MetaTrader 5 on Laptop: Multi-chart setups, using indicators, and advanced tools for trading.</li>
                <li>Technical Analysis Basics: Indicators (RSI, MACD, Fibonacci retracement), and chart patterns (head & shoulders, triangles).</li>
                <li>Fundamental Analysis: Understanding news events, economic reports, and their impact on currency markets.</li>
                <li>Intermediate Risk Management: Hedging strategies, trailing stops, and scaling into/out of trades.</li>
              </ul>
            </div>
          </div>
          
          <div 
            className="program-card"
            onClick={() => handleProgramSelect('advanced')}
            onKeyDown={(e) => e.key === 'Enter' && handleProgramSelect('advanced')}
            role="button"
            tabIndex={0}
            aria-label="Select Advanced Program"
          >
            <img
              src={require('../images/advanced.png')}
              alt="Advanced program graphic"
              aria-hidden="true"
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
            <div className="program-card-content">
              <div className="program-card-title">Advanced</div>
              <div className="program-card-desc">Duration: 4 Weeks</div>
              <ul>
                <li>Expert Advisors (EAs): Introduction to algorithmic trading and automating strategies on MetaTrader 5.</li>
                <li>Advanced Price Action: Liquidity zones, market structure, and multi-timeframe analysis.</li>
                <li>News Trading: Using economic calendars and real-time news events for decision-making.</li>
                <li>Professional Risk Management: Diversification, correlation analysis, and portfolio balancing.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CenteredCardPage>
  );
}
