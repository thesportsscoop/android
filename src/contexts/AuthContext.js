import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getAuth,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  applyActionCode
} from 'firebase/auth';

import { db } from '../firebase';
import { doc, setDoc, updateDoc, serverTimestamp, getDoc, onSnapshot } from 'firebase/firestore';
import Toast from '../Toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userPayments, setUserPayments] = useState({ intermediatePaid: false, advancedPaid: false });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  }, []);

  const ensureProvider = async (uid, providerType) => {
    try {
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);
      if (!snap.exists() || !snap.data().provider) {
        await setDoc(ref, { provider: providerType }, { merge: true });
      }
    } catch (err) {
      console.error('Failed to set provider:', err);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        // Only set user as authenticated if email is verified
        if (user && user.emailVerified) {
          setCurrentUser(user);
          try {
            const ref = doc(db, 'users', user.uid);
            try {
              await updateDoc(ref, { lastActiveAt: serverTimestamp() });
            } catch (err) {
              if (err.code === 'not-found') {
                await setDoc(ref, { lastActiveAt: serverTimestamp() });
              } else {
                throw err;
              }
            }
          } catch (err) {
            console.error('Failed to update last active timestamp:', err);
          }
        } else if (user && !user.emailVerified) {
          // User exists but email not verified - keep them logged out
          setCurrentUser(null);
          console.log('User email not verified, keeping logged out');
        } else {
          // No user logged in
          setCurrentUser(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Auth state error:', error);
        setError('Failed to check authentication status');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading || !currentUser) {
      setSubscriptionPlan(null);
      setIsAdmin(false);
      if (!currentUser) {
        console.log('[AuthContext] currentUser is null (not authenticated)');
      }
      return undefined;
    }
    console.log('[AuthContext] currentUser:', currentUser);
    const ref = doc(db, 'users', currentUser.uid);
    const unsub = onSnapshot(ref, (snap) => {
      const userData = snap.data();
      console.log('[AuthContext] userData:', userData);
      const plan = userData?.subscriptionPlan || null;
      console.log('[AuthContext] subscriptionPlan:', plan);
      setSubscriptionPlan(plan);
      setIsAdmin(plan === 'admin');
      setUserPayments({
        intermediatePaid: !!userData?.intermediatePaid,
        advancedPaid: !!userData?.advancedPaid
      });
    }, (err) => {
      console.error('Failed to fetch subscription plan:', err);
    });
    return unsub;
  }, [currentUser, loading]);

  const getFriendlyErrorMessage = (error) => {
    console.log('Auth error:', error);
    
    if (!error) return 'An unexpected error occurred. Please try again.';
    
    if (error.code) {
      switch (error.code) {
        case 'auth/invalid-email':
          return 'Please enter a valid email address.';
        case 'auth/user-disabled':
          return 'This account has been disabled. Please contact support.';
        case 'auth/user-not-found':
          return 'No account found with this email. Please sign up first.';
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
        case 'auth/invalid-login-credentials':
          return 'Incorrect email or password. Please try again.';
        case 'auth/too-many-requests':
          return 'Too many failed attempts. Please try again later or reset your password.';
        case 'auth/network-request-failed':
          return 'Network error. Please check your connection and try again.';
        case 'auth/email-already-in-use':
          return 'An account with this email already exists. Please log in instead.';
        case 'auth/weak-password':
          return 'Password should be at least 8 characters';
        case 'auth/operation-not-allowed':
          return 'Email/password accounts are not enabled. Please contact support.';
        case 'auth/requires-recent-login':
          return 'Please log in again to complete this action.';
        case 'auth/expired-action-code':
          return 'The action code has expired. Please try again.';
        case 'auth/invalid-action-code':
          return 'Invalid action code. Please request a new verification link.';
        case 'auth/user-mismatch':
          return 'This credential belongs to a different user.';
        case 'auth/credential-already-in-use':
          return 'This credential is already associated with another user account.';
        case 'auth/invalid-verification-code':
          return 'The verification code is invalid. Please try again.';
        case 'auth/invalid-verification-id':
          return 'The verification ID is invalid. Please try again.';
        default:
          return 'Authentication failed. Please try again.';
      }
    }
    
    if (typeof error === 'string') return error;
    
    if (error.message) {
      const lowerMsg = error.message.toLowerCase();
      if (lowerMsg.includes('email') && lowerMsg.includes('verify')) {
        return 'Please verify your email before signing in. Check your inbox for the verification link.';
      }
      if (lowerMsg.includes('network')) {
        return 'Network error. Please check your internet connection and try again.';
      }
      if (lowerMsg.includes('firebase')) {
        const codeMatch = lowerMsg.match(/auth\/[\w-]+/);
        if (codeMatch) {
          return getFriendlyErrorMessage({ code: codeMatch[0] });
        }
        return error.message.replace(/firebase:\s*/i, '').trim();
      }
      return error.message;
    }
    
    console.error('Unhandled auth error:', error);
    return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
  };

  const login = async (email, password) => {
    try {
      if (!email && !password) {
        throw new Error('Please enter your email and password');
      }
      if (!email) {
        throw new Error('Please enter your email');
      }
      if (!password) {
        throw new Error('Please enter your password');
      }
      
      const userCredential = await signInWithEmailAndPassword(getAuth(), email, password)
        .catch(error => {
          if (
            error.code === 'auth/user-not-found' ||
            error.code === 'auth/wrong-password' ||
            error.code === 'auth/invalid-credential' ||
            error.code === 'auth/invalid-login-credentials'
          ) {
            throw new Error('Incorrect email or password. Please try again.');
          }
          throw error;
        });

      await ensureProvider(userCredential.user.uid, 'email');
      
      if (!userCredential.user.emailVerified) {
        const userEmail = userCredential.user.email;
        await signOut(auth);
        const verificationError = new Error('Please verify your email before signing in.');
        verificationError.code = 'auth/email-not-verified';
        verificationError.email = userEmail;
        throw verificationError;
      }
      
      return userCredential.user;
    } catch (error) {
      const friendlyError = new Error(getFriendlyErrorMessage(error));
      friendlyError.originalError = error;
      throw friendlyError;
    }
  };

  const signup = async (email, password, confirmPassword) => {
    try {
      if (!email || !password || !confirmPassword) {
        throw new Error('Please fill in all fields');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (password.length < 8) {
        throw new Error('Password should be at least 8 characters');
      }
      
      const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);

      // Ensure user document is created with subscriptionPlan
      try {
        await setDoc(
          doc(db, 'users', userCredential.user.uid),
          { 
            subscriptionPlan: 'legacyFree',
            createdAt: new Date(),
            email: email
          },
          { merge: true }
        );
        // Create userProgress doc for new user
        await setDoc(
          doc(db, 'userProgress', userCredential.user.uid),
          { beginner: {} },
          { merge: true }
        );
        console.log('User document and userProgress created successfully');
      } catch (docError) {
        console.error('Failed to create user document or userProgress:', docError);
        // Retry once more
        try {
          await setDoc(
            doc(db, 'users', userCredential.user.uid),
            { 
              subscriptionPlan: 'legacyFree',
              createdAt: new Date(),
              email: email
            }
          );
          await setDoc(
            doc(db, 'userProgress', userCredential.user.uid),
            { beginner: {} },
            { merge: true }
          );
          console.log('User document and userProgress created on retry');
        } catch (retryError) {
          console.error('Failed to create user document or userProgress on retry:', retryError);
          throw new Error('Failed to complete registration. Please try again.');
        }
      }

      await ensureProvider(userCredential.user.uid, 'email');
      
      const siteUrl = process.env.REACT_APP_SITE_URL || window.location.origin;
      try {
        await sendEmailVerification(userCredential.user, {
          url: `${siteUrl}/login`,
          handleCodeInApp: true
        });
      } catch (verificationError) {
        console.error('Failed to send verification email:', verificationError);
        showToast(
          'Account created but verification email could not be sent.',
          'error'
        );
      }
      
      // Log user out immediately after registration to enforce email verification
      await signOut(getAuth());
      
      return userCredential.user;
    } catch (error) {
      const friendlyError = new Error(getFriendlyErrorMessage(error));
      friendlyError.originalError = error;
      throw friendlyError;
    }
  };

  const logout = async () => {
    try {
      await signOut(getAuth());
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      if (!email) {
        throw new Error('Please enter your email address');
      }
      
      await sendPasswordResetEmail(getAuth(), email);
      return true;
    } catch (error) {
      const friendlyError = new Error(getFriendlyErrorMessage(error));
      friendlyError.originalError = error;
      throw friendlyError;
    }
  };

  const updateEmail = async (newEmail) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user found');
      
      await firebaseUpdateEmail(user, newEmail);
      setCurrentUser({ ...user, email: newEmail });
      return true;
    } catch (error) {
      console.error('Update email error:', error);
      throw error;
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user found');
      
      await firebaseUpdatePassword(user, newPassword);
      return true;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      await ensureProvider(user.uid, 'google');
      return user;
    } catch (error) {
      let errorMessage = 'Failed to sign in with Google';
      
      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email but different sign-in credentials.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign in was cancelled';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups for this site.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign in was cancelled';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Google Sign-In';
      }
      
      const friendlyError = new Error(errorMessage);
      friendlyError.originalError = error;
      throw friendlyError;
    }
  };

  const verifyEmail = async (actionCode) => {
    try {
      const auth = getAuth();
      await applyActionCode(auth, actionCode);

      if (auth.currentUser) {
        await auth.currentUser.reload();
        setCurrentUser({ ...auth.currentUser });
      }

      return true;
    } catch (error) {
      console.error('Email verification error:', error);
      throw new Error('Invalid or expired verification link.');
    }
  };

  const resendVerificationEmail = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('Please log in first to resend the verification email.');
      }
      
      if (user.emailVerified) {
        throw new Error('Your email is already verified.');
      }
      
      const siteUrl = process.env.REACT_APP_SITE_URL || window.location.origin;
      await sendEmailVerification(user, {
        url: `${siteUrl}/login`,
        handleCodeInApp: true
      });
      
      return true;
    } catch (error) {
      console.error('Resend verification email error:', error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  };

  const value = {
    currentUser,
    subscriptionPlan,
    isAdmin,
    userPayments,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    signInWithGoogle,
    verifyEmail,
    resendVerificationEmail,
    getFriendlyErrorMessage,
    error,
    setError,
    loading,
    showToast,
    toast
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#2c5364'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}
    </AuthContext.Provider>
  );
}
