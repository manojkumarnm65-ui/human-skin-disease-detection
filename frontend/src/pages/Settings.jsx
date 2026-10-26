import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Bell,
  Palette,
  Shield,
  Trash2,
  CheckCircle,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { profileService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  // Preferences
  const [theme, setTheme] = useState('dark-navy');
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    weeklyDigest: false,
    qualityReminders: true,
  });

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordLoading(true);
    try {
      await profileService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPasswordMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.error || 'Failed to change password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError('');
    const trimmed = deletePassword.trim();
    if (!trimmed) {
      setDeleteError('Please enter your current password to confirm account deletion.');
      return;
    }

    setDeleteLoading(true);
    try {
      await profileService.deleteAccount(trimmed);
      setShowDeleteModal(false);
      logout();
      navigate('/login');
    } catch (err) {
      setDeleteError(err.response?.data?.error || 'Failed to delete account. Please verify your password.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '900px' }}>
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-cyan">Security & Config</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginTop: '4px' }}>
          Manage your credentials, notification preferences, and privacy controls.
        </p>
      </div>

      {/* =========================================================================
          SECTION 1: UPDATE PASSWORD
         ========================================================================= */}
      <div className="card-glass" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(8, 201, 245, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--cyan-accent)'
          }}>
            <KeyRound size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Update Password</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ensure your account uses a secure password</span>
          </div>
        </div>

        {passwordMsg.text && (
          <div style={{
            background: passwordMsg.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${passwordMsg.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            color: passwordMsg.type === 'success' ? '#6EE7B7' : '#FCA5A5',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            marginBottom: '20px',
          }}>
            {passwordMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">New Password (min 6)</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Repeat new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={passwordLoading}
              style={{ padding: '10px 24px' }}
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* =========================================================================
          SECTION 2: THEME & DISPLAY PREFERENCES
         ========================================================================= */}
      <div className="card-glass" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(8, 123, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--electric-blue)'
          }}>
            <Palette size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Theme Preferences</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customize your medical interface appearance</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { id: 'dark-navy', label: 'Dark Navy (Default)', desc: 'Clinical navy with glowing electric blue & cyan accents' },
            { id: 'cyber-dark', label: 'High-Contrast Cyber', desc: 'Deep black with intensified neon cyan borders' },
            { id: 'midnight-blue', label: 'Midnight Blue', desc: 'Calibrated low-light hospital monitoring theme' },
          ].map((t) => (
            <div
              key={t.id}
              onClick={() => setTheme(t.id)}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: theme === t.id ? 'rgba(1, 75, 170, 0.35)' : 'rgba(1, 30, 75, 0.8)',
                border: theme === t.id ? '1px solid var(--cyan-accent)' : '1px solid rgba(1, 75, 170, 0.45)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: theme === t.id ? 'var(--cyan-accent)' : '#FFFFFF' }}>
                {t.label}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {t.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: PRIVACY & DATA RETENTION
         ========================================================================= */}
      <div className="card-glass" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10B981'
          }}>
            <Shield size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Data Retention & Privacy Policy</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Compliance and patient data stewardship</span>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          All uploaded skin lesion photographs are stored locally with randomized unique UUID filenames and linked exclusively to your user ID. In accordance with clinical data ethics, images are never sold or pooled into public repositories without explicit research consent. You maintain full ownership and can delete any prediction record or your entire account at any time.
        </p>
      </div>

      {/* =========================================================================
          SECTION 4: DANGER ZONE - DELETE ACCOUNT
         ========================================================================= */}
      <div style={{
        padding: '28px 32px',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(239, 68, 68, 0.06)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F87171' }}>Danger Zone: Delete Account</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px', maxWidth: '500px' }}>
              Permanently remove your account, profile, prediction history, and all stored skin images. This action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              background: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Trash2 size={16} />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div style={modalOverlayStyle}>
          <div className="card-glass" style={{ maxWidth: '440px', width: '100%', padding: '32px' }}>
            <Trash2 size={44} color="#EF4444" style={{ margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ fontSize: '1.3rem', textAlign: 'center', marginBottom: '8px', color: '#FFFFFF' }}>
              Confirm Account Deletion
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', textAlign: 'center', lineHeight: 1.5, marginBottom: '20px' }}>
              Please enter your password below to confirm that you wish to delete your account and all associated prediction telemetry.
            </p>

            {deleteError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px',
                color: '#FCA5A5',
                fontSize: '0.84rem',
                marginBottom: '16px',
              }}>
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteAccount}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Current Account Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showDeletePassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter your current password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    style={{ paddingRight: '44px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                    title={showDeletePassword ? 'Hide password' : 'Show password'}
                  >
                    {showDeletePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => { setShowDeleteModal(false); setDeleteError(''); }}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: '#EF4444',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Permanently Delete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  zIndex: 100,
};

export default Settings;
