import React from 'react';
import { X, Key, Cpu, ShieldCheck, Zap, Layers } from 'lucide-react';

export function SettingsModal({ isOpen, onClose, config, setConfig }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} color="var(--accent-cyan)" />
            Agent Engine & Model Settings
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
              Intelligence Core / Reasoning Provider:
            </label>
            <select
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                padding: '0.65rem 0.8rem',
                borderRadius: '6px',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem'
              }}
              value={config.provider || 'anakin'}
              onChange={(e) => setConfig({ ...config, provider: e.target.value })}
            >
              <option value="anakin">⚡ Frontier Reasoning Hub (Claude 3.7 Sonnet / GPT-4o)</option>
              <option value="builtin">🚀 Autonomous Enterprise Engine (High Speed Built-in)</option>
              <option value="gemini">Google Gemini 2.0 / 1.5 Pro</option>
              <option value="openai">Direct OpenAI (GPT-4o)</option>
            </select>
          </div>

          {/* Anakin Configuration Fields */}
          {(config.provider === 'anakin' || !config.provider) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                  <Key size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                  Anakin.ai API Key:
                </label>
                <input
                  type="password"
                  placeholder="Paste your Anakin.ai API Key here..."
                  value={config.anakinApiKey || ''}
                  onChange={(e) => setConfig({ ...config, anakinApiKey: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    padding: '0.65rem 0.8rem',
                    borderRadius: '6px',
                    outline: 'none',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                  Target Frontier Model (via Anakin Hub):
                </label>
                <select
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    padding: '0.55rem 0.8rem',
                    borderRadius: '6px',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                  value={config.model || 'claude-3-7-sonnet'}
                  onChange={(e) => setConfig({ ...config, model: e.target.value })}
                >
                  <option value="claude-3-7-sonnet">Claude 3.7 Sonnet (High Reasoning Planner)</option>
                  <option value="gpt-4o">GPT-4o (Fast Multimodal)</option>
                  <option value="meta-llama-3-70b">Llama 3 70B (Open Weights)</option>
                </select>
              </div>
            </div>
          )}

          {/* Standard API Key for other providers */}
          {config.provider !== 'anakin' && config.provider !== 'builtin' && (
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                <Key size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                Provider API Key:
              </label>
              <input
                type="password"
                placeholder={config.provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                value={config.apiKey || ''}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  padding: '0.65rem 0.8rem',
                  borderRadius: '6px',
                  outline: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          )}

          <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '0.3rem' }}>
              <Zap size={15} /> Autonomous High-Reliability Mode Active
            </p>
            The system operates with active live web verification, multi-constraint policy checks, and automated transaction safety gating. All high-risk decisions require explicit human authorization.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button className="btn-primary" onClick={onClose} style={{ width: 'auto', padding: '0.55rem 1.4rem' }}>
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
