import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc, setDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import './Subscription.css';

import { getDocs } from 'firebase/firestore';

const Subscription = () => {
  const { currentUser, subscriptionPlan, showToast } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(true);
  const [premiumPrice, setPremiumPrice] = useState(null);

  const PAYSTACK_PUBLIC_KEY = "pk_live_e15e44178a99c88da40435cee94a6ddaf3ef5fe3";

  useEffect(() => {
    document.title = "Subscription | LightTrade FOREX Academy";
  }, [location.pathname]);

  useEffect(() => {
    const fetchPrices = async () => {
      setPriceLoading(true);
      try {
        const programsSnapshot = await getDocs(collection(db, 'programs'));
        let advancedPriceUSD = null;
        programsSnapshot.forEach(doc => {
          if (doc.id === 'advanced') {
            advancedPriceUSD = doc.data().price;
          }
        });

        if (advancedPriceUSD === null) {
          throw new Error("Advanced program price not found.");
        }

        const rateResponse = await fetch('https://open.er-api.com/v6/latest/USD');
        const rateData = await rateResponse.json();
        if (rateData.result === 'success' && rateData.rates.GHS) {
          setPremiumPrice(Math.round(advancedPriceUSD * rateData.rates.GHS));
        } else {
          throw new Error('Could not fetch exchange rate.');
        }
      } catch (error) {
        console.error("Price fetch error:", error);
        showToast("Could not load subscription price. Please try again later.", "error");
      } finally {
        setPriceLoading(false);
      }
    };

    fetchPrices();
  }, [showToast]);

  useEffect(() => {
    if (!window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = (plan) => {
    if (loading) return;
    setLoading(true);

    if (!window.PaystackPop) {
      showToast("Payment service is not available. Please refresh the page.", "error");
      setLoading(false);
      return;
    }

    if (!premiumPrice) {
      showToast("Cannot process payment: price not available.", "error");
      setLoading(false);
      return;
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: currentUser.email,
      amount: premiumPrice * 100, // Amount in kobo
      currency: 'GHS',
      ref: `LTF-SUB-${Date.now()}`,
      callback: async (response) => {
        try {
          const verifyRes = await fetch('/api/verify-paystack', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference: response.reference }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.data.status === 'success') {
            // Update user's subscription
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, {
              subscriptionPlan: 'premium'
            });

            // Log the payment
            const paymentRef = doc(collection(db, 'payments'), response.reference);
            await setDoc(paymentRef, {
              userId: currentUser.uid,
              userEmail: currentUser.email,
              plan: 'premium',
              amount: verifyData.data.amount,
              currency: verifyData.data.currency,
              status: 'success',
              reference: response.reference,
              createdAt: new Date()
            });

            showToast('Payment successful! Your plan has been upgraded.', 'success');
            navigate('/program');
          } else {
            throw new Error('Payment verification failed.');
          }
        } catch (error) {
          console.error("Payment verification or DB update failed:", error);
          showToast('An error occurred during payment verification. Please contact support.', 'error');
        } finally {
          setLoading(false);
        }
      },
      onClose: () => {
        showToast('Payment window closed.', 'info');
        setLoading(false);
      },
    });

    handler.openIframe();
  };

  const PlanCard = ({ title, price, features, isCurrent, onSelect, popular = false, planId, disabled = false }) => (
    <div className={`plan-card ${isCurrent ? 'current' : ''} ${popular ? 'popular' : ''}`}>
      {popular && <div className="popular-badge">POPULAR</div>}
      <h2>{title}</h2>
      <p className="price">{price}</p>
      <ul className="features">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      {isCurrent ? (
        <button className="current-plan-btn" disabled>Current Plan</button>
      ) : (
        <button
          onClick={() => onSelect(planId)}
          className="select-plan-btn"
          disabled={loading || disabled}
        >
          {loading && planId === 'premium' ? 'Processing...' : (subscriptionPlan === 'legacyFree' ? 'Upgrade' : 'Change Plan')}
        </button>
      )}
    </div>
  );

  return (
    <div className="subscription-page">
      <div className="subscription-header">
        <h1>Subscription Plans</h1>
        <p>Choose the plan that's right for you and unlock your trading potential.</p>
      </div>

      <div className="plans-container">
        <PlanCard
          planId="free"
          title="Free"
          price="₵0/month"
          features={[
            'Access to Beginner course',
            'Basic trading resources',
            'Community forum access',
            'Email support',
          ]}
          isCurrent={subscriptionPlan === 'legacyFree'}
          onSelect={() => {}}
        />
        <PlanCard
          planId="premium"
          title="Premium"
          price={priceLoading ? "Loading..." : premiumPrice ? `₵${premiumPrice}/month` : "Price unavailable"}
          features={[
            'Access to all courses (Beginner, Intermediate, Advanced)',
            'Advanced trading tools & indicators',
            'Exclusive webinars & workshops',
            'Priority email & chat support',
            'Personalized trade analysis',
          ]}
          isCurrent={subscriptionPlan === 'premium'}
          onSelect={handlePayment}
          popular={true}
          disabled={priceLoading || !premiumPrice}
        />
      </div>

      {currentUser && (
        <div className="current-plan-info">
          <h3>Your Current Subscription</h3>
          <p>
            You are currently on the <strong>{subscriptionPlan === 'legacyFree' ? 'Free' : 'Premium'}</strong> plan.
          </p>
          <button onClick={() => navigate('/program')} className="back-to-program-btn">
            Go to My Program
          </button>
        </div>
      )}
    </div>
  );
};

export default Subscription;
