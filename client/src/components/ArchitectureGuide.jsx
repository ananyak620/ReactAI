import React from 'react';
import { X, Globe, Brain, Zap, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export function ArchitectureGuide({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#fff' }}>
            Autonomous Agent Architecture & Safety Controls
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '0.85rem' }}>
              <Globe size={24} color="var(--accent-cyan)" style={{ margin: '0 auto 0.4rem' }} />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>1. READ</h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Fetches live web pages, queries portals, cross-references dates & pricing.
              </p>
            </div>

            <div style={{ background: 'rgba(129, 140, 248, 0.08)', border: '1px solid rgba(129, 140, 248, 0.25)', borderRadius: '8px', padding: '0.85rem' }}>
              <Brain size={24} color="#a5b4fc" style={{ margin: '0 auto 0.4rem' }} />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#a5b4fc' }}>2. REASON</h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Validates multiple user constraints, rejects add-on upsells, plans optimal steps.
              </p>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '0.85rem' }}>
              <Zap size={24} color="#34d399" style={{ margin: '0 auto 0.4rem' }} />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>3. ACT</h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Pre-fills reservation forms, generates signed e-ticket vouchers, logs execution.
              </p>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', lineHeight: 1.6 }}>
            <h4 style={{ color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '0.4rem' }}>
              Core Enterprise Operational Principles:
            </h4>
            <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><strong>Continuous Autonomous Cycle:</strong> Executes 95% of data gathering and form-filling labor autonomously without requiring constant manual clicks.</li>
              <li><strong>Sensory Web Grounding:</strong> Connects to live portals to eliminate hallucinations and adhere strictly to real pricing and availability.</li>
              <li><strong>Self-Healing Recovery:</strong> Detects HTTP errors or missing elements, reformulates search queries, and switches paths without crashing.</li>
              <li><strong>Human-in-the-Loop (HITL) Gating:</strong> Enforces an absolute stop at irreversible financial actions (e.g. final payment submission), freezing execution state until the human operator signs off.</li>
            </ul>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button className="btn-primary" onClick={onClose} style={{ width: 'auto', padding: '0.5rem 1.25rem' }}>
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
