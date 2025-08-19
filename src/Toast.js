import React, { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onClose(), 2600);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: type === "error" ? "#f44336" : "#43a047",
        color: "#fff",
        padding: "1.2rem 2.4rem",
        borderRadius: 12,
        fontWeight: 500,
        fontSize: "1.1rem",
        zIndex: 9999,
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
        minWidth: 240,
        textAlign: "center",
        letterSpacing: 0.3,
        opacity: 0.98,
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.2)"
      }}
      role="alert"
      aria-live="assertive"
    >
      {typeof message === 'string' && message.includes('\n')
        ? message.split('\n').map((line, idx) => <div key={idx}>{line}</div>)
        : message}
    </div>
  );
}
