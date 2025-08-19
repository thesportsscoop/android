import React from 'react';
import { render, waitFor } from '@testing-library/react';

jest.mock('../firebase', () => ({
  auth: {},
  provider: {},
  db: {}
}));

var mockCreateUserWithEmailAndPassword;
var mockSendEmailVerification;
var mockUnsubscribe;

var mockSetDoc;
var mockDoc;
var mockGetDoc;
var mockServerTimestamp;
var mockOnSnapshot;

jest.mock('firebase/auth', () => {
  mockCreateUserWithEmailAndPassword = jest.fn();
  mockSendEmailVerification = jest.fn();
  mockUnsubscribe = jest.fn();
  return {
    __esModule: true,
    getAuth: jest.fn(() => ({})),
    createUserWithEmailAndPassword: (...args) => mockCreateUserWithEmailAndPassword(...args),
    sendEmailVerification: (...args) => mockSendEmailVerification(...args),
    signOut: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    GoogleAuthProvider: { credentialFromResult: jest.fn() },
    signInWithPopup: jest.fn(),
    onAuthStateChanged: jest.fn((auth, cb) => { cb(null); return mockUnsubscribe; }),
    applyActionCode: jest.fn()
  };
});

jest.mock('firebase/firestore', () => {
  mockSetDoc = jest.fn();
  mockDoc = jest.fn(() => ({}));
  mockGetDoc = jest.fn(() => Promise.resolve({ exists: () => true, data: () => ({ provider: 'email' }) }));
  mockServerTimestamp = jest.fn(() => 'timestamp');
  mockOnSnapshot = jest.fn((ref, cb) => {
    cb({ data: () => ({ subscriptionPlan: 'legacyFree' }) });
    return jest.fn();
  });
  return {
    __esModule: true,
    doc: (...args) => mockDoc(...args),
    setDoc: (...args) => mockSetDoc(...args),
    getDoc: (...args) => mockGetDoc(...args),
    serverTimestamp: (...args) => mockServerTimestamp(...args),
    onSnapshot: (...args) => mockOnSnapshot(...args)
  };
});


let AuthProvider;
let useAuth;

function SignupComponent({ onSignedUp }) {
  const { signup } = useAuth();
  React.useEffect(() => {
    signup('test@example.com', 'password123', 'password123').then(onSignedUp);
  }, [signup, onSignedUp]);
  return null;
}

test('signup sets default subscription plan', async () => {
  ({ AuthProvider, useAuth } = require('../contexts/AuthContext'));
  mockCreateUserWithEmailAndPassword.mockResolvedValue({ user: { uid: 'abc123' } });

  const onSignedUp = jest.fn();
  render(
    <AuthProvider>
      <SignupComponent onSignedUp={onSignedUp} />
    </AuthProvider>
  );

  await waitFor(() => expect(onSignedUp).toHaveBeenCalled());

  expect(mockSetDoc).toHaveBeenCalledWith(
    expect.anything(),
    {
      subscriptionPlan: 'legacyFree',
      createdAt: expect.any(Date),
      email: 'test@example.com'
    },
    { merge: true }
  );
});
