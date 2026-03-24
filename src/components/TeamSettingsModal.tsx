"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Check } from "lucide-react";

type TeamSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentTeam: string | null;
  inviteCode: string | null;
  onSave: (newTeam: string) => Promise<void> | void;
};

export function TeamSettingsModal({ isOpen, onClose, currentTeam, inviteCode, onSave }: TeamSettingsModalProps) {
  const [teamName, setTeamName] = useState(currentTeam || "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTeamName(currentTeam || "");
      setCopied(false);
    }
  }, [isOpen, currentTeam]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    if (!inviteCode) return;
    const url = `${window.location.origin}/?invite=${encodeURIComponent(inviteCode)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Clipboard access denied or failed", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim() && teamName.trim() !== currentTeam) {
      await onSave(teamName.trim());
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="saas-card modal-card fade-in">
        <div className="modal-header">
          <div className="title-area">
            <h2 className="title">Team Settings</h2>
          </div>
          <button onClick={onClose} className="close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label htmlFor="teamName" className="input-label">Your Team Name</label>
            <input 
              id="teamName"
              type="text" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Design Team"
              className="team-input"
              autoFocus
              maxLength={50}
            />
            <p className="input-hint">This name is used to filter your team's check-ins.</p>
          </div>

          <div className="invite-link-area">
            <label className="input-label">Invite Teammates</label>
            <div className="invite-box">
              <span className="invite-url">{window.location.origin}/?invite={encodeURIComponent(inviteCode || "")}</span>
              <div style={{ position: 'relative' }}>
                <button 
                  type="button" 
                  onClick={handleCopyLink} 
                  className={`copy-btn ${copied ? 'copied' : ''}`}
                  title={copied ? "Copied!" : "Copy link"}
                >
                  {copied ? <Check size={18} className="success-icon" /> : <Copy size={18} />}
                </button>
                {copied && (
                  <div className="tooltip fade-in">Copied!</div>
                )}
              </div>
            </div>
            <p className="input-hint">Anyone with this link can join your team and view the dashboard.</p>
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={!teamName.trim() || teamName.trim() === currentTeam}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-card {
          width: 100%;
          max-width: 440px;
          padding: 2rem;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .title-area {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 6px;
          transition: background 0.2s, color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .input-label {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .team-input {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(0, 0, 0, 0.2);
          color: white;
          font-size: 1.05rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .team-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
        }

        .input-hint {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .cancel-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          padding: 0.75rem 1.25rem;
          border-radius: 999px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .save-btn {
          background: #3b82f6;
          border: none;
          color: white;
          padding: 0.75rem 1.25rem;
          border-radius: 999px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
        }

        .save-btn:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .invite-link-area {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08); /* Divider */
        }

        .invite-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0.5rem 0.5rem 0.5rem 1rem;
          gap: 1rem;
        }

        .invite-url {
          font-family: monospace;
          font-size: 0.85rem;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          opacity: 0.8;
        }

        .copy-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid transparent;
          color: white;
          width: 34px;
          height: 34px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          flex-shrink: 0;
        }

        .copy-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .copy-btn.copied {
          border-color: rgba(74, 222, 128, 0.4);
          background: rgba(74, 222, 128, 0.1);
        }

        .success-icon {
          color: #4ADE80;
        }

        .tooltip {
          position: absolute;
          top: -34px;
          right: 50%;
          transform: translateX(50%);
          background: #0F172A;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tooltip::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 4px 4px 0;
          border-style: solid;
          border-color: #0F172A transparent transparent transparent;
        }

        @keyframes popIn {
          0% { opacity: 0; transform: translateX(50%) translateY(4px) scale(0.9); }
          100% { opacity: 1; transform: translateX(50%) translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
