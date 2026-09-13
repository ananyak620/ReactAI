import React from 'react';
import { Cpu, Settings, BookOpen, Activity } from 'lucide-react';

export function Header({ isRunning, onOpenSettings, onOpenGuide }) {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon">
          <Cpu size={22} />
        </div>
        <div>
          <h1 className="brand-title">ReAct AI</h1>
        </div>
        <span className="brand-badge">Autonomous Agent</span>
      </div>

      <div className="header-status">
        <div className="status-pill">
          <div className={`pulse-dot ${isRunning ? 'running' : ''}`} />
          <span>{isRunning ? 'Agent Autonomous Loop Active' : 'Agent Ready'}</span>
        </div>

        <button 
          id="btn-open-guide"
          className="btn-icon" 
          onClick={onOpenGuide}
          title="Architecture Guide"
        >
          <BookOpen size={16} />
          <span>How It Works</span>
        </button>

        <button 
          id="btn-open-settings"
          className="btn-icon" 
          onClick={onOpenSettings}
          title="LLM Engine & API Settings"
        >
          <Settings size={16} />
          <span>Config</span>
        </button>
      </div>
    </header>
  );
}
