import React, { useState } from 'react';
import { Play, Square, Compass, Link2, Sliders, Globe, Search } from 'lucide-react';

const SAMPLE_URLS = [
  { label: 'Wikipedia (AI)', url: 'https://en.wikipedia.org/wiki/Artificial_intelligence' },
  { label: 'Wikipedia (Agents)', url: 'https://en.wikipedia.org/wiki/Intelligent_agent' },
  { label: 'ArXiv (ReAct Paper)', url: 'https://arxiv.org/abs/2210.03629' }
];

const PRESETS = [
  {
    title: '✈️ Book Flight: Bangalore to Patna (< ₹6000)',
    url: '',
    goal: 'Book flight from Bangalore to Patna on 25th October under 6000 INR'
  },
  {
    title: '✈️ Flight: Delhi to Mumbai under ₹5000',
    url: '',
    goal: 'Book flight from Delhi to Mumbai on 15th November under 5000 INR'
  },
  {
    title: '🌐 Autonomous Web Research & Report',
    url: '',
    goal: 'Search the web for the latest developments in Autonomous AI Agents, read key articles, synthesize findings, and write an intelligence report file.'
  },
  {
    title: '📄 Read Specific Webpage & Analyze',
    url: 'https://en.wikipedia.org/wiki/Intelligent_agent',
    goal: 'Read the target webpage, analyze the core agent architectures and decision functions, and generate an executive summary report.'
  }
];

export function MissionControl({
  goal,
  setGoal,
  targetUrl,
  setTargetUrl,
  maxSteps,
  setMaxSteps,
  isRunning,
  onStartAgent,
  onAbortAgent
}) {
  const handleSelectPreset = (p) => {
    setGoal(p.goal);
    if (setTargetUrl) {
      setTargetUrl(p.url || '');
    }
  };

  return (
    <aside className="glass-panel mission-control-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <Compass size={18} color="#00f0ff" />
          Mission Control
        </h2>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Human Input</span>
      </div>

      {/* Preset Missions */}
      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
          Quick Mission Presets:
        </label>
        <div className="mission-presets">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              className={`preset-chip ${goal === p.goal ? 'active' : ''}`}
              onClick={() => handleSelectPreset(p)}
              disabled={isRunning}
            >
              <span>{p.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Human Input 1: Optional Direct Target URL */}
      <div style={{ marginBottom: '0.85rem' }}>
        <label 
          htmlFor="target-url-input"
          style={{ 
            fontSize: '0.78rem', 
            color: 'var(--accent-cyan)', 
            fontWeight: 600, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.35rem',
            marginBottom: '0.35rem' 
          }}
        >
          <Link2 size={13} />
          Target Web URL (Optional):
        </label>
        <input
          id="target-url-input"
          type="url"
          value={targetUrl || ''}
          onChange={(e) => setTargetUrl && setTargetUrl(e.target.value)}
          placeholder="e.g. https://en.wikipedia.org/wiki/Artificial_intelligence"
          disabled={isRunning}
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.55rem 0.8rem',
            color: 'var(--text-main)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            outline: 'none',
            marginBottom: '0.35rem'
          }}
        />

        {/* Quick URL chips */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {SAMPLE_URLS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTargetUrl && setTargetUrl(s.url)}
              disabled={isRunning}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                padding: '0.15rem 0.4rem',
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Human Input 2: Goal / Instructions */}
      <div style={{ marginBottom: '0.85rem' }}>
        <label 
          htmlFor="agent-goal-input"
          style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}
        >
          Task Instructions / Goal:
        </label>
        <textarea
          id="agent-goal-input"
          className="goal-textarea"
          rows={3}
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Describe what the agent should investigate, analyze, or generate..."
          disabled={isRunning}
        />
      </div>

      {/* Workflow Trigger Explanation */}
      <div style={{ 
        background: 'rgba(0, 240, 255, 0.04)', 
        border: '1px solid rgba(0, 240, 255, 0.15)', 
        borderRadius: '6px', 
        padding: '0.6rem 0.75rem', 
        marginBottom: '0.85rem',
        fontSize: '0.74rem',
        lineHeight: 1.45,
        color: 'var(--text-muted)'
      }}>
        {targetUrl?.trim() ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)' }}>
            <Globe size={14} />
            <span>Workflow starts by directly fetching & reading this URL.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8' }}>
            <Search size={14} />
            <span>Workflow starts by searching the web to discover relevant pages.</span>
          </div>
        )}
      </div>

      {/* Max Steps Slider */}
      <div className="param-group">
        <div className="param-label">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sliders size={14} /> Max Autonomous Steps:
          </span>
          <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{maxSteps}</span>
        </div>
        <input
          id="max-steps-slider"
          type="range"
          min="2"
          max="12"
          value={maxSteps}
          onChange={(e) => setMaxSteps(parseInt(e.target.value, 10))}
          className="slider"
          disabled={isRunning}
        />
      </div>

      {/* Launch / Abort Action */}
      <div style={{ marginTop: 'auto' }}>
        {!isRunning ? (
          <button
            id="btn-launch-agent"
            className="btn-primary"
            onClick={onStartAgent}
            disabled={!goal.trim() && !targetUrl?.trim()}
          >
            <Play size={18} fill="#04101e" />
            Launch Autonomous Agent
          </button>
        ) : (
          <button
            id="btn-abort-agent"
            className="btn-danger"
            onClick={onAbortAgent}
          >
            <Square size={16} fill="currentColor" />
            Abort Execution
          </button>
        )}
      </div>
    </aside>
  );
}
