import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Menu, X, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(2, 11, 28, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(8, 201, 245, 0.15)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        height: '74px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #087BFF 0%, #08C9F5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 18px rgba(8, 201, 245, 0.45)',
          }}>
            <Activity size={24} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          <div>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
            }}>
              Human Skin Disease <span style={{ color: 'var(--cyan-accent)' }}>Detection</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'none',
          gap: '32px',
          alignItems: 'center',
        }} className="desktop-nav">
          <a href="/#home" style={navLinkStyle}>Home</a>
          <a href="/#about" style={navLinkStyle}>About</a>
          <a href="/#features" style={navLinkStyle}>Features</a>
          <Link to="/diseases" style={navLinkStyle}>Diseases</Link>
          <a href="/#contact" style={navLinkStyle}>Contact</a>
        </nav>

        {/* Desktop CTA Buttons */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '14px',
        }} className="desktop-actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              <User size={18} />
              <span>Dashboard ({user?.full_name?.split(' ')[0]})</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-outline" style={{ padding: '9px 18px', fontSize: '0.9rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.9rem' }}>
                Sign Up
                <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
          }}
          className="mobile-toggle"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={26} color="var(--cyan-accent)" /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <a href="/#home" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>Home</a>
          <a href="/#about" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>About</a>
          <a href="/#features" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>Features</a>
          <Link to="/diseases" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>Diseases Library</Link>
          <a href="/#contact" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>Contact</a>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', gap: '12px' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-outline" style={{ flex: 1, textAlign: 'center' }} onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary" style={{ flex: 1, textAlign: 'center' }} onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Responsive media styling */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};

const navLinkStyle = {
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '0.95rem',
  transition: 'color 0.2s ease',
};

const mobileNavLinkStyle = {
  color: '#FFFFFF',
  textDecoration: 'none',
  fontSize: '1.05rem',
  fontWeight: 600,
  padding: '8px 0',
};

export default Navbar;
