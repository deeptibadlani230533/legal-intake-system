import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

const SUGGESTED_QUESTIONS = [
  "What should I do after a car accident?",
  "How does the divorce process work?",
  "What are my rights as a tenant?",
  "How do I file for bankruptcy?",
  "What is the difference between civil and criminal cases?",
  "How long do I have to file a personal injury claim?",
  "What documents do I need for a will?",
  "Can I sue my employer for wrongful termination?",
];

const BotIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="8" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 8V6a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="9" cy="14" r="1.2" fill="currentColor" />
    <circle cx="15" cy="14" r="1.2" fill="currentColor" />
    <path d="M9 17.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: "7px", height: "7px", borderRadius: "50%",
          background: "#94a3b8",
          animation: "bounce 1.2s infinite",
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      flexDirection: isUser ? "row-reverse" : "row",
      alignItems: "flex-start",
      gap: "10px",
      marginBottom: "20px",
    }}>
      {/* Avatar */}
      <div style={{
        width: "34px", height: "34px", borderRadius: "50%",
        background: isUser ? "#1e3a5f" : "#f1f5f9",
        color: isUser ? "#fff" : "#475569",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, border: isUser ? "none" : "1px solid #e2e8f0",
      }}>
        {isUser ? <UserIcon /> : <BotIcon />}
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: "72%",
        background: isUser ? "#1e3a5f" : "#ffffff",
        color: isUser ? "#ffffff" : "#1e293b",
        borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
        padding: "12px 16px",
        fontSize: "14.5px",
        lineHeight: "1.65",
        border: isUser ? "none" : "1px solid #e8edf5",
        boxShadow: isUser ? "0 2px 8px rgba(30,58,95,0.18)" : "0 1px 4px rgba(0,0,0,0.06)",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
        {msg.content === "TYPING" ? <TypingDots /> : msg.content}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your legal assistant. I can help answer general legal questions, explain legal processes, and guide you through common legal situations.\n\nPlease note: I provide general legal information only — not legal advice. For your specific situation, always consult a qualified attorney.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    setInput("");
    setError("");

    const userMsg = { role: "user", content: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages([...updatedMessages, { role: "assistant", content: "TYPING" }]);
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/chat`, {
        question: userText,
      
      });

      const reply = res.data?.response || "Sorry, I couldn't get a response.";
      setMessages([...updatedMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the assistant. Please try again.");
      setMessages(updatedMessages);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      background: "#f8fafc", fontFamily: "'Georgia', serif",
    }}>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        textarea:focus { outline: none; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .suggest-btn:hover { background: #1e3a5f !important; color: #fff !important; border-color: #1e3a5f !important; }
        .send-btn:hover { background: #163354 !important; }
        .send-btn:disabled { background: #94a3b8 !important; cursor: not-allowed; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "#1e3a5f",
        padding: "16px 24px",
        display: "flex", alignItems: "center", gap: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        flexShrink: 0,
      }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff",
        }}>
          <BotIcon />
        </div>
        <div>
          <div style={{ color: "#fff", fontWeight: "600", fontSize: "16px", letterSpacing: "0.01em" }}>
            Legal Assistant
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
            Powered by Gemini · General legal guidance only
          </div>
        </div>
        <div style={{
          marginLeft: "auto",
          width: "9px", height: "9px", borderRadius: "50%",
          background: "#4ade80",
          boxShadow: "0 0 0 3px rgba(74,222,128,0.25)",
        }} />
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "24px 20px 8px",
        maxWidth: "820px", width: "100%",
        margin: "0 auto", boxSizing: "border-box",
      }}>
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}
        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: "10px", padding: "10px 14px",
            color: "#dc2626", fontSize: "13px", marginBottom: "16px",
          }}>
            ⚠ {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <div style={{
          maxWidth: "820px", width: "100%", margin: "0 auto",
          padding: "0 20px 12px", boxSizing: "border-box",
        }}>
          <p style={{
            fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em",
            color: "#94a3b8", marginBottom: "10px", fontFamily: "sans-serif",
          }}>
            Common questions
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                className="suggest-btn"
                onClick={() => sendMessage(q)}
                disabled={loading}
                style={{
                  background: "#fff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "20px",
                  padding: "7px 14px",
                  fontSize: "13px",
                  color: "#334155",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  fontFamily: "sans-serif",
                  lineHeight: "1.3",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{
        borderTop: "1px solid #e2e8f0",
        background: "#fff",
        padding: "14px 20px",
        flexShrink: 0,
      }}>
        <div style={{
          maxWidth: "820px", margin: "0 auto",
          display: "flex", gap: "10px", alignItems: "flex-end",
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a legal question… (Enter to send, Shift+Enter for new line)"
            rows={1}
            style={{
              flex: 1, resize: "none", border: "1.5px solid #e2e8f0",
              borderRadius: "14px", padding: "11px 16px",
              fontSize: "14.5px", fontFamily: "sans-serif",
              lineHeight: "1.5", color: "#1e293b",
              background: "#f8fafc", transition: "border 0.2s",
              maxHeight: "120px", overflowY: "auto",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#1e3a5f")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              background: "#1e3a5f", color: "#fff",
              border: "none", borderRadius: "12px",
              width: "44px", height: "44px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "background 0.18s",
              flexShrink: 0,
            }}
          >
            <SendIcon />
          </button>
        </div>
        <p style={{
          textAlign: "center", fontSize: "11px", color: "#94a3b8",
          margin: "8px 0 0", fontFamily: "sans-serif",
        }}>
          For informational purposes only · Not legal advice
        </p>
      </div>
    </div>
  );
}