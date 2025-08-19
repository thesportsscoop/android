import React from "react";
import "../App.css";

export default function PageSpinner() {
  return (
    <div className="page-spinner-overlay">
      <div className="page-spinner">
        <div className="lds-ring">
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
    </div>
  );
}
