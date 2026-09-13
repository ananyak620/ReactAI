import React, { useState, useEffect } from 'react';
import { FileText, Download, RefreshCw, Eye } from 'lucide-react';

export function ArtifactViewer({ onSelectArtifact }) {
  const [artifacts, setArtifacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchArtifacts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/artifacts');
      const data = await res.json();
      if (data.success) {
        setArtifacts(data.files || []);
      }
    } catch (err) {
      console.error('Failed to load artifacts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtifacts();
  }, []);

  const handleViewFile = async (filename) => {
    try {
      const res = await fetch(`/api/artifacts/${filename}`);
      const data = await res.json();
      if (data.success) {
        setSelectedFile(filename);
        setSelectedContent(data.content);
      }
    } catch (err) {
      console.error('Failed to read file:', err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Output files created by the agent:
        </p>
        <button 
          onClick={fetchArtifacts} 
          className="btn-icon" 
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
          title="Refresh generated files"
        >
          <RefreshCw size={12} className={isLoading ? 'spin-icon' : ''} />
          Refresh
        </button>
      </div>

      {artifacts.length === 0 ? (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center', padding: '1.5rem 0' }}>
          No artifacts generated yet. Run a mission with file generation to see reports saved here.
        </p>
      ) : (
        <div className="artifact-list">
          {artifacts.map((art) => (
            <div 
              key={art.filename} 
              className="artifact-card"
              onClick={() => handleViewFile(art.filename)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} color="#34d399" />
                <div>
                  <div className="artifact-name">{art.filename}</div>
                  <div className="artifact-meta">
                    {(art.sizeBytes / 1024).toFixed(1)} KB • {new Date(art.modified).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <Eye size={14} color="var(--text-muted)" />
            </div>
          ))}
        </div>
      )}

      {selectedContent && (
        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.4)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>{selectedFile}</span>
            <button 
              onClick={() => setSelectedContent(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Close
            </button>
          </div>
          <pre style={{ fontSize: '0.75rem', maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)' }}>
            {selectedContent}
          </pre>
        </div>
      )}
    </div>
  );
}
