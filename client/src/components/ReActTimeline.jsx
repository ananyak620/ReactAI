import React, { useEffect, useRef } from 'react';
import { Brain, Zap, Eye, CheckCircle2, Bot, Loader2, Sparkles, FileText } from 'lucide-react';

export function ReActTimeline({ steps, isRunning, currentAction, finalAnswer, metrics }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [steps, currentAction, finalAnswer]);

  return (
    <section className="glass-panel timeline-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <Bot size={18} color="#00f0ff" />
          Autonomous ReAct Trace
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {metrics && (
            <>
              <span>Steps: <strong style={{ color: 'var(--accent-cyan)' }}>{steps.length}</strong></span>
              {metrics.durationMs && <span>Duration: <strong style={{ color: 'var(--accent-emerald)' }}>{(metrics.durationMs / 1000).toFixed(1)}s</strong></span>}
            </>
          )}
        </div>
      </div>

      <div className="timeline-steps">
        {steps.length === 0 && !isRunning && !finalAnswer && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Sparkles size={28} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Autonomous Execution Stream Ready
            </h3>
            <p style={{ fontSize: '0.85rem', maxWidth: '420px', lineHeight: 1.5 }}>
              Choose a mission preset or enter your custom goal on the left, then click 
              <strong> Launch Autonomous Agent</strong>. The system will autonomously read the web, reason, and react until completion.
            </p>
          </div>
        )}

        {steps.map((step, idx) => (
          <div key={idx} className="step-card">
            <div className="step-header">
              <div className="step-badge">
                <span style={{ 
                  background: 'rgba(0, 240, 255, 0.15)', 
                  padding: '0.15rem 0.45rem', 
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)' 
                }}>
                  STEP #{step.stepNumber || idx + 1}
                </span>
                <span>{step.action || 'Reasoning'}</span>
              </div>
              <div className="step-time">
                {step.durationMs ? `${step.durationMs}ms` : ''}
              </div>
            </div>

            <div className="step-body">
              {/* 1. REASON / THOUGHT */}
              {step.thought && (
                <div className="phase-block phase-thought">
                  <div className="phase-title">
                    <Brain size={14} />
                    <span>Reasoning (Thought)</span>
                  </div>
                  <div className="phase-content">
                    {step.thought}
                  </div>
                </div>
              )}

              {/* 2. REACT / ACTION */}
              {step.action && step.action !== 'Finish' && (
                <div className="phase-block phase-action">
                  <div className="phase-title">
                    <Zap size={14} />
                    <span>Action Taken: {step.action}</span>
                  </div>
                  {step.actionInput && (
                    <pre className="code-snippet">
                      {typeof step.actionInput === 'object' 
                        ? JSON.stringify(step.actionInput, null, 2) 
                        : String(step.actionInput)}
                    </pre>
                  )}
                </div>
              )}

              {/* 3. READ / OBSERVATION */}
              {step.observation && (
                <div className="phase-block phase-observation">
                  <div className="phase-title">
                    <Eye size={14} />
                    <span>Observation (Read & Sensory Feedback)</span>
                  </div>
                  <div className="phase-content">
                    {renderObservationContent(step.observation)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Live Active Running Step Indicator */}
        {isRunning && (
          <div className="step-card active-step">
            <div className="step-header">
              <div className="step-badge">
                <Loader2 size={14} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Agent Actively Operating</span>
              </div>
            </div>
            <div className="step-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontStyle: 'italic' }}>
                {currentAction || 'Analyzing environment and computing next autonomous action...'}
              </p>
            </div>
          </div>
        )}

        {/* FINAL ANSWER SYNTHESIS */}
        {finalAnswer && (
          <div className="final-answer-card">
            <div className="final-answer-title">
              <CheckCircle2 size={20} />
              Mission Completed Autonomously
            </div>
            <div className="final-answer-content" style={{ whiteSpace: 'pre-wrap' }}>
              {finalAnswer}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </section>
  );
}

function renderObservationContent(obs) {
  if (typeof obs === 'string') return obs;

  if (obs?.results && Array.isArray(obs.results)) {
    return (
      <div>
        <p style={{ marginBottom: '0.4rem', fontWeight: 600 }}>Web Search Results ({obs.results.length} sources):</p>
        <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem' }}>
          {obs.results.map((r, i) => (
            <li key={i} style={{ marginBottom: '0.3rem' }}>
              <strong>{r.title}</strong>: {r.snippet} 
              <br />
              <a href={r.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)', wordBreak: 'break-all' }}>
                {r.url}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (obs?.title && obs?.contentSnippet) {
    return (
      <div>
        <p><strong>Page Title:</strong> {obs.title}</p>
        {obs.headings && obs.headings.length > 0 && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>Headings:</strong> {obs.headings.slice(0, 4).join(' • ')}
          </p>
        )}
        <div style={{ marginTop: '0.4rem', maxHeight: '180px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px' }}>
          <p style={{ fontSize: '0.8rem', lineHeight: 1.45 }}>{obs.contentSnippet}</p>
        </div>
      </div>
    );
  }

  if (obs?.filename && obs?.sizeBytes) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <FileText size={18} color="#34d399" />
        <div>
          <p style={{ fontWeight: 600 }}>Generated Output Artifact: {obs.filename}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>File size: {obs.sizeBytes} bytes | Saved to workspace_outputs/</p>
        </div>
      </div>
    );
  }

  return <pre className="code-snippet">{JSON.stringify(obs, null, 2)}</pre>;
}
