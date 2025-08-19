import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, onSnapshot, deleteDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { deleteSubcollection } from '../firebase-helpers';
import { useAuth } from '../contexts/AuthContext';
import ProgramForm from '../components/ProgramForm';
import ModuleForm from '../components/ModuleForm';
import QuizForm from '../components/QuizForm';
import ProgramsList from '../components/ProgramsList';

export default function Admin() {
  const { showToast } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [program, setProgram] = useState({ id: '', title: '', duration: '', description: '', videos: [] });
  const [module, setModule] = useState({ title: '', description: '', youtubeId: '' });
  const [editingModuleIndex, setEditingModuleIndex] = useState(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedProgramForQuiz, setSelectedProgramForQuiz] = useState(null);
  const [quiz, setQuiz] = useState({ id: '', title: '', questions: [] });
  const [question, setQuestion] = useState({ question: '', options: '', answer: '' });
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('programs'); // 'programs', 'users', 'payments'
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // --- User Progress Modal State ---
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [progressUser, setProgressUser] = useState(null); // user object
  const [progressData, setProgressData] = useState({});
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressError, setProgressError] = useState('');

  const handleProgramChange = (e) => {
    setProgram({ ...program, [e.target.name]: e.target.value });
  };

  const handleModuleChange = (e) => {
    setModule({ ...module, [e.target.name]: e.target.value });
  };

  const handleAddModule = () => {
    const titleTrimmed = module.title.trim();
    const youtubeIdTrimmed = module.youtubeId.trim();

    if (!titleTrimmed || !youtubeIdTrimmed) {
      showToast('Module title and YouTube ID are required', 'error');
      return;
    }

    const newModule = {
      ...module,
      title: titleTrimmed,
      youtubeId: youtubeIdTrimmed,
    };

    const newVideos = [...program.videos];
    if (editingModuleIndex !== null) {
      newVideos[editingModuleIndex] = newModule;
      setEditingModuleIndex(null);
    } else {
      newVideos.push(newModule);
    }

    setProgram({ ...program, videos: newVideos });
    setModule({ title: '', description: '', youtubeId: '' });
  };

  const handleEditModule = (index) => {
    const moduleToEdit = program.videos[index];
    setModule(moduleToEdit);
    setEditingModuleIndex(index);
  };

  const handleDeleteModule = (index) => {
    const newVideos = program.videos.filter((_, i) => i !== index);
    setProgram({ ...program, videos: newVideos });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'programs'), (snapshot) => {
      const programsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPrograms(programsData);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'payments'), (snapshot) => {
      const paymentsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPayments(paymentsData);
    });
    return unsubscribe;
  }, []);

  const handleProgramSubmit = async (e) => {
    e.preventDefault();
    if (!program.id || !program.title || !program.duration) {
      showToast('Program ID, Title, and Duration are required', 'error');
      return;
    }
    try {
      await setDoc(doc(db, 'programs', program.id), {
        title: program.title,
        duration: program.duration,
        price: program.price ? Number(program.price) : null,
        description: program.description.split(',').map((item) => item.trim()),
        videos: program.videos,
        order: program.order ? Number(program.order) : null,
      });
      showToast('Program saved successfully!', 'success');
      setProgram({ id: '', title: '', duration: '', description: '', price: '', videos: [] });
    } catch (error) {
      console.error('Error saving program:', error);
      showToast('Failed to save program.', 'error');
    }
  };

  const handleDeleteProgram = async (programId) => {
    if (window.confirm('Are you sure you want to delete this program? This will remove all related data.')) {
      try {
        await deleteDoc(doc(db, 'programs', programId));
        await deleteDoc(doc(db, 'quizzes', programId));
        const usersSnapshot = await getDocs(collection(db, 'users'));
        usersSnapshot.forEach(async (userDoc) => {
          const userProgressRef = doc(db, 'userProgress', userDoc.id);
          const userProgressSnapshot = await getDocs(collection(userProgressRef, programId));
          if (userProgressSnapshot.size > 0) {
            await deleteSubcollection(`userProgress/${userDoc.id}`, programId);
          }
        });
        showToast('Program and all related data deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting program:', error);
        showToast('Failed to delete program.', 'error');
      }
    }
  };

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  const handleAddQuestion = () => {
    if (!question.question || !question.options || !question.answer) {
      showToast('Please fill in all question fields', 'error');
      return;
    }
    const newQuestions = Array.isArray(quiz.questions) ? [...quiz.questions] : [];
    const newQuestion = {
      ...question,
      options: Array.isArray(question.options) ? question.options : question.options.split(',').map((item) => item.trim()),
    };

    if (editingQuestionIndex !== null) {
      newQuestions[editingQuestionIndex] = newQuestion;
      setEditingQuestionIndex(null);
    } else {
      newQuestions.push(newQuestion);
    }

    setQuiz({ ...quiz, questions: newQuestions });
    setQuestion({ question: '', options: '', answer: '' });
  };

  const handleEditQuestion = (index) => {
    setEditingQuestionIndex(index);
    const q = quiz.questions[index];
    setQuestion({
      ...q,
      options: Array.isArray(q.options) ? q.options.join(', ') : q.options,
    });
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = [...quiz.questions];
    newQuestions.splice(index, 1);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!quiz.id) {
      showToast('Quiz ID is required', 'error');
      return;
    }
    try {
      await setDoc(doc(db, 'quizzes', quiz.id), {
        title: quiz.title,
        questions: quiz.questions,
      });
      showToast('Quiz saved successfully!', 'success');
      handleCloseQuizModal();
    } catch (error) {
      console.error('Error saving quiz:', error);
      showToast('Failed to save quiz.', 'error');
    }
  };

  const handleDeleteQuiz = async () => {
    if (!quiz.id) {
      showToast('Please select a quiz to delete', 'error');
      return;
    }
    try {
      await deleteDoc(doc(db, 'quizzes', quiz.id));
      showToast('Quiz deleted successfully', 'success');
      setQuiz({ id: '', title: '', questions: [] });
      setIsQuizModalOpen(false);
    } catch (error) {
      console.error('Error deleting quiz:', error);
      showToast('Failed to delete quiz', 'error');
    }
  };

  const fixUsersWithoutSubscriptionPlan = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      let fixedCount = 0;
      
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        if (!userData.subscriptionPlan) {
          await updateDoc(doc(db, 'users', userDoc.id), {
            subscriptionPlan: 'legacyFree'
          });
          fixedCount++;
          console.log(`Fixed user ${userDoc.id} - added subscriptionPlan: legacyFree`);
        }
      }
      
      if (fixedCount > 0) {
        showToast(`Fixed ${fixedCount} users missing subscriptionPlan field`, 'success');
      } else {
        showToast('All users already have subscriptionPlan field', 'info');
      }
    } catch (error) {
      console.error('Error fixing users:', error);
      showToast('Failed to fix users', 'error');
    }
  };

  const handleEditProgram = (p) => {
    setProgram({
      id: p.id,
      title: p.title,
      duration: p.duration,
      description: Array.isArray(p.description) ? p.description.join(', ') : '',
      videos: p.videos || [],
    });
  };

  const handleCancelEdit = () => {
    setProgram({ id: '', title: '', duration: '', description: '', videos: [] });
  };

  const handleOpenQuizModal = (programId) => {
    setSelectedProgramForQuiz(programId);
    setIsQuizModalOpen(true);
    const quizRef = doc(db, 'quizzes', programId);
    onSnapshot(quizRef, (snap) => {
      if (snap.exists()) {
        setQuiz({ id: snap.id, ...snap.data() });
      } else {
        setQuiz({ id: programId, title: '', questions: [] });
      }
    });
  };

  const handleCloseQuizModal = () => {
    setIsQuizModalOpen(false);
    setSelectedProgramForQuiz(null);
    setQuiz({ id: '', title: '', questions: [] });
  };

  const updateUserSubscription = async (userId, newPlan) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        subscriptionPlan: newPlan
      });
      showToast(`Updated user subscription to ${newPlan}`, 'success');
    } catch (error) {
      console.error('Error updating user subscription:', error);
      showToast('Failed to update user subscription', 'error');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  // --- Handler to open modal and load progress ---
  const handleOpenProgressModal = async (user) => {
    setProgressUser(user);
    setIsProgressModalOpen(true);
    setProgressLoading(true);
    setProgressError('');
    try {
      const ref = doc(db, 'userProgress', user.id);
      const snap = await getDocs(collection(db, 'userProgress'));
      // Try to get this user's progress
      const userDoc = snap.docs.find(d => d.id === user.id);
      if (userDoc) {
        setProgressData(userDoc.data());
      } else {
        setProgressData({});
      }
    } catch (err) {
      setProgressError('Failed to load user progress');
      setProgressData({});
    }
    setProgressLoading(false);
  };

  // --- Handler to update/save progress ---
  const handleSaveProgress = async () => {
    if (!progressUser) return;
    setProgressLoading(true);
    setProgressError('');
    try {
      await setDoc(doc(db, 'userProgress', progressUser.id), progressData, { merge: true });
      showToast('User progress updated!', 'success');
      setIsProgressModalOpen(false);
    } catch (err) {
      setProgressError('Failed to save progress');
    }
    setProgressLoading(false);
  };

  // --- Handler for changing progress fields ---
  const handleProgressFieldChange = (track, value) => {
    setProgressData(prev => ({ ...prev, [track]: value }));
  };

  // Effect to manage body overflow when modal is open
  useEffect(() => {
    if (isQuizModalOpen || isProgressModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup function to remove class when component unmounts or modals close
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isQuizModalOpen, isProgressModalOpen]);

  const exportToCsv = (filename, rows) => {
    const processRow = row => row.map(val => `"${(val || '').toString().replace(/"/g, '""')}"`).join(',');
    const csvContent = [
      Object.keys(rows[0]).join(','),
      ...rows.map(row => processRow(Object.values(row)))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportUsers = () => {
    const formattedUsers = users.map(user => ({
      Email: user.email || 'N/A',
      UID: user.id,
      SubscriptionPlan: user.subscriptionPlan || 'MISSING',
      Provider: user.provider || 'Unknown',
      Status: user.subscriptionStatus || 'inactive',
      SubscriptionEnd: formatDate(user.subscriptionEnd),
      LastActive: formatDate(user.lastActiveAt)
    }));
    exportToCsv('users.csv', formattedUsers);
  };

  const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <nav style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
          {pageNumbers.map(number => (
            <li key={number} style={{ margin: '0 0.25rem' }}>
              <button
                onClick={() => onPageChange(number)}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #ddd',
                  backgroundColor: currentPage === number ? '#007bff' : 'white',
                  color: currentPage === number ? 'white' : '#007bff',
                  cursor: 'pointer'
                }}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  const renderUsersTab = () => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>User Management ({users.length} users)</h3>
          <div>
            <button
              onClick={fixUsersWithoutSubscriptionPlan}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '1rem'
              }}
            >
              Fix Missing Subscription Plans
            </button>
            <button
              onClick={handleExportUsers}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Export as CSV
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>UID</th>
                <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Subscription Plan</th>
                <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Provider</th>
                <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Subscription End</th>
                <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Last Active</th>
                <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{user.email || 'N/A'}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '0.85rem' }}>{user.id}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: user.subscriptionPlan === 'admin' ? '#dc3545' :
                                     user.subscriptionPlan === 'premium' ? '#007bff' : '#28a745',
                      color: 'white',
                      fontSize: '0.8rem'
                    }}>
                      {user.subscriptionPlan || 'MISSING'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd', textTransform: 'capitalize' }}>
                    {user.provider === 'google' ? 'Google' : user.provider === 'mql5' ? 'MQL5' : user.provider === 'email' ? 'Email' : 'Unknown'}
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                    {user.subscriptionStatus || 'inactive'}
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                    {formatDate(user.subscriptionEnd)}
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                    {formatDate(user.lastActiveAt)}
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                    <select
                      value={user.subscriptionPlan || ''}
                      onChange={(e) => updateUserSubscription(user.id, e.target.value)}
                      style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      <option value="legacyFree">Free</option>
                      <option value="premium">Premium</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      style={{ marginLeft: 8, padding: '0.25rem 0.5rem', borderRadius: 4, border: '1px solid #007bff', background: '#007bff', color: 'white', cursor: 'pointer', fontSize: '0.8rem' }}
                      onClick={() => handleOpenProgressModal(user)}
                    >
                      Edit Progress
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          totalItems={users.length}
          itemsPerPage={usersPerPage}
          currentPage={currentPage}
          onPageChange={paginate}
        />
      </div>
    );
  }

  const renderPaymentsTab = () => (
    <div>
      <h3>Payment Management ({payments.length} payments)</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>User Email</th>
              <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Plan</th>
              <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Amount</th>
              <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Currency</th>
              <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Reference</th>
              <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{payment.userEmail}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{payment.plan}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>₵{(payment.amount / 100).toFixed(2)}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{payment.currency}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    backgroundColor: payment.status === 'success' ? '#28a745' : '#dc3545',
                    color: 'white',
                    fontSize: '0.8rem'
                  }}>
                    {payment.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{payment.reference}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{formatDate(payment.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      
      {/* Navigation Tabs */}
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid #ddd' }}>
        <button 
          onClick={() => setActiveTab('programs')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            border: 'none', 
            backgroundColor: activeTab === 'programs' ? '#007bff' : 'transparent',
            color: activeTab === 'programs' ? 'white' : '#007bff',
            borderBottom: activeTab === 'programs' ? '2px solid #007bff' : 'none',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          Programs ({programs.length})
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            border: 'none', 
            backgroundColor: activeTab === 'users' ? '#007bff' : 'transparent',
            color: activeTab === 'users' ? 'white' : '#007bff',
            borderBottom: activeTab === 'users' ? '2px solid #007bff' : 'none',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          Users ({users.length})
        </button>
        <button 
          onClick={() => setActiveTab('payments')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            border: 'none', 
            backgroundColor: activeTab === 'payments' ? '#007bff' : 'transparent',
            color: activeTab === 'payments' ? 'white' : '#007bff',
            borderBottom: activeTab === 'payments' ? '2px solid #007bff' : 'none',
            cursor: 'pointer'
          }}
        >
          Payments ({payments.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && renderUsersTab()}
      {activeTab === 'payments' && renderPaymentsTab()}
      {activeTab === 'programs' && (
        <div>
          <h3>Program Management</h3>
          <ProgramsList programs={programs} handleEditProgram={handleEditProgram} handleDeleteProgram={handleDeleteProgram} handleOpenQuizModal={handleOpenQuizModal} />
          
          <ProgramForm program={program} handleProgramChange={handleProgramChange} handleProgramSubmit={handleProgramSubmit} />
          
          <ModuleForm
            module={module}
            handleModuleChange={handleModuleChange}
            handleAddModule={handleAddModule}
            editingModuleIndex={editingModuleIndex}
          />
          <button
            type="button"
            onClick={handleAddModule}
            disabled={!module.title.trim() || !module.youtubeId.trim()}
          >
            Add Module
          </button>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            <h3>Modules ({program.videos.length})</h3>
            {program.videos.map((m, index) => (
              <li key={index} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee' }}>
                <strong>{m.title}</strong>
                <p>{m.description}</p>
                <p>YouTube ID: {m.youtubeId}</p>
                <p><a href={`https://www.youtube.com/watch?v=${m.youtubeId}`} target="_blank" rel="noopener noreferrer">Watch Module on YouTube</a></p>
                <div style={{ marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => handleEditModule(index)} style={{ marginRight: '0.5rem' }}>Edit</button>
                  <button type="button" onClick={() => handleDeleteModule(index)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isQuizModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
          <div style={{ background: 'white', padding: '2rem', width: '80%', maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Manage Quiz for {selectedProgramForQuiz}</h2>
              <button onClick={handleCloseQuizModal}>Close</button>
            </div>
            <QuizForm
              quiz={quiz}
              question={question}
              handleQuizChange={handleQuizChange}
              handleQuestionChange={handleQuestionChange}
              handleAddQuestion={handleAddQuestion}
              handleQuizSubmit={handleQuizSubmit}
              editingQuestionIndex={editingQuestionIndex}
              setEditingQuestionIndex={setEditingQuestionIndex}
              setQuestion={setQuestion}
            />
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <h3>Current Quiz Questions</h3>
              <ul>
                {quiz.questions && Array.isArray(quiz.questions) && quiz.questions.map((q, i) => (
                  <li key={i}>
                    <strong>{q.question}</strong>
                    <ul>
                      {q.options && Array.isArray(q.options) && q.options.map((opt, j) => (
                        <li key={j}>{opt}</li>
                      ))}
                    </ul>
                    <p>Answer: {q.answer}</p>
                    <div style={{ marginTop: '0.5rem' }}>
                      <button onClick={() => handleEditQuestion(i)} style={{ marginRight: '0.5rem' }}>Edit</button>
                      <button onClick={() => handleDeleteQuestion(i)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {isProgressModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 8, padding: 24, minWidth: 320, maxWidth: 400 }}>
            <h3>Edit Progress for {progressUser?.email || progressUser?.id}</h3>
            {progressLoading ? (
              <p>Loading...</p>
            ) : progressError ? (
              <p style={{ color: 'red' }}>{progressError}</p>
            ) : (
              <div>
                {['beginner', 'intermediate', 'advanced'].map(track => (
                  <div key={track} style={{ marginBottom: 12 }}>
                    <label style={{ fontWeight: 500 }}>{track.charAt(0).toUpperCase() + track.slice(1)} Progress</label>
                    <input
                      type="text"
                      value={typeof progressData[track] === 'object' ? JSON.stringify(progressData[track]) : progressData[track] || ''}
                      onChange={e => {
                        let val = e.target.value;
                        try { val = JSON.parse(val); } catch { /* leave as string */ }
                        handleProgressFieldChange(track, val);
                      }}
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', marginTop: 4 }}
                      placeholder="{} or progress info as JSON"
                    />
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setIsProgressModalOpen(false)} style={{ padding: '0.5rem 1rem', borderRadius: 4, border: '1px solid #ccc', background: '#eee', color: '#333' }}>Cancel</button>
              <button onClick={handleSaveProgress} style={{ padding: '0.5rem 1rem', borderRadius: 4, border: '1px solid #007bff', background: '#007bff', color: 'white' }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}