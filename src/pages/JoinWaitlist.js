import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

import { useLocation } from "react-router-dom";

export default function JoinWaitlist() {
  const location = useLocation();
  React.useEffect(() => {
    document.title = "Join Waitlist | LightTrade FOREX Academy";
  }, [location.pathname]);
  const { currentUser, userPayments } = useAuth();
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Paystack live public key
  const PAYSTACK_PUBLIC_KEY = "pk_live_e15e44178a99c88da40435cee94a6ddaf3ef5fe3";

  // USD to GHS dynamic rate
  const [usdToGhs, setUsdToGhs] = useState(null);
  const [rateError, setRateError] = useState("");
  const usdAmount = 50;
  React.useEffect(() => {
    const fetchRate = () => {
      fetch('https://open.er-api.com/v6/latest/USD')
        .then(res => res.json())
        .then(data => {
          if (data.result === 'success' && data.rates && data.rates.GHS) {
            setUsdToGhs(data.rates.GHS);
          } else {
            setRateError('Could not fetch exchange rate.');
          }
        })
        .catch(() => setRateError('Could not fetch exchange rate.'));
    };
    fetchRate();
    const interval = setInterval(fetchRate, 24 * 60 * 60 * 1000); // every 24 hours
    return () => clearInterval(interval);
  }, []);

  // Fetch program prices from Firestore
  const [programPrices, setProgramPrices] = useState({});
  React.useEffect(() => {
    const fetchPrices = async () => {
      // Fetch prices from Firestore
      try {
        const { collection, getDocs } = await import('firebase/firestore');
        const { db } = await import('../firebase');
        const snap = await getDocs(collection(db, 'programs'));
        const prices = {};
        snap.forEach(doc => {
          const data = doc.data();
          if (doc.id === 'intermediate' || doc.id === 'advanced') {
            prices[doc.id] = data.price;
          }
        });
        setProgramPrices(prices);
      } catch (err) {
        setProgramPrices({});
      }
    };
    fetchPrices();
  }, []);
  const plans = [
    { id: "intermediate", name: "Intermediate", price: (usdToGhs && programPrices.intermediate) ? Math.round(programPrices.intermediate * usdToGhs) : null, usd: programPrices.intermediate },
    { id: "advanced", name: "Advanced", price: (usdToGhs && programPrices.advanced) ? Math.round(programPrices.advanced * usdToGhs) : null, usd: programPrices.advanced },
  ];

  // Load Paystack inline script
  React.useEffect(() => {
    if (!window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Paystack inline payment handler
  const handleJoin = (plan) => {
    setLoading(true);
    setError("");
    if (!window.PaystackPop) {
      setLoading(false);
      setError("Paystack script not loaded. Please try again.");
      return;
    }
    console.log('Paystack Key Used:', PAYSTACK_PUBLIC_KEY);
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: currentUser?.email || '',
      amount: plan.price * 100, // kobo
      currency: 'GHS',
      ref: 'LTF-' + Math.floor(Math.random() * 1000000000),
      callback: function(response) {
        setLoading(false);
        setJoined(true);
        // TODO: Update Firestore with new subscription info and log payment
      },
      onClose: function() {
        setLoading(false);
        setError('Payment was cancelled.');
      }
    });
    handler.openIframe();
  };

  return (
    <div className="waitlist-container" style={{ maxWidth: 500, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #eee" }}>
      <h2 style={{ textAlign: "center" }}>Join the Waitlist for Intermediate and Advanced Tracks</h2>
      <p style={{ textAlign: "center" }}>
        Unlock deeper forex mastery. Secure your spot for exclusive content, live trading rooms, and more!
      </p>
      {joined ? (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600, marginTop: 32 }}>
          🎉 Success! You’re on the waitlist. We’ll notify you when access opens.
        </div>
      ) : (
        <>
          {rateError && (
            <div style={{ color: 'red', marginBottom: 16 }}>{rateError}</div>
          )}
          {usdToGhs && (
            <div style={{ color: '#555', marginBottom: 16 }}>
              <b>Current Rate:</b> 1 USD = {usdToGhs.toFixed(2)} GHS
            </div>
          )}
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 540, margin: '0 auto 24px auto' }}>
  {plans.map((plan) => (
    <div key={plan.id} style={{ width: 290, minHeight: 230, margin: '20px 0', padding: 28, border: 'none', borderRadius: 18, background: 'linear-gradient(120deg, #f8fafc 80%, #e6f0fa 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 32px 0 rgba(44,83,100,0.11), 0 2px 8px 0 #00FFD022', transition: 'transform 0.2s', fontFamily: 'inherit', position: 'relative', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.04)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'}>
      <h3 style={{ marginBottom: 8 }}>{plan.name} Track</h3>
      <div style={{ marginBottom: 18, fontWeight: 700, fontSize: 22, color: '#0aa83f', letterSpacing: 0.2 }}>
        {plan.price ? `GHS ${plan.price.toLocaleString()} (≈ $${plan.usd})` : <span style={{ color: '#bbb', fontSize: 18 }}>Loading price...</span>}
      </div>
      <button
        disabled={loading || !plan.price || (plan.id === 'intermediate' ? userPayments?.intermediatePaid : userPayments?.advancedPaid)}
        style={{ 
          background: (plan.id === 'intermediate' ? userPayments?.intermediatePaid : userPayments?.advancedPaid) ? '#ccc' : '#0aa83f',
          color: '#fff', 
          padding: '10px 28px', 
          borderRadius: 6, 
          border: 'none', 
          fontWeight: 600, 
          fontSize: 16, 
          cursor: (plan.id === 'intermediate' ? userPayments?.intermediatePaid : userPayments?.advancedPaid) ? 'not-allowed' : 'pointer',
          marginTop: 'auto',
          opacity: (plan.id === 'intermediate' ? userPayments?.intermediatePaid : userPayments?.advancedPaid) ? 0.7 : 1
        }}
        onClick={() => handleJoin(plan)}
      >
        {(plan.id === 'intermediate' ? userPayments?.intermediatePaid : userPayments?.advancedPaid)
          ? 'Already Purchased'
          : (loading ? 'Processing...' : `Join Waitlist`)
        }
      </button>
    </div>
  ))}
</div>
          {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
        </>
      )}
      <div style={{ marginTop: 32, fontSize: 14, color: "#888", textAlign: "center" }}>
        Already joined? We’ll email you when your access is ready.
      </div>
    </div>
  );
}
