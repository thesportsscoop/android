import React from "react";

export default function Terms() {
  const banner = (
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
      }}>Terms</div>
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
        <h2 style={{fontWeight: 700, color: '#2c5364', marginBottom: '1.2rem'}}>Terms & Conditions</h2>
        <p>Last updated: June 2025</p>
        <h3>1. Introduction</h3>
        <p>Welcome to LightTradeFOREX Academy ("we," "us," or "our"). By accessing or using our website and services, you agree to be bound by these Terms & Conditions. Please read them carefully.</p>
        <h3>2. Eligibility</h3>
        <p>Our services are intended for individuals who are at least 18 years old or the age of majority in your jurisdiction. By using our site, you represent that you meet these requirements.</p>
        <h3>3. Risk Disclosure</h3>
        <p>Trading foreign exchange (forex) involves significant risk and may not be suitable for all investors. The information provided by LightTrade Forex Academy is for educational purposes only and does not guarantee profits or prevent losses. You acknowledge that you are solely responsible for your trading decisions and any resulting financial outcomes.</p>
        <h3>4. No Investment Advice</h3>
        <p>All content, materials, and communications provided by us are for educational purposes only and do not constitute investment, legal, or tax advice. We do not recommend or endorse any specific trading strategies or financial instruments.</p>
        <h3>5. User Conduct</h3>
        <p>You agree to use our website and services lawfully and respectfully. You may not use our platform to engage in any unlawful, abusive, or fraudulent activity.</p>
        <h3>6. Intellectual Property</h3>
        <p>All content, logos, and materials on this site are the property of LightTradeFOREX Academy or its licensors. You may not copy, reproduce, or distribute any materials without our prior written consent.</p>
        <h3>7. Limitation of Liability</h3>
        <p>We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of our site or services. Your use of our content is at your own risk.</p>
        <h3>8. Changes to Terms</h3>
        <p>We reserve the right to update or modify these Terms & Conditions at any time. Continued use of our site after changes constitutes acceptance of the new terms.</p>
        <h3>9. Governing Law</h3>
        <p>These Terms are governed by the laws of your jurisdiction, without regard to conflicts of law principles.</p>
        <h3>10. Contact Us</h3>
        <p>If you have any questions about these Terms & Conditions, please contact us at support@lighttradeforex.com.</p>
        <p>Trading foreign exchange (forex) involves significant risk and may not be suitable for all investors. The information provided by LightTrade Forex Academy is for educational purposes only and does not guarantee profits or prevent losses. You acknowledge that you are solely responsible for your trading decisions and any resulting financial outcomes.</p>
      </div>
    </>
  );
}
