import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! 👋 Tôi có thể giúp gì cho bạn?" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const text = input;

    setMessages(prev => [...prev, { from: "user", text }]);
    setInput("");
    setTyping(true); // bật animation

    try {
      const res = await axios.post("http://localhost:8000/api/chat", {
        message: text
      });

      setTyping(false);

      setMessages(prev => [
        ...prev,
        { from: "bot", text: res.data.reply }
      ]);
    } catch (err) {
      setTyping(false);
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "⚠️ Lỗi server!" }
      ]);
    }
  };

  return (
    <>
      {/* 🤖 BUTTON */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "50px",
          height: "50px",
          background: "#000",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          fontSize: "22px",
          cursor: "pointer",
          zIndex: 999
        }}
      >
        🤖
      </div>

      {/* 💬 CHAT BOX */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "280px",
            height: "380px",
            background: "#111",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 999,
            boxShadow: "0 0 20px rgba(0,0,0,0.7)"
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: "10px",
              borderBottom: "1px solid #333",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#fff"
            }}
          >
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "#222",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                🤖
              </div>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                  AI Support
                </div>
                <div style={{ fontSize: "10px", color: "#0f0" }}>
                  ● Online
                </div>
              </div>
            </div>

            <div onClick={() => setOpen(false)} style={{ cursor: "pointer" }}>
              ✖
            </div>
          </div>

          {/* MESSAGES */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto"
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.from === "user" ? "flex-end" : "flex-start",
                  marginBottom: "8px"
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "8px 10px",
                    borderRadius: "10px",
                    background:
                      msg.from === "user" ? "#fff" : "#2a2a2a",
                    color:
                      msg.from === "user" ? "#000" : "#fff",
                    fontSize: "13px"
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* 🤖 TYPING ANIMATION */}
            {typing && (
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <div
                  style={{
                    padding: "8px 10px",
                    borderRadius: "10px",
                    background: "#2a2a2a",
                    display: "flex",
                    gap: "4px"
                  }}
                >
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #333"
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Nhập tin nhắn..."
              style={{
                flex: 1,
                padding: "8px",
                background: "#111",
                color: "#fff",
                border: "none",
                outline: "none",
                fontSize: "13px"
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "8px",
                background: "#fff",
                color: "#000",
                border: "none",
                cursor: "pointer"
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* 🎬 CSS ANIMATION */}
      <style>
        {`
        .dot {
          width: 6px;
          height: 6px;
          background: #fff;
          border-radius: 50%;
          animation: bounce 1.4s infinite;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        `}
      </style>
    </>
  );
};

export default AIChatWidget;