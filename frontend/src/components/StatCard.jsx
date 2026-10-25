import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'cyan', badgeText }) => {
  const colorMap = {
    cyan: {
      accent: 'var(--cyan-accent)',
      bg: 'rgba(8, 201, 245, 0.1)',
      border: 'rgba(8, 201, 245, 0.3)',
      glow: 'rgba(8, 201, 245, 0.25)',
    },
    green: {
      accent: '#10B981',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.3)',
      glow: 'rgba(16, 185, 129, 0.25)',
    },
    red: {
      accent: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.3)',
      glow: 'rgba(239, 68, 68, 0.25)',
    },
    amber: {
      accent: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.3)',
      glow: 'rgba(245, 158, 11, 0.25)',
    },
    blue: {
      accent: '#087BFF',
      bg: 'rgba(8, 123, 255, 0.1)',
      border: 'rgba(8, 123, 255, 0.3)',
      glow: 'rgba(8, 123, 255, 0.25)',
    }
  };

  const theme = colorMap[color] || colorMap.cyan;

  return (
    <div
      className="card-glass"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent light stripe */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
            {value !== undefined && value !== null ? value : '--'}
          </div>
        </div>

        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: theme.bg,
          border: `1px solid ${theme.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 15px ${theme.glow}`,
        }}>
          {Icon && <Icon size={24} color={theme.accent} />}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>{subtitle || 'Updated in real-time'}</span>
        {badgeText && (
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            background: theme.bg,
            color: theme.accent,
            border: `1px solid ${theme.border}`
          }}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
