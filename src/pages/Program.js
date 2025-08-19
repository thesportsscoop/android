import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import "../App.css";

import { useLocation } from "react-router-dom";

export default function Program() {
  const location = useLocation();
  React.useEffect(() => {
    document.title = "Programs | LightTrade FOREX Academy";
  }, [location.pathname]);
  const { currentUser, subscriptionPlan, showToast } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [progress, setProgress] = useState({});
  const [programs, setPrograms] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'programs'), (snap) => {
      const newPrograms = {};
      snap.forEach((doc) => {
        newPrograms[doc.id] = doc.data();
      });
      setPrograms(newPrograms);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setProgress({});
      return undefined;
    }
    const ref = doc(db, 'userProgress', currentUser.uid);
    const unsub = onSnapshot(ref, (snap) => {
      setProgress(snap.data() || {});
    });
    return unsub;
  }, [currentUser]);

  useEffect(() => {
    const programParam = searchParams.get('program');
    if (programParam && programs[programParam]) {
      setSelectedProgram(programParam);
    } else {
      setSelectedProgram(null);
    }
  }, [searchParams, programs]);

  const handleProgramSelect = (program) => {
    if (!programs[program]) return;

    if (!currentUser) {
      navigate(`/login?redirect=/program/${encodeURIComponent(program)}`);
      return;
    }

    if ((!subscriptionPlan || subscriptionPlan === 'legacyFree') && program !== 'beginner') {
      navigate('/subscription');
      return;
    }

    navigate(`/program/${encodeURIComponent(program)}`);
  };
  const Banner = ({ title }) => (
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
      }}>{title || 'Program'}</div>
      <div style={{
        width: 54,
        height: 4,
        background: 'linear-gradient(90deg,#FFD600 0%,#2c5364 100%)',
        borderRadius: 4,
        margin: '0.4rem auto 0.7rem auto'
      }} />
    </div>
  );

  const renderProgramCards = () => {
    const programsToRender = selectedProgram
      ? [[selectedProgram, programs[selectedProgram]]]
      : Object.entries(programs).sort((a, b) => (a[1].order || 99) - (b[1].order || 99));

    return programsToRender.map(([key, program]) => {
      const hasProgress = progress[key] && Object.values(progress[key]).some(Boolean);
      return (
        <div
          key={key}
          className="program-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.6rem 1rem',
            minWidth: 0,
            width: '100%',
            maxWidth: 340,
            margin: '0 auto'
          }}
          onClick={() => handleProgramSelect(key)}
          onKeyDown={(e) => e.key === 'Enter' && handleProgramSelect(key)}
          role="button"
          tabIndex={0}
          aria-label={`Select ${program.title} Program`}
        >
          <div className="dummy-img" aria-hidden="true" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 54,
            fontWeight: 700,
            color: '#fff',
            borderRadius: 18,
            margin: '0 auto 1.1rem auto',
            width: 100,
            height: 100,
            background: program.title.startsWith('A') ? '#4e6cff' : program.title.startsWith('B') ? '#ffd600' : '#00c48c',
            boxShadow: '0 4px 24px 0 #2c536433',
            letterSpacing: 2
          }}>
            {program.title.charAt(0)}
          </div>
          <div className="program-card-title">{program.title}</div>
          <div className="program-card-button">
            {hasProgress ? 'Continue' : 'Start'}
            <span className="button-arrow">→</span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="program-selection-page">
      <Banner title="Our Programs" />
      <div className="about-card" style={{marginTop: '2.5rem'}}>
        <h2 style={{fontWeight: 700, color: '#2c5364', marginBottom: '1.2rem'}}>
          Our Trading Programs
        </h2>
        <p style={{fontSize: '1.13rem', color: '#234', marginBottom: '1.7rem'}}>
          Choose the program that best fits your trading journey. Each level is designed to build upon the last, providing you with comprehensive knowledge and practical skills for successful trading.
        </p>
        <div className="program-cards" style={{width: '100%', marginTop: '2rem', gap: '2rem'}}>
          {selectedProgram && (
            <div style={{width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: '1.5rem'}}>
              <button 
                onClick={() => navigate('/program')}
                style={{
                  padding: '0.7rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'rgba(44, 83, 100, 0.08)',
                  color: '#2c5364',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(44, 83, 100, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(44, 83, 100, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{fontSize: '1.2rem', lineHeight: 1}}>←</span> Back to all programs
              </button>
            </div>
          )}
          {renderProgramCards()}
        </div>
      </div>
    </div>
  );
}
