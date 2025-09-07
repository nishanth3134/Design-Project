import React from "react";
import Chatbot from "./components/chatbot";
import EligibilityForm from "./components/EligibilityForm";

export default function App() {
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Left: Chatbot */}
      <div style={{ flex: 2, borderRight: "1px solid #ddd", padding: "1rem" }}>
        <h2>💬 Government Schemes Chatbot</h2>
        <Chatbot />
      </div>

      {/* Right: Eligibility Form */}
      <div style={{ flex: 1, padding: "1rem" }}>
        <h2>✅ Quick Eligibility Check</h2>
        <EligibilityForm />
      </div>
    </div>
  );
}
