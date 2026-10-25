import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { authService } from '../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Multi-step states: 1 = Enter Email, 2 = Enter OTP & New Password, 3 = Success
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [otpPreview, setOtpPreview] = useState('');
  const [countdown, setCountdown] = useState(600); // 10 minutes

  // Countdown timer for OTP expiry
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

  // Step 1: Send Recovery OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.sendForgotPasswordOtp(email.trim());
      setSuccessMsg(res.data.message || 'Recovery code sent successfully!');
      if (res.data.otp_preview) {
        setOtpPreview(res.data.otp_preview);
      }
      setStep(2);
      setCountdown(600);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to send recovery code. Please check your email.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otp.trim()) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccessMsg(res.data.message || 'Password reset successfully!');
      setStep(3);
    } catch (err) {
      const msg = err.response?.data?.error || 'Password reset failed. Please check the code.';
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
      const res = await authService.sendForgotPasswordOtp(email.trim());
      setSuccessMsg('New recovery code sent to your email.');
      if (res.data.otp_preview) {
        setOtpPreview(res.data.otp_preview);
      }
      setCountdown(600);
    } catch (err) {
      setErrorMsg('Could not resend code. Please wait a moment and retry.');
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
      background: 'radial-gradient(ellipse at 50% 40%, rgba(8, 123, 255, 0.18) 0%, rgba(2, 11, 28, 0) 70%), var(--bg-primary)',
      fontFamily: "'Times New Roman', Times, serif"
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '40px 36px',
        boxShadow: 'var(--shadow-lg), 0 0 40px rgba(8, 201, 245, 0.15)',
        position: 'relative'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #087BFF 0%, #08C9F5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(8, 201, 245, 0.4)',
            }}>
              <Activity size={24} color="#FFFFFF" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Human Skin Disease Detection
            </span>
          </Link>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Secure Account Recovery & Password Reset
          </p>
        </div>

        {/* Error Alert */}
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
            STEP 1: ENTER EMAIL
           ===================================================================== */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.9rem', marginBottom: '6px', display: 'block' }}>
                Registered Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '42px', fontSize: '0.95rem' }}
                  placeholder="Enter your registered email (e.g. demo@skincare.ai)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                fontSize: '1rem',
                fontWeight: 700,
                marginTop: '6px'
              }}
            >
              {loading ? 'Sending Recovery Code...' : 'Send Recovery OTP'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <Link to="/login" style={{ color: 'var(--cyan-accent)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={16} />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}

        {/* =====================================================================
            STEP 2: ENTER OTP & NEW PASSWORD
           ===================================================================== */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Quick Demonstration Simulation Banner */}
            {otpPreview && (
              <div
                onClick={() => setOtp(otpPreview)}
                style={{
                  background: 'rgba(8, 201, 245, 0.12)',
                  border: '1px dashed var(--cyan-accent)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  color: 'var(--cyan-accent)',
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 0 15px rgba(8, 201, 245, 0.2)',
                }}
                title="Click to auto-fill verification code"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} />
                  <span>Demo OTP: <strong>{otpPreview}</strong></span>
                </div>
                <span style={{ fontSize: '0.78rem', textDecoration: 'underline', fontWeight: 700 }}>
                  Click to Auto-fill
                </span>
              </div>
            )}

            <div style={{
              background: 'rgba(2, 11, 28, 0.6)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(8, 201, 245, 0.2)',
              fontSize: '0.84rem',
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
              <label className="form-label" style={{ fontSize: '0.9rem', marginBottom: '6px', display: 'block' }}>
                6-Digit Verification Code (OTP)
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  maxLength={6}
                  className="form-input"
                  style={{ paddingLeft: '42px', fontSize: '1.15rem', letterSpacing: '4px', fontWeight: 800, textAlign: 'center' }}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.9rem', marginBottom: '6px', display: 'block' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '42px', paddingRight: '42px', fontSize: '0.95rem' }}
                  placeholder="Enter at least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
              <label className="form-label" style={{ fontSize: '0.9rem', marginBottom: '6px', display: 'block' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '42px', fontSize: '0.95rem' }}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                fontSize: '1rem',
                fontWeight: 700,
                marginTop: '6px'
              }}
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
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
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        {/* =====================================================================
            STEP 3: SUCCESS CONFIRMATION
           ===================================================================== */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid #10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
            }}>
              <CheckCircle2 size={36} color="#10B981" />
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              Password Reset Successful!
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '24px' }}>
              Your account password has been updated securely. You can now log into Human Skin Disease Detection with your new credentials.
            </p>

            <Link
              to="/login"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                textDecoration: 'none'
              }}
            >
              <span>Proceed to Login</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
