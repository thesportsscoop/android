import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

export default function ProgramTrack() {
  const { track } = useParams();
  const { currentUser, subscriptionPlan, showToast } = useAuth();
  const [progress, setProgress] = useState({});
  const [answers, setAnswers] = useState({});
  const [program, setProgram] = useState(null);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    if (!currentUser || !track) return;
    const ref = doc(db, 'userProgress', currentUser.uid);
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data() || {};
      console.log('[ProgramTrack] progress data:', data);
      setProgress(data[track] || {});
    });
    return unsub;
  }, [currentUser, track]);

  useEffect(() => {
    if (!track) return;
    const programRef = doc(db, 'programs', track);
    const unsubProgram = onSnapshot(programRef, (snap) => {
      setProgram(snap.data());
    });

    const quizRef = doc(db, 'quizzes', track);
    const unsubQuiz = onSnapshot(quizRef, (snap) => {
      console.log('[ProgramTrack] quiz data:', snap.data());
      setQuiz(snap.data());
    });

    return () => {
      unsubProgram();
      unsubQuiz();
    };
  }, [track]);

  const handleMarkWatched = async (id) => {
    if (!currentUser) return;
    const ref = doc(db, 'userProgress', currentUser.uid);
    await setDoc(ref, { [track]: { ...(progress || {}), [id]: true } }, { merge: true });
  };

  const handleAnswer = (sectionIndex, questionIndex, option) => {
    setAnswers((prev) => ({ ...prev, [`${sectionIndex}-${questionIndex}`]: option }));
  };

  const videos = Array.isArray(program?.videos) ? program.videos : [];

  const watchedCount = videos.reduce(
    (count, video) => count + (progress[video.id] ? 1 : 0),
    0
  );
  const percent = videos.length
    ? Math.round((watchedCount / videos.length) * 100)
    : 0;

  if (!program) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>Loading program...</p>;
  }

  if (!['beginner', 'intermediate', 'advanced'].includes(track)) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>Program not found.</p>;
  }

  if ((!subscriptionPlan || subscriptionPlan === 'legacyFree') && track.toLowerCase() !== 'beginner') {
    if (showToast) showToast('Available to Premium users only', 'error');
    return <p style={{ padding: '2rem', textAlign: 'center' }}>Available to Premium users only.</p>;
  }

  return (
    <div className="program-track-page">
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
        marginTop: 0,
      }}>
        <div style={{
          fontSize: '1.32rem',
          color: '#f3f6fa',
          fontWeight: 600,
          letterSpacing: '0.01em',
          marginBottom: '0.3rem',
          textShadow: '0 1.5px 8px #2c536466',
        }}>{program.title}</div>
        <div style={{
          width: 54,
          height: 4,
          background: 'linear-gradient(90deg,#FFD600 0%,#2c5364 100%)',
          borderRadius: 4,
          margin: '0.4rem auto 0.7rem auto',
        }} />
      </div>

      <div
        className="about-card"
        style={{ marginTop: '2.5rem', position: 'relative', zIndex: 3 }}
      >
        <p style={{ fontSize: '1.13rem', color: '#234', marginBottom: '1.7rem' }}>
          Progress: {percent}% ({watchedCount}/{videos.length} videos watched)
        </p>
        <div className="program-cards" style={{ width: '100%', marginTop: '2rem' }}>
          {Array.isArray(videos) && videos.length > 0 ? videos.map((video, idx) => {
            // Show all quiz questions only for the first video (idx === 0)
            const currentQuiz = quiz?.questions ? (idx === 0 ? quiz : null) : null;
            const unlocked = progress[video.id];
            return (
              <div key={video.id} className="program-card">
                <div className="video-wrapper">
                  {video.youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div style={{ padding: '1rem', textAlign: 'center' }}>
                      Video not available
                    </div>
                  )}
                </div>
                <div className="program-card-content" style={{ textAlign: 'center' }}>
                  <div className="program-card-title">{video.title}</div>
                  {progress[video.id] ? (
                    <div style={{ color: 'green', fontWeight: 600 }}>Watched</div>
                  ) : (
                    <button onClick={() => handleMarkWatched(video.id)}>Mark as Watched</button>
                  )}
                  {currentQuiz && (
                    <div className="quiz-section">
                      <h3>Quiz</h3>
                      {unlocked ? (
                        <ol>
                          {(Array.isArray(currentQuiz?.questions) ? currentQuiz.questions : []).map((q, qi) => (
                            <li key={qi}>
                              <div>{q.question}</div>
                              <ul className="quiz-options">
                                {(Array.isArray(q?.options) ? q.options : []).map((opt, oi) => {
                                  const val = opt.split(')')[0];
                                  const name = `q-${idx}-${qi}`;
                                  return (
                                    <li key={oi}>
                                      <label>
                                        <input
                                          type="radio"
                                          name={name}
                                          value={val}
                                          checked={answers[`${idx}-${qi}`] === val}
                                          onChange={() => handleAnswer(idx, qi, val)}
                                        />
                                        <span style={{ flex: 1 }}>{opt}</span>
                                      </label>
                                    </li>
                                  );
                                })}
                              </ul>
                              {answers[`${idx}-${qi}`] && (
                                <div
                                  className="quiz-feedback"
                                  style={{ color: answers[`${idx}-${qi}`] === q.answer ? 'green' : 'red' }}
                                >
                                  {answers[`${idx}-${qi}`] === q.answer ? 'Correct' : 'Incorrect'}
                                </div>
                              )}
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p style={{ color: '#888' }}>Watch Section {idx + 1} to unlock this quiz.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          }) : <div style={{padding:'2rem',textAlign:'center',color:'#888'}}>No videos found for this program.</div>}
        </div>
      </div>
    </div>
  );
}
