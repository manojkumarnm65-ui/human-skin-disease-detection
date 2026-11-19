import React, { useState, useEffect } from 'react';
import {
  Mail,
  KeyRound,
  Server,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  ShieldCheck,
  Send,
  Sparkles,
  Info
} from 'lucide-react';
import { authService } from '../services/api';

const SmtpSettingsModal = ({ isOpen, onClose, onConfigured }) => {
  if (!isOpen) return null;

  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpServer, setSmtpServer] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(587);
  const [testRecipient, setTestRecipient] = useState('');

  const [loading, setLoading] = useState(false);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleDirectTestEmail = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!testRecipient.trim()) {
      setErrorMsg('Please enter a recipient email address below to send the test email.');
      return;
    }
    setTestEmailLoading(true);
    try {
      const res = await authService.sendTestEmail(testRecipient.trim());
      setSuccessMsg(res.data.message || `Test email successfully delivered to ${testRecipient.trim()}!`);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to deliver test email. Please check your credentials or recipient address.');
    } finally {
      setTestEmailLoading(false);
    }
  };

  // Fetch current SMTP status on mount
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setStatusLoading(true);
    try {
      const res = await authService.getSmtpStatus();
      setStatus(res.data);
      if (res.data.smtp_server) setSmtpServer(res.data.smtp_server);
      if (res.data.smtp_port) setSmtpPort(res.data.smtp_port);
    } catch (err) {
      console.warn('Could not load SMTP status:', err);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSaveAndTest = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!smtpUsername.trim()) {
      setErrorMsg('Please enter your sender email address.');
      return;
    }
    if (!smtpPassword.trim()) {
      setErrorMsg('Please enter your 16-character Google App Password (or SMTP password).');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.configureSmtp({
        smtp_username: smtpUsername.trim(),
        smtp_password: smtpPassword.trim(),
        smtp_server: smtpServer.trim(),
        smtp_port: parseInt(smtpPort, 10),
        test_recipient: testRecipient.trim() || smtpUsername.trim()
      });

      setSuccessMsg(res.data.message || 'SMTP verified and configured successfully!');
      fetchStatus();
      if (onConfigured) onConfigured(smtpUsername.trim());
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to connect to SMTP server. Please verify credentials.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div
        className="card-glass"
        style={{
          maxWidth: '560px',
          width: '100%',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(1, 75, 170, 0.4)',
          border: '2px solid #014BAA',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          background: 'linear-gradient(135deg, #014BAA 0%, #012866 100%)',
          borderBottom: '2px solid #014BAA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(8, 201, 245, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(8, 201, 245, 0.4)'
            }}>
              <Mail size={20} color="#08C9F5" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Connect SMTP Real Email Delivery
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Dispatch verification OTPs directly to any specified email inbox
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#CBD5E1',
              borderRadius: 'var(--radius-sm)',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '24px' }}>
          {/* Current Status Indicator */}
          <div style={{
            background: status?.configured ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${status?.configured ? '#10B981' : '#F59E0B'}`,
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {status?.configured ? (
                <CheckCircle2 size={18} color="#10B981" />
              ) : (
                <AlertTriangle size={18} color="#F59E0B" />
              )}
              <span>
                Delivery Status:{' '}
                <strong style={{ color: status?.configured ? '#10B981' : '#F59E0B' }}>
                  {status?.configured ? `Connected (${status.sender_email})` : 'Not Connected (Credentials Needed)'}
                </strong>
              </span>
            </div>
          </div>

          {/* Quick 3-Step Gmail Instructions */}
          <div style={{
            background: 'rgba(1, 75, 170, 0.12)',
            border: '1px solid rgba(1, 75, 170, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: '20px',
            fontSize: '0.82rem',
            lineHeight: 1.5,
          }}>
            <div style={{ fontWeight: 700, color: 'var(--cyan-accent)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={16} />
              <span>How to get your free 16-character Gmail App Password:</span>
            </div>
            <ol style={{ paddingLeft: '18px', margin: 0, color: '#CBD5E1' }}>
              <li style={{ marginBottom: '4px' }}>
                Open{' '}
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#08C9F5', textDecoration: 'underline', fontWeight: 600 }}
                >
                  myaccount.google.com/apppasswords <ExternalLink size={12} style={{ display: 'inline' }} />
                </a>{' '}
                (requires 2-Step Verification turned ON).
              </li>
              <li style={{ marginBottom: '4px' }}>
                Type App name <strong>"SkinCare AI"</strong> and click <strong>Create</strong>.
              </li>
              <li>
                Google displays a <strong>16-letter password</strong> (e.g. <code style={{ color: '#FDE68A' }}>abcd efgh ijkl mnop</code>). Paste it below!
              </li>
            </ol>
          </div>

          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid #EF4444',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              color: '#FCA5A5',
              fontSize: '0.84rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid #10B981',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              color: '#A7F3D0',
              fontSize: '0.84rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSaveAndTest} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>
                Sender Gmail Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '38px', fontSize: '0.9rem' }}
                  placeholder="e.g. yourname@gmail.com"
                  value={smtpUsername}
                  onChange={(e) => setSmtpUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>
                16-Character Google App Password
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '38px', fontSize: '0.9rem', letterSpacing: '2px' }}
                  placeholder="abcd efgh ijkl mnop"
                  value={smtpPassword}
                  onChange={(e) => setSmtpPassword(e.target.value)}
                  required
                />
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Note: Spaces are automatically stripped. Do not use your primary personal password.
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '4px', display: 'block' }}>
                  SMTP Server Host
                </label>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                  value={smtpServer}
                  onChange={(e) => setSmtpServer(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '4px', display: 'block' }}>
                  Port
                </label>
                <input
                  type="number"
                  className="form-input"
                  style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>
                Test Recipient Email (Optional)
              </label>
              <input
                type="email"
                className="form-input"
                style={{ fontSize: '0.88rem', padding: '9px 12px' }}
                placeholder="Where to send test verification email (defaults to sender)"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
              />
            </div>

            {status?.configured && (
              <button
                type="button"
                onClick={handleDirectTestEmail}
                disabled={testEmailLoading}
                className="btn-outline"
                style={{
                  width: '100%',
                  padding: '11px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderColor: 'var(--cyan-accent)',
                  color: 'var(--cyan-accent)',
                  background: 'rgba(8, 201, 245, 0.08)'
                }}
              >
                <Send size={15} />
                <span>{testEmailLoading ? 'Sending Test Email...' : 'Send Live Test Email to Recipient'}</span>
              </button>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: 800,
                marginTop: '8px',
                background: 'linear-gradient(135deg, #014BAA, #08C9F5)',
                boxShadow: '0 0 20px rgba(1, 75, 170, 0.4)',
              }}
            >
              <Send size={16} />
              <span>{loading ? 'Verifying & Testing Delivery...' : 'Save Credentials & Test Connection'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.85)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  zIndex: 120,
};

export default SmtpSettingsModal;
