import React from 'react';
import { Wrench, Globe, Search, FileEdit, FileCode, Calculator } from 'lucide-react';

const TOOL_ICONS = {
  web_browser_read: Globe,
  search_web: Search,
  file_writer: FileEdit,
  file_reader: FileCode,
  calculator_eval: Calculator
};

export function ToolViewer({ tools = [] }) {
  return (
    <div>
      <div style={{ marginBottom: '0.85rem' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Autonomous tools currently available for the agent to dispatch during its ReAct cycles:
        </p>
      </div>

      <div className="tools-list">
        {tools.map((tool) => {
          const Icon = TOOL_ICONS[tool.name] || Wrench;
          return (
            <div key={tool.name} className="tool-item">
              <div className="tool-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Icon size={14} color="#00f0ff" />
                  <span className="tool-name">{tool.name}</span>
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  Active
                </span>
              </div>
              <p className="tool-desc">{tool.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
