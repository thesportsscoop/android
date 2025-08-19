import fetch from 'node-fetch';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();
const auth = getAuth();

const MQL5_CLIENT_ID = process.env.MQL5_CLIENT_ID || 'j007yl';
const MQL5_CLIENT_SECRET = process.env.MQL5_CLIENT_SECRET || 'qzknmuucrdejibzxivrimnymnjgcwdiezwlhokfmrjpadtlsvmsmfnsdbxacorfn';
const MQL5_REDIRECT_URI = process.env.MQL5_REDIRECT_URI || 'https://www.lighttradeforex.com/';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://www.mql5.com/api/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: MQL5_CLIENT_ID,
        client_secret: MQL5_CLIENT_SECRET,
        redirect_uri: MQL5_REDIRECT_URI,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return res.status(400).json({ error: 'Failed to get access token', details: tokenData });
    }

    // Fetch user info
    const userRes = await fetch('https://www.mql5.com/api/oauth/user_info', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();
    if (!userData.id) {
      return res.status(400).json({ error: 'Failed to get user info', details: userData });
    }

    // Use MQL5 id as Firebase uid prefix
    const uid = `mql5_${userData.id}`;
    let firebaseUser;
    try {
      firebaseUser = await auth.getUser(uid);
    } catch (e) {
      // User does not exist, create
      firebaseUser = await auth.createUser({
        uid,
        email: userData.email || undefined,
        displayName: userData.login || userData.email || `MQL5 User ${userData.id}`,
        emailVerified: true,
        providerData: [{ providerId: 'mql5.com', uid: userData.id }],
      });
    }

    // Update Firestore user doc with provider info
    await db.collection('users').doc(uid).set({
      email: userData.email || '',
      mql5Id: userData.id,
      displayName: userData.login || '',
      subscriptionPlan: 'legacyFree',
      provider: 'mql5',
      createdAt: new Date(),
    }, { merge: true });

    // Create userProgress doc if not exists
    await db.collection('userProgress').doc(uid).set({ beginner: {} }, { merge: true });

    // Issue Firebase custom token
    const customToken = await auth.createCustomToken(uid, { provider: 'mql5' });
    return res.status(200).json({ firebaseToken: customToken });
  } catch (err) {
    console.error('MQL5 OAuth error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
