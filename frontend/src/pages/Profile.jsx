import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Calendar,
  Activity,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Save,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const avatarOptions = [
  { id: 'avatar-1', label: 'Cyan Pulse', bg: 'linear-gradient(135deg, #087BFF, #08C9F5)' },
  { id: 'avatar-2', label: 'Emerald Health', bg: 'linear-gradient(135deg, #10B981, #08C9F5)' },
  { id: 'avatar-3', label: 'Royal Purple', bg: 'linear-gradient(135deg, #8B5CF6, #087BFF)' },
  { id: 'avatar-4', label: 'Sunset Amber', bg: 'linear-gradient(135deg, #F59E0B, #EF4444)' },
];

const Profile = () => {
  const { user, updateUserState } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [fullName, setFullName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar-1');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileService.getProfile();
        setProfileData(res.data);
        setFullName(res.data.user.full_name || '');
        setSelectedAvatar(res.data.user.avatar || 'avatar-1');
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    if (!fullName.trim()) {
      setStatusMsg({ type: 'error', text: 'Full name cannot be blank.' });
      return;
    }

    setSaving(true);
    try {
      const res = await profileService.updateProfile({
        full_name: fullName.trim(),
        avatar: selectedAvatar,
      });
      updateUserState(res.data.user);
      setStatusMsg({ type: 'success', text: 'Profile information updated successfully!' });
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.error || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading user profile..." subtext="Syncing user credentials" />;
  }

  const currentAvatarBg = avatarOptions.find((a) => a.id === selectedAvatar)?.bg || avatarOptions[0].bg;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '900px' }}>
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-cyan">Account Telemetry</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>User Profile</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginTop: '4px' }}>
          Manage your personal details and screening preferences.
        </p>
      </div>

      {statusMsg.text && (
        <div style={{
          background: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          color: statusMsg.type === 'success' ? '#6EE7B7' : '#FCA5A5',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem',
        }}>
          {statusMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Profile Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
      }}>
        {/* Left: Summary Card */}
        <div className="card-glass" style={{ padding: '32px', textAlign: 'center' }}>
          {/* Avatar Graphic */}
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            background: currentAvatarBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 25px rgba(8, 201, 245, 0.35)',
            fontSize: '2.4rem',
            fontWeight: 800,
            color: '#FFFFFF',
          }}>
            {fullName ? fullName[0].toUpperCase() : 'U'}
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>{fullName || 'User'}</h2>
          <div style={{ fontSize: '0.88rem', color: 'var(--cyan-accent)', marginTop: '4px' }}>
            {profileData?.user?.email}
          </div>

          <div style={{
            margin: '24px 0',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-around',
          }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                {profileData?.total_predictions ?? 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Analyses Run</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-success)', fontFamily: 'var(--font-mono)' }}>
                Active
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</div>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Registered on{' '}
            {profileData?.user?.created_at
              ? new Date(profileData.user.created_at).toLocaleDateString()
              : 'Recently'}
          </div>
        </div>

        {/* Right: Update Form Card */}
        <div className="card-glass" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>
            Edit Profile Details
          </h3>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-Only)</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '42px', opacity: 0.6, cursor: 'not-allowed' }}
                  value={profileData?.user?.email || ''}
                  disabled
                />
              </div>
            </div>

            {/* Avatar Theme Selection */}
            <div className="form-group">
              <label className="form-label">Choose Avatar Color Scheme</label>
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                {avatarOptions.map((av) => (
                  <div
                    key={av.id}
                    onClick={() => setSelectedAvatar(av.id)}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: av.bg,
                      cursor: 'pointer',
                      border: selectedAvatar === av.id ? '3px solid #FFFFFF' : '2px solid transparent',
                      boxShadow: selectedAvatar === av.id ? '0 0 15px var(--cyan-accent)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                    title={av.label}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
              style={{ marginTop: '16px', padding: '12px 24px' }}
            >
              <Save size={18} />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
