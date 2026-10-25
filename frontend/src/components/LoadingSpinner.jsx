import React from 'react';

const LoadingSpinner = ({ message = 'Analyzing image...', subtext = 'Running convolutional neural network inference' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      gap: '24px',
      textAlign: 'center',
    }}>
      {/* Concentric glowing HUD spinner */}
      <div style={{ position: 'relative', width: '90px', height: '90px' }}>
        {/* Outer Ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          border: '3px solid transparent',
          borderTopColor: 'var(--cyan-accent)',
          borderBottomColor: 'var(--electric-blue)',
          borderRadius: '50%',
          animation: 'hudRotate 1.8s linear infinite',
          boxShadow: '0 0 20px rgba(8, 201, 245, 0.4)',
        }} />

        {/* Inner Ring */}
        <div style={{
          position: 'absolute',
          inset: '12px',
          border: '2px solid transparent',
          borderRightColor: '#FFFFFF',
          borderLeftColor: 'var(--cyan-accent)',
          borderRadius: '50%',
          animation: 'hudRotate 1.2s reverse linear infinite',
        }} />

        {/* Center glowing pulse core */}
        <div style={{
          position: 'absolute',
          inset: '30px',
          background: 'radial-gradient(circle, var(--cyan-accent) 0%, rgba(8, 123, 255, 0.2) 70%, transparent 100%)',
          borderRadius: '50%',
          animation: 'pulseGlow 1.5s ease-in-out infinite',
        }} />
      </div>

      <div>
        <div style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: '#FFFFFF',
          letterSpacing: '-0.01em',
        }}>
          {message}
        </div>
        {subtext && (
          <div style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            marginTop: '6px',
            fontFamily: 'var(--font-mono)',
          }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
