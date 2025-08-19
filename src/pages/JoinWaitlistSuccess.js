import React from "react";
import { Link } from "react-router-dom";

export default function JoinWaitlistSuccess() {
  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #eee" }}>
      <h2 style={{ textAlign: "center", color: "#2c5364" }}>🎉 Success!</h2>
      <p style={{ textAlign: "center", fontSize: "1.1rem" }}>
        You’re on the waitlist for Intermediate and Advanced Tracks.<br />
        We’ll notify you when access opens.<br /><br />
        <span style={{ color: "#22bb33", fontWeight: 600 }}>Thank you for joining LightTrade FOREX Academy!</span>
      </p>
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Link to="/" style={{ color: "#2c5364", fontWeight: 600, textDecoration: "underline" }}>
          Go to Home
        </Link>
      </div>
    </div>
  );
}
