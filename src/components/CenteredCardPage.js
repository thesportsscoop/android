import React from "react";
export default function CenteredCardPage({ children }) {
  return (
    <div
      className="centered-page global-container"
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "100vw",
        overflowX: "hidden",
        padding: "0 2vw"
      }}
    >
      {children}
    </div>
  );
}
