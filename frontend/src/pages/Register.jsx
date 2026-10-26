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
  CheckCircle2,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import SmtpSettingsModal from '../components/SmtpSettingsModal';

const Register = () => {
  const { verifyRegistrationOtp } = useAuth();
  const navigate = useNavigate();

  // Multi-step: 1 = Registration details, 2 = Enter OTP code
  const [step, setStep] = useState(1);
  const [showSmtpModal, setShowSmtpModal] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification States
  const [otp, setOtp] = useState('');
  const [otpPreview, setOtpPreview] = useState('');
  const [countdown, setCountdown] = useState(30); // 30 seconds resend timer

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password complexity checks
  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const passedCriteriaCount = Object.values(passwordChecks).filter(Boolean).length;

  // Countdown timer for registration OTP (30 seconds)
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
    if (!passwordChecks.length) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (!passwordChecks.upper) {
      setErrorMsg('Password must contain at least one uppercase letter (A-Z).');
      return;
    }
    if (!passwordChecks.lower) {
      setErrorMsg('Password must contain at least one lowercase letter (a-z).');
      return;
    }
    if (!passwordChecks.number) {
      setErrorMsg('Password must contain at least one number (0-9).');
      return;
    }
    if (!passwordChecks.special) {
      setErrorMsg('Password must contain at least one special character (!@#$%^&* etc.).');
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

      setSuccessMsg(res.data.message || `Verification OTP has been sent to ${email.trim()}.`);
      if (res.data.otp_preview) {
        setOtpPreview(res.data.otp_preview);
      } else {
        setOtpPreview('');
      }
      setStep(2);
      setCountdown(30); // 30 seconds resend timer
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

  // Resend OTP (30s cooldown)
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await authService.sendRegistrationOtp({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        confirm_password: confirmPassword,
      });
      setSuccessMsg(res.data.message || `A fresh verification code was sent to ${email.trim()}.`);
      if (res.data.otp_preview) {
        setOtpPreview(res.data.otp_preview);
      } else {
        setOtpPreview('');
      }
      setCountdown(30); // 30 seconds resend timer
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
      background: 'radial-gradient(ellipse at 70% 50%, rgba(1, 75, 170, 0.45) 0%, rgba(1, 26, 68, 0) 65%), var(--bg-primary)',
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
        boxShadow: 'var(--shadow-lg), 0 0 40px rgba(1, 75, 170, 0.35)',
      }}>
        {/* Left Value Prop */}
        <div style={{
          padding: '48px 40px',
          background: 'linear-gradient(135deg, rgba(1, 75, 170, 0.45) 0%, rgba(1, 26, 68, 0.9) 100%)',
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
          {/* SMTP Quick Setup Action Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(1, 75, 170, 0.15)',
            border: '1px solid rgba(1, 75, 170, 0.4)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px',
            marginBottom: '18px',
            fontSize: '0.82rem',
          }}>
            <span style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} color="#08C9F5" />
              <span>Real Email Delivery:</span>
            </span>
            <button
              type="button"
              onClick={() => setShowSmtpModal(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--cyan-accent)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.8rem'
              }}
            >
              <Settings size={13} />
              <span>Configure Sender Gmail / SMTP</span>
            </button>
          </div>

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
                    placeholder="Min 8 chars, Aa, 123, !@#"
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

                {/* Password Strength & Requirements Checklist */}
                {password.length > 0 && (
                  <div style={{
                    marginTop: '8px',
                    padding: '10px 14px',
                    background: 'rgba(1, 30, 75, 0.85)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(1, 75, 170, 0.55)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}>
                    {/* Strength meter bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Security Strength:</span>
                        <span style={{
                          fontWeight: 700,
                          color: passedCriteriaCount === 5 ? '#10B981' : passedCriteriaCount >= 3 ? 'var(--cyan-accent)' : '#EF4444'
                        }}>
                          {passedCriteriaCount === 5 ? 'Very Strong' : passedCriteriaCount >= 3 ? 'Moderate' : 'Weak'}
                        </span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${(passedCriteriaCount / 5) * 100}%`,
                          background: passedCriteriaCount === 5 ? '#10B981' : 'linear-gradient(90deg, #014BAA 0%, #08C9F5 100%)',
                          transition: 'width 0.3s ease',
                        }} />
                      </div>
                    </div>

                    {/* Criteria checklist */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: passwordChecks.length ? '#10B981' : 'var(--text-muted)' }}>
                        <CheckCircle2 size={13} color={passwordChecks.length ? '#10B981' : '#64748B'} />
                        <span>8+ Characters</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: passwordChecks.upper ? '#10B981' : 'var(--text-muted)' }}>
                        <CheckCircle2 size={13} color={passwordChecks.upper ? '#10B981' : '#64748B'} />
                        <span>Uppercase (A-Z)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: passwordChecks.lower ? '#10B981' : 'var(--text-muted)' }}>
                        <CheckCircle2 size={13} color={passwordChecks.lower ? '#10B981' : '#64748B'} />
                        <span>Lowercase (a-z)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: passwordChecks.number ? '#10B981' : 'var(--text-muted)' }}>
                        <CheckCircle2 size={13} color={passwordChecks.number ? '#10B981' : '#64748B'} />
                        <span>Number (0-9)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: passwordChecks.special ? '#10B981' : 'var(--text-muted)', gridColumn: 'span 2' }}>
                        <CheckCircle2 size={13} color={passwordChecks.special ? '#10B981' : '#64748B'} />
                        <span>Special Symbol (!@#$%^&*...)</span>
                      </div>
                    </div>
                  </div>
                )}
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
              {/* Real Email Dispatch Status Banner */}
              <div
                className="animate-fade-in"
                style={{
                  background: 'linear-gradient(135deg, rgba(8, 123, 255, 0.12) 0%, rgba(8, 201, 245, 0.08) 100%)',
                  border: '1px solid rgba(8, 201, 245, 0.4)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  boxShadow: '0 0 20px rgba(8, 201, 245, 0.2)',
                }}
              >
                <div
                  className="animate-float"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(8, 201, 245, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--cyan-accent)',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                    Verification Code Sent via Email
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    A 6-digit one-time password (OTP) was dispatched to <strong style={{ color: 'var(--cyan-accent)' }}>{email}</strong>. Please check your inbox and spam folder.
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(1, 30, 75, 0.85)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(1, 75, 170, 0.55)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Code sent to: <strong>{email}</strong></span>
                <span style={{ 
                  color: countdown <= 10 ? '#EF4444' : 'var(--cyan-accent)', 
                  fontWeight: 800,
                  background: 'rgba(1, 75, 170, 0.2)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: '1px solid rgba(8, 201, 245, 0.3)'
                }}>
                  ⏱️ {formatTimer(countdown)}
                </span>
              </div>

              {otpPreview && (
                <div style={{
                  background: 'rgba(8, 201, 245, 0.12)',
                  border: '1px dashed var(--cyan-accent)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.84rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Demo / Testing Code: </span>
                    <strong style={{ color: 'var(--cyan-accent)', letterSpacing: '2px', fontSize: '1.05rem', marginLeft: '6px' }}>
                      {otpPreview}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtp(otpPreview)}
                    style={{
                      background: 'rgba(8, 201, 245, 0.2)',
                      border: '1px solid var(--cyan-accent)',
                      color: '#FFFFFF',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

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
                  background: 'linear-gradient(135deg, #014BAA, #08C9F5)',
                  boxShadow: '0 0 20px rgba(1, 75, 170, 0.4)',
                }}
              >
                {loading ? 'Verifying...' : 'Verify OTP & Complete Registration'}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.85rem' }}>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || loading}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: countdown > 0 ? 'var(--text-muted)' : 'var(--cyan-accent)',
                    cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600,
                    opacity: countdown > 0 ? 0.6 : 1
                  }}
                >
                  <RotateCcw size={14} />
                  <span>{countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP Code'}</span>
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

              <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Email not arriving in your inbox?{' '}
                <button
                  type="button"
                  onClick={() => setShowSmtpModal(true)}
                  style={{ background: 'transparent', border: 'none', color: '#08C9F5', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                >
                  Connect your Gmail / SMTP sender
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

      {/* Real SMTP Delivery Setup Modal */}
      <SmtpSettingsModal
        isOpen={showSmtpModal}
        onClose={() => setShowSmtpModal(false)}
      />
    </div>
  );
};

export default Register;
