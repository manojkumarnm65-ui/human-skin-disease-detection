import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  RotateCcw,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const Register = () => {
  const { verifyRegistrationOtp } = useAuth();
  const navigate = useNavigate();

  // Multi-step: 1 = Registration details, 2 = Enter OTP code
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification States
  const [otp, setOtp] = useState('');
  const [otpPreview, setOtpPreview] = useState('');
  const [countdown, setCountdown] = useState(600); // 10 minutes

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Countdown timer for registration OTP
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  // Step 1: Submit details & send OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }
    if (!acceptTerms) {
      setErrorMsg('Please accept the Terms of Service to proceed.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.sendRegistrationOtp({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        confirm_password: confirmPassword,
      });

      setSuccessMsg(res.data.message || 'Verification OTP dispatched!');
      if (res.data.otp_preview) {
        setOtpPreview(res.data.otp_preview);
      }
      setStep(2);
      setCountdown(600);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to dispatch verification code. Please check your email.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and finalize registration
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otp.trim()) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      await verifyRegistrationOtp({
        email: email.trim(),
        otp: otp.trim(),
        full_name: fullName.trim(),
        password,
      });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid verification code. Please verify and retry.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await authService.sendRegistrationOtp({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        confirm_password: confirmPassword,
      });
      setSuccessMsg('A new verification code has been dispatched.');
      if (res.data.otp_preview) {
        setOtpPreview(res.data.otp_preview);
      }
      setCountdown(600);
    } catch (err) {
      setErrorMsg('Failed to resend code. Please wait a moment and retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      background: 'radial-gradient(ellipse at 70% 50%, rgba(8, 123, 255, 0.15) 0%, rgba(2, 11, 28, 0) 65%), var(--bg-primary)',
      fontFamily: "'Times New Roman', Times, serif"
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
        boxShadow: 'var(--shadow-lg), 0 0 40px rgba(8, 201, 245, 0.15)',
      }}>
        {/* Left Value Prop */}
        <div style={{
          padding: '48px 40px',
          background: 'linear-gradient(135deg, rgba(8, 123, 255, 0.2) 0%, rgba(2, 11, 28, 0.8) 100%)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '36px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #087BFF 0%, #08C9F5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(8, 201, 245, 0.45)',
              }}>
                <Activity size={24} color="#FFFFFF" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Human Skin Disease Detection
              </span>
            </Link>

            <span className="badge badge-cyan" style={{ marginBottom: '14px' }}>
              Two-Factor Secured Registration
            </span>

            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px' }}>
              Create Your Clinical AI Account
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Join clinicians and dermatological researchers. Access real-world camera inference, 18-condition neural models, and instant laboratory report generation.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                'Instant OTP Email Verification for patient security',
                'Deep Convolutional Neural Network (ResNet50 Ensemble)',
                '18 Dermatological Conditions & ABCDE Morphological Scoring',
                'One-Click Clinical Laboratory Dossier Export (Print / PDF)',
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={18} color="var(--cyan-accent)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', color: '#CBD5E1' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            marginTop: '36px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            Human Skin Disease Detection • Medical Decision Support System
          </div>
        </div>

        {/* Right Form Card */}
        <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
              {step === 1 ? 'Sign Up' : 'Verify Email (OTP)'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              {step === 1
                ? 'Fill in your details to receive an OTP verification code'
                : `Enter the 6-digit code sent to ${email}`}
            </p>
          </div>

          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              color: '#FCA5A5',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.88rem',
              marginBottom: '20px',
            }}>
              <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* =====================================================================
              STEP 1: REGISTRATION DETAILS FORM
             ===================================================================== */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.86rem', marginBottom: '6px', display: 'block' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '42px', fontSize: '0.92rem' }}
                    placeholder="e.g. Dr. Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.86rem', marginBottom: '6px', display: 'block' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: '42px', fontSize: '0.92rem' }}
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.86rem', marginBottom: '6px', display: 'block' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    style={{ paddingLeft: '42px', paddingRight: '42px', fontSize: '0.92rem' }}
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.86rem', marginBottom: '6px', display: 'block' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    style={{ paddingLeft: '42px', fontSize: '0.92rem' }}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  style={{ marginTop: '4px', accentColor: 'var(--cyan-accent)', cursor: 'pointer' }}
                />
                <label htmlFor="terms" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 1.4 }}>
                  I agree to the Terms of Service & Privacy Policy for educational and clinical decision support use.
                </label>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  marginTop: '10px'
                }}
              >
                {loading ? 'Sending Verification Code...' : 'Send OTP Verification Code'}
              </button>
            </form>
          )}

          {/* =====================================================================
              STEP 2: OTP VERIFICATION VIEW
             ===================================================================== */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Quick Demonstration Simulation Banner */}
              {otpPreview && (
                <div
                  onClick={() => setOtp(otpPreview)}
                  style={{
                    background: 'rgba(8, 201, 245, 0.12)',
                    border: '1px dashed var(--cyan-accent)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    color: 'var(--cyan-accent)',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 0 15px rgba(8, 201, 245, 0.25)',
                  }}
                  title="Click to auto-fill verification code"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} />
                    <span>Demo OTP Code: <strong>{otpPreview}</strong></span>
                  </div>
                  <span style={{ fontSize: '0.78rem', textDecoration: 'underline', fontWeight: 700 }}>
                    Click to Auto-fill
                  </span>
                </div>
              )}

              <div style={{
                background: 'rgba(2, 11, 28, 0.6)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(8, 201, 245, 0.2)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Code sent to: <strong>{email}</strong></span>
                <span style={{ color: countdown < 60 ? '#EF4444' : 'var(--cyan-accent)', fontWeight: 700 }}>
                  {formatTimer(countdown)}
                </span>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>
                  Enter 6-Digit OTP Code
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    className="form-input"
                    style={{
                      paddingLeft: '44px',
                      fontSize: '1.4rem',
                      letterSpacing: '6px',
                      fontWeight: 800,
                      textAlign: 'center'
                    }}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #10B981, #08C9F5)',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                }}
              >
                {loading ? 'Verifying...' : 'Verify OTP & Complete Registration'}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.85rem' }}>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  style={{ background: 'transparent', border: 'none', color: 'var(--cyan-accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RotateCcw size={14} />
                  <span>Resend OTP</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <ArrowLeft size={14} />
                  <span>Edit Details</span>
                </button>
              </div>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--cyan-accent)', textDecoration: 'none', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
