import React, { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hi! Ask me about government schemes." }]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { sender: "user", text: input }]);

    try {
      const res = await axios.get(`/api/schemes?q=${encodeURIComponent(input)}`);
      const schemes = res.data;

      if (schemes.length > 0) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `I found ${schemes.length} relevant scheme(s):` },
          ...schemes.map((s) => ({
            sender: "bot",
            text: `${s.name}\nBenefits: ${s.benefits}\nHow to Apply: ${s.application}\nLink: ${s.officialLink}`
          }))
        ]);
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, no matching schemes found." }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error fetching schemes." }]);
    }

    setInput("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "90%" }}>
      {/* Chat messages */}
      <div style={{ flex: 1, overflowY: "auto", marginBottom: "1rem", border: "1px solid #ddd", padding: "0.5rem" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "0.5rem 0", textAlign: msg.sender === "user" ? "right" : "left" }}>
            <span
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                borderRadius: "10px",
                background: msg.sender === "user" ? "#007bff" : "#f1f1f1",
                color: msg.sender === "user" ? "#fff" : "#000"
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex" }}>
        <input
          style={{ flex: 1, padding: "0.5rem" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button style={{ padding: "0.5rem 1rem" }} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
