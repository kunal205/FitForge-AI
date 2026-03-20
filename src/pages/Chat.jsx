import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { callOpenAI } from '../utils/openai';
import MessageBubble from '../components/MessageBubble';
import LoadingDots from '../components/LoadingDots';

const SUGGESTED = [
  'Build me a 4-day workout split for muscle gain',
  'What should I eat to lose 5kg in 2 months?',
  'How do I fix my squat form?',
  'Give me a high protein meal plan under 2000 calories',
];

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function Chat() {
  const { chatHistory, setChatHistory, conversations, activeConversationId, newConversation, updateConversation, loadConversation } = useApp();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  async function sendMessage(text) {
    const userMessage = text || input.trim();
    if (!userMessage || loading) return;

    setInput('');
    setError(null);

    const userMsg = {
      role: 'user',
      content: userMessage,
      timestamp: formatTime(new Date()),
    };

    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setLoading(true);

    try {
      const apiHistory = updatedHistory.map(({ role, content }) => ({ role, content }));
      const response = await callOpenAI(apiHistory);

      const aiMsg = {
        role: 'assistant',
        content: response,
        timestamp: formatTime(new Date()),
      };

      const finalHistory = [...updatedHistory, aiMsg];
      setChatHistory(finalHistory);

      if (activeConversationId) {
        updateConversation(activeConversationId, finalHistory);
      }
    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        setError('API key not configured. Please add your VITE_GROQ_API_KEY to the .env file.');
      } else {
        setError('😤 AI Coach is resting. Try again in a moment.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleNewChat() {
    setChatHistory([]);
    newConversation();
    setSidebarOpen(false);
  }

  return (
    <div
      style={{
        height: '100vh',
        paddingTop: '72px',
        display: 'flex',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 10,
            }}
            className="mobile-sidebar-overlay"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <div
        className={`chat-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
        style={{
          width: '260px',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          height: '100%',
          overflow: 'hidden',
          zIndex: 20,
          transition: 'transform 0.3s ease',
        }}
      >
        {/* New Chat button */}
        <div style={{ padding: '16px' }}>
          <button
            onClick={handleNewChat}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
          >
            + New Chat
          </button>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
          <p style={{ color: 'var(--muted)', fontSize: '11px', letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>
            History
          </p>
          {conversations.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: '13px', fontStyle: 'italic' }}>No conversations yet</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => { loadConversation(conv.id); setSidebarOpen(false); }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: conv.id === activeConversationId ? 'rgba(232,255,59,0.08)' : 'transparent',
                  color: conv.id === activeConversationId ? 'var(--accent)' : 'var(--muted)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '13px',
                  marginBottom: '4px',
                  transition: 'all 0.2s',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                💬 {conv.title}
              </button>
            ))
          )}
        </div>
      </div>

      {/* MAIN CHAT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Top bar */}
        <div
          style={{
            padding: '0 24px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-surface)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mobile-sidebar-btn"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                fontSize: '20px',
                lineHeight: 1,
                display: 'none',
              }}
            >
              ☰
            </button>
            <span
              className="font-display"
              style={{ fontSize: '22px', color: 'var(--text)' }}
            >
              FITFORGE AI COACH
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="pulse-dot" />
            <span className="font-mono" style={{ color: '#22c55e', fontSize: '12px' }}>Online</span>
          </div>
        </div>

        {/* Messages area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {chatHistory.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
              <h2
                className="font-display"
                style={{ fontSize: '28px', color: 'var(--text)', marginBottom: '8px' }}
              >
                ASK ME ANYTHING
              </h2>
              <p style={{ color: 'var(--muted)', marginBottom: '32px', fontSize: '15px' }}>
                Workout plans, nutrition advice, form tips — I've got you covered.
              </p>

              {/* Suggested prompts */}
              <div
                className="suggested-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '10px',
                  width: '100%',
                  maxWidth: '640px',
                  margin: '0 auto',
                }}
              >
                {SUGGESTED.map((prompt) => (
                  <motion.button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    whileHover={{ borderColor: '#E8FF3B', color: 'var(--text)' }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '10px 16px',
                      border: '1px solid var(--border)',
                      borderRadius: '100px',
                      background: 'transparent',
                      color: 'var(--muted)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontFamily: 'DM Sans, sans-serif',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                    }}
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {chatHistory.map((msg, i) => (
                <MessageBubble
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  timestamp={msg.timestamp}
                />
              ))}
              {loading && (
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#000',
                      marginRight: '10px',
                      flexShrink: 0,
                      fontFamily: 'Bebas Neue, sans-serif',
                    }}
                  >
                    AI
                  </div>
                  <div className="card" style={{ padding: '8px 16px' }}>
                    <LoadingDots text="" />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Error UI */}
          {error && (
            <div
              style={{
                textAlign: 'center',
                padding: '20px',
                background: 'rgba(255,69,69,0.08)',
                border: '1px solid rgba(255,69,69,0.2)',
                borderRadius: '12px',
                marginTop: '8px',
              }}
            >
              <p style={{ color: 'var(--accent2)', marginBottom: '8px', fontWeight: 500 }}>
                {error}
              </p>
              {!error.includes('API key') && (
                <button onClick={() => setError(null)} className="btn-ghost" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  Retry
                </button>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-surface)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-end',
              maxWidth: '900px',
              margin: '0 auto',
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about workouts, nutrition, form, recovery..."
              rows={1}
              style={{
                flex: 1,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                borderRadius: '12px',
                padding: '14px 18px',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '15px',
                resize: 'none',
                outline: 'none',
                lineHeight: 1.5,
                minHeight: '44px',
                maxHeight: '120px',
                overflow: 'auto',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
            <motion.button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              whileTap={{ scale: 0.95 }}
              style={{
                background: input.trim() && !loading ? 'var(--accent)' : '#222',
                color: input.trim() && !loading ? '#000' : 'var(--muted)',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 20px',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                fontSize: '20px',
                transition: 'all 0.2s',
                flexShrink: 0,
                minWidth: '44px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ↑
            </motion.button>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '11px', textAlign: 'center', marginTop: '8px', fontFamily: 'DM Mono, monospace' }}>
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

      <style>{`
        .chat-sidebar {
          position: relative;
        }
        @media (max-width: 1024px) {
          .chat-sidebar {
            position: fixed !important;
            top: 72px;
            left: 0;
            bottom: 0;
            width: 280px !important;
            transform: translateX(-100%);
            z-index: 20 !important;
            overflowY: auto;
          }
          .chat-sidebar.sidebar-open {
            transform: translateX(0);
          }
          .mobile-sidebar-btn {
            display: flex !important;
          }
          .mobile-sidebar-overlay {
            display: block;
          }
        }
        @media (min-width: 1025px) {
          .chat-sidebar {
            transform: translateX(0) !important;
            position: relative !important;
          }
          .chat-sidebar-toggle { display: none !important; }
          .mobile-sidebar-overlay { display: none !important; }
          .mobile-sidebar-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}
