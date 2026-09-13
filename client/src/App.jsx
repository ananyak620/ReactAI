import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Plus, Bot, User, Globe, Sparkles, Plane, Laptop, 
  Newspaper, Utensils, CheckCircle2, ChevronDown, ChevronUp,
  FileText, Settings, BookOpen, ExternalLink, RefreshCw, X, ArrowRight,
  Database, ShieldCheck, Lock, AlertTriangle
} from 'lucide-react';
import { SettingsModal } from './components/SettingsModal.jsx';
import { ArchitectureGuide } from './components/ArchitectureGuide.jsx';

const SAMPLE_PROMPTS = [
  {
    icon: Plane,
    title: 'Book Flight (HITL Boundary)',
    prompt: 'Book flight from Bangalore to Patna on 25th October under 6000 INR',
    subtitle: 'Autonomously searches & fills, then halts at Payment Boundary for human authorization'
  },
  {
    icon: Plane,
    title: 'Book Flight (With Clarification)',
    prompt: 'Book a flight from Bangalore to Patna',
    subtitle: 'Agent asks travel date & budget questions, then books'
  },
  {
    icon: Laptop,
    title: 'Laptop Price Comparison',
    prompt: 'Compare 16GB RAM laptops under 70,000 INR across Flipkart, Amazon and Croma',
    subtitle: 'Scrapes e-commerce prices, compares specs & reserves best deal'
  },
  {
    icon: Newspaper,
    title: "Today's Live News",
    prompt: 'Tell me the top breaking news for today',
    subtitle: 'Aggregates live headlines from global news channels'
  }
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSearching, setCurrentSearching] = useState('');
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(null);
  const [artifacts, setArtifacts] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isArtifactsOpen, setIsArtifactsOpen] = useState(false);

  // Persistence for credentials & preferences
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('reactai_agent_config');
      return saved ? JSON.parse(saved) : {
        provider: 'anakin',
        anakinApiKey: '',
        anakinAppId: '',
        model: 'claude-3-7-sonnet',
        autoSummarize: true,
        streamResponses: false
      };
    } catch {
      return { provider: 'anakin', anakinApiKey: '', anakinAppId: '', model: 'claude-3-7-sonnet', autoSummarize: true, streamResponses: false };
    }
  });

  const chatBottomRef = useRef(null);

  useEffect(() => {
    loadArtifacts();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadArtifacts = async () => {
    try {
      const res = await fetch('/api/artifacts');
      const data = await res.json();
      if (data.artifacts) setArtifacts(data.artifacts);
      else if (data.files) setArtifacts(data.files);
    } catch (e) {
      console.warn('Could not load artifacts:', e);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMessage = { role: 'user', content: query };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);
    setCurrentSearching('Autonomous ReAct Agent reasoning and retrieving live data...');

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: newMessages.slice(-5),
          config
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.content,
            intent: data.intent,
            searches: data.searches || [],
            thought: data.thought || '',
            hitlData: data.hitlData || null,
            ragPipeline: data.ragPipeline || null,
            anakinHub: data.anakinHub || null,
            flightData: data.flightData || null,
            productData: data.productData || null,
            restaurantData: data.restaurantData || null,
            newsData: data.newsData || null,
            quickOptions: data.quickOptions || [],
            savedArtifact: data.savedArtifact || null
          }
        ]);
        loadArtifacts();
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `I encountered an issue executing this action: ${data.error || 'Unknown error'}`
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Network error connecting to AI Agent service: ${err.message}`
        }
      ]);
    } finally {
      setIsLoading(false);
      setCurrentSearching('');
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputText('');
    setActiveHistoryIndex(null);
  };

  return (
    <div className="chat-app-layout">
      {/* Sidebar (ChatGPT style) */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand-icon">
            <Bot size={20} />
          </div>
          <span className="sidebar-brand-name">Apex Autonomous AI</span>
        </div>

        <button className="new-chat-btn" onClick={handleNewChat}>
          <Plus size={16} />
          <span>New Task / Mission</span>
        </button>

        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, padding: '0 0.5rem 0.4rem', textTransform: 'uppercase' }}>
          Recent Demonstrations
        </div>

        <div className="chat-history-list">
          {SAMPLE_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              className={`history-item ${activeHistoryIndex === idx ? 'active' : ''}`}
              onClick={() => {
                setActiveHistoryIndex(idx);
                handleSendMessage(p.prompt);
              }}
            >
              <p.icon size={14} color="var(--accent-cyan)" />
              <span>{p.title}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <button 
            className="btn-ghost" 
            style={{ width: '100%', justifyContent: 'flex-start' }}
            onClick={() => {
              loadArtifacts();
              setIsArtifactsOpen(true);
            }}
          >
            <FileText size={15} color="#34d399" />
            <span>Output Files ({artifacts.length})</span>
          </button>

          <button 
            className="btn-ghost" 
            style={{ width: '100%', justifyContent: 'flex-start' }}
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings size={15} />
            <span>Preferences</span>
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-workspace">
        {/* Top Navbar */}
        <header className="chat-topbar">
          <div className="model-selector-pill">
            <Sparkles size={13} />
            <span>Autonomous Enterprise Agent • Multi-Source Verification</span>
          </div>

          <div className="topbar-actions">
            <button className="btn-ghost" onClick={() => setIsGuideOpen(true)}>
              <BookOpen size={14} />
              <span>How It Works</span>
            </button>

            <button 
              className="btn-ghost" 
              onClick={() => {
                loadArtifacts();
                setIsArtifactsOpen(true);
              }}
            >
              <FileText size={14} color="#34d399" />
              <span>Generated Tickets & Files ({artifacts.length})</span>
            </button>
          </div>
        </header>

        {/* Message Stream */}
        <div className="chat-messages-container">
          <div className="messages-inner">
            {messages.length === 0 ? (
              <div className="welcome-hero">
                <div className="welcome-badge">
                  <Globe size={13} /> Autonomous Web Browsing & Action Engine
                </div>
                <h1 className="welcome-title">What would you like me to do?</h1>
                <p className="welcome-desc">
                  Type any real-world goal. Unlike passive chatbots that just give instructions, 
                  this agent <strong>searches live web portals, compares prices & dates, asks for any missing requirements, and executes the action autonomously</strong>.
                </p>

                <div className="sample-prompts-grid">
                  {SAMPLE_PROMPTS.map((sample, idx) => (
                    <div 
                      key={idx} 
                      className="prompt-card"
                      onClick={() => handleSendMessage(sample.prompt)}
                    >
                      <div className="prompt-card-title">
                        <sample.icon size={16} color="var(--accent-cyan)" />
                        <span>{sample.title}</span>
                      </div>
                      <div className="prompt-card-subtitle">
                        "{sample.prompt}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={msg.role === 'user' ? 'message-row-user' : 'message-row-agent'}
                >
                  {msg.role === 'assistant' && (
                    <div className="agent-avatar">
                      <Bot size={18} />
                    </div>
                  )}

                  <div className={msg.role === 'user' ? 'bubble-user' : 'bubble-agent'}>
                    {/* Live Web Searches Pill */}
                    {msg.searches && msg.searches.length > 0 && (
                      <div className="search-pill-container">
                        {msg.searches.map((s, i) => (
                          <div key={i} className="search-pill">
                            <Globe size={12} />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Clean Executive Verification Badge */}
                    {msg.ragPipeline && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.22)',
                        borderRadius: '6px',
                        padding: '0.35rem 0.65rem',
                        marginBottom: '0.85rem',
                        fontSize: '0.74rem',
                        color: '#34d399',
                        fontWeight: 500
                      }}>
                        <ShieldCheck size={13} />
                        <span>Live Verification: Cross-referenced with official portal data</span>
                      </div>
                    )}

                    {/* Agent Thought Accordion */}
                    {msg.thought && (
                      <div className="thought-accordion">
                        <div className="thought-title">
                          <Sparkles size={12} />
                          <span>Action Breakdown & Plan</span>
                        </div>
                        <div>{msg.thought}</div>
                      </div>
                    )}

                    {/* Text Message Content */}
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                    </div>

                    {/* Human-in-the-Loop (HITL) Transaction Boundary Review Card */}
                    {msg.hitlData && (
                      <div className="card-hitl-boundary" style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(15, 23, 42, 0.95))',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        marginTop: '1rem',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontWeight: 700, fontSize: '0.88rem' }}>
                            <Lock size={16} />
                            <span>TRANSACTION BOUNDARY INTERRUPT • HUMAN APPROVAL REQUIRED</span>
                          </div>
                          <span style={{
                            fontSize: '0.72rem',
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#fbbf24',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            fontWeight: 600,
                            border: '1px solid rgba(245, 158, 11, 0.3)'
                          }}>
                            State Graph Frozen
                          </span>
                        </div>

                        <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                          Autonomous agent executed <strong>95%</strong> of read/search/form-filling tasks. It intercepted the irreversible payment step and yielded control to human operator.
                        </div>

                        {/* Multi-Constraint Verification Checklist */}
                        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em', fontWeight: 600 }}>
                            Multi-Constraint Verification Checklist
                          </div>
                          {msg.hitlData.constraints.map((c, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{c.name}:</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#34d399', fontWeight: 600 }}>
                                <CheckCircle2 size={13} /> {c.value}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Interactive Authorization Action Bar */}
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <button
                            onClick={() => handleSendMessage(`Authorize & confirm payment of ₹${msg.hitlData.amountINR} INR`)}
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              color: '#ffffff',
                              border: 'none',
                              padding: '0.75rem 1.25rem',
                              borderRadius: '8px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Lock size={15} />
                            <span>Authorize & Complete Payment (₹{msg.hitlData.amountINR} INR)</span>
                          </button>

                          <button
                            onClick={() => handleSendMessage('Cancel this flight reservation transaction')}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              color: '#f87171',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              padding: '0.75rem 1rem',
                              borderRadius: '8px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              fontSize: '0.82rem'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Interactive Flight Booking Card */}
                    {msg.flightData?.booking && (
                      <div className="card-flight-booking">
                        <div className="flight-card-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#34d399' }}>
                            <CheckCircle2 size={16} />
                            <span>RESERVATION CONFIRMED • PNR: {msg.flightData.booking.pnr}</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                            Zero Human Clicks
                          </span>
                        </div>

                        <div className="flight-route-row">
                          <div className="flight-point">
                            <div className="flight-code">{msg.flightData.booking.airline}</div>
                            <div className="flight-time">{msg.flightData.booking.flightNumber}</div>
                          </div>

                          <div className="flight-middle-arrow">
                            <span>{msg.flightData.booking.route}</span>
                            <div style={{ width: '60px', height: '1px', background: 'var(--border-subtle)', margin: '0.2rem 0' }} />
                            <span>{msg.flightData.booking.departure} ➔ {msg.flightData.booking.arrival}</span>
                          </div>

                          <div className="flight-point" style={{ textAlign: 'right' }}>
                            <div className="flight-code" style={{ color: 'var(--accent-cyan)' }}>
                              ₹{msg.flightData.booking.totalPriceINR}
                            </div>
                            <div className="flight-time" style={{ color: '#34d399' }}>Paid / Reserved</div>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                          <span>E-Ticket: {msg.flightData.booking.eTicketFile}</span>
                          <span style={{ color: 'var(--accent-cyan)' }}>Saved in workspace_outputs/</span>
                        </div>
                      </div>
                    )}

                    {/* Interactive Laptop Price Comparison Table */}
                    {msg.productData?.products && (
                      <div className="comparison-table-wrapper">
                        <table className="comparison-table">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Flipkart</th>
                              <th>Amazon</th>
                              <th>Croma</th>
                              <th>Best Deal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {msg.productData.products.map((item, i) => (
                              <tr key={i}>
                                <td><strong>{item.name}</strong><br /><span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>{item.processor}, {item.ram}</span></td>
                                <td>₹{item.flipkartPrice.toLocaleString('en-IN')}</td>
                                <td>₹{item.amazonPrice.toLocaleString('en-IN')}</td>
                                <td>₹{item.cromaPrice.toLocaleString('en-IN')}</td>
                                <td><span className="badge-best-deal">{item.bestDealOn}: ₹{item.bestPrice.toLocaleString('en-IN')}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Interactive Clarification Quick Chips */}
                    {msg.quickOptions && msg.quickOptions.length > 0 && (
                      <div className="clarification-options-row">
                        {msg.quickOptions.map((opt, i) => (
                          <button
                            key={i}
                            className="chip-choice-btn"
                            onClick={() => handleSendMessage(opt)}
                          >
                            <span>{opt}</span>
                            <ArrowRight size={13} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Live Loading Agent Activity Indicator */}
            {isLoading && (
              <div className="message-row-agent">
                <div className="agent-avatar">
                  <Bot size={18} />
                </div>
                <div className="bubble-agent" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <RefreshCw size={16} className="spin-icon" color="#00f0ff" />
                  <span style={{ color: 'var(--accent-cyan)', fontSize: '0.88rem' }}>
                    {currentSearching || 'Autonomous agent researching web & executing action...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>
        </div>

        {/* Floating Chat Input Bar */}
        <div className="chat-input-wrapper">
          <div className="chat-input-box">
            <textarea
              className="chat-textarea"
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Tell me to book a flight, compare laptops on Amazon/Flipkart, get today's news..."
            />

            <div className="chat-input-footer">
              <div className="input-tool-status">
                <Globe size={13} />
                <span>Autonomous Web Search & Real Action Dispatcher Active</span>
              </div>

              <button
                className="btn-send"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Artifacts Drawer Modal */}
      {isArtifactsOpen && (
        <div className="modal-overlay" onClick={() => setIsArtifactsOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="#34d399" />
                Autonomously Issued Tickets & Artifacts
              </h2>
              <button 
                onClick={() => setIsArtifactsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Files saved directly into <code style={{ color: 'var(--accent-cyan)' }}>workspace_outputs/</code> by the agent:
            </p>

            <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {artifacts.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem 0' }}>No tickets or files issued yet.</p>
              ) : (
                artifacts.map((art) => (
                  <div key={art.filename} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>{art.filename}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {(art.sizeBytes / 1024).toFixed(1)} KB • {new Date(art.modified).toLocaleTimeString()}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      Ready on Disk
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        setConfig={setConfig}
      />

      {/* Architecture Guide Modal */}
      <ArchitectureGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
