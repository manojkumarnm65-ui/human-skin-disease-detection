import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please verify your email and password.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotMsg('Please enter your email address.');
      return;
    }
    setForgotMsg('If this email is registered, password reset instructions have been dispatched. In this educational project, you can update your password directly in your account Settings once signed in.');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      background: 'radial-gradient(ellipse at 30% 50%, rgba(1, 75, 170, 0.45) 0%, rgba(1, 26, 68, 0) 65%), var(--bg-primary)',
    }}>
      <div style={{
        maxWidth: '1080px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg), 0 0 40px rgba(1, 75, 170, 0.35)',
      }}>
        {/* Left: Medical AI Graphic & Value Prop (Matching Reference 3) */}
        <div style={{
          padding: '48px 40px',
          background: 'linear-gradient(135deg, rgba(1, 75, 170, 0.45) 0%, rgba(1, 26, 68, 0.9) 100%)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        }}>
          <div>
            {/* Brand Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '36px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #087BFF, #08C9F5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(8, 201, 245, 0.4)',
              }}>
                <Activity size={24} color="#FFFFFF" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Human Skin Disease Detection
              </span>
            </Link>

            <span className="badge badge-cyan" style={{ marginBottom: '16px' }}>
              Clinical Intelligence
            </span>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '16px' }}>
              Deep Learning for Skin Lesion Screening
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
              Access AI-assisted predictions, longitudinal screening analytics, and an evidence-based dermatological condition library.
            </p>

            {/* Futuristic Scanning Graphic */}
            <div style={{
              position: 'relative',
              height: '180px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(1, 30, 75, 0.85)',
              border: '1px solid rgba(1, 75, 170, 0.55)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '28px',
            }}>
              <img
                src="/samples/sample_melanoma.jpg"
                alt="Lesion Scanner"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
              />
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--cyan-accent), transparent)',
                boxShadow: '0 0 10px var(--cyan-accent)',
                animation: 'laserScan 2.5s ease-in-out infinite',
              }} />
              <div style={{
                position: 'absolute',
                padding: '6px 14px',
                background: 'rgba(1, 40, 100, 0.95)',
                border: '1px solid var(--cyan-accent)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--cyan-accent)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <ShieldCheck size={14} />
                <span>Deep Feature Analysis Active</span>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '16px',
          }}>
            <Lock size={15} color="var(--cyan-accent)" />
            <span>256-Bit JWT Session Protection & Isolated Storage</span>
          </div>
        </div>

        {/* Right: Modern Login Card (Matching Reference 3) */}
        <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
              Sign in to your SkinCare AI portal to access your dashboard.
            </p>
          </div>

          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              color: '#FCA5A5',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
            }}>
              <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <Link
                  to="/forgot-password"
                  style={{
                    color: 'var(--cyan-accent)',
                    fontSize: '0.84rem',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Forgot Password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '42px', paddingRight: '42px' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--cyan-accent)', width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Remember me on this browser
              </label>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '14px' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '24px 0',
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
            <span style={{ padding: '0 12px' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
          </div>

          {/* Google Login Option */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="btn-outline"
            style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--cyan-accent)', textDecoration: 'none', fontWeight: 600 }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={modalOverlayStyle}>
          <div className="card-glass" style={{ maxWidth: '440px', width: '100%', padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Reset Your Password</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Enter your registered email address to receive password reset instructions.
            </p>

            {forgotMsg && (
              <div style={{
                background: 'rgba(8, 201, 245, 0.1)',
                border: '1px solid rgba(8, 201, 245, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                fontSize: '0.84rem',
                color: 'var(--cyan-accent)',
                marginBottom: '16px'
              }}>
                {forgotMsg}
              </div>
            )}

            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => { setShowForgotModal(false); setForgotMsg(''); }}
                >
                  Close
                </button>
                <button type="submit" className="btn-primary">
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google OAuth Notice Modal */}
      {showGoogleModal && (
        <div style={modalOverlayStyle}>
          <div className="card-glass" style={{ maxWidth: '460px', width: '100%', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--cyan-accent)', marginBottom: '12px' }}>
              <Info size={22} />
              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>Google OAuth Configuration</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Google Sign-In is an optional enterprise integration requiring client credentials in Google Cloud Console.
            </p>
            <div style={{
              background: 'rgba(1, 30, 75, 0.85)',
              border: '1px solid rgba(1, 75, 170, 0.55)',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              marginBottom: '20px',
              fontFamily: 'var(--font-mono)'
            }}>
              To activate: Set GOOGLE_CLIENT_ID in .env and configure OAuth consent screen for http://localhost:5173.
            </div>
            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%' }}
              onClick={() => setShowGoogleModal(false)}
            >
              Understood
            </button>
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

export default Login;
