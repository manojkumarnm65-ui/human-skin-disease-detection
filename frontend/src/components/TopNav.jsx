import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronDown,
  CheckCircle,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TopNav = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/history?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const notifications = [
    {
      id: 1,
      title: 'AI Screening Engine Active',
      desc: 'Deep learning classification pipeline is operational.',
      time: 'Just now',
      type: 'info'
    },
    {
      id: 2,
      title: 'Sun Protection Reminder',
      desc: 'UV index is elevated today. Ensure SPF 30+ application.',
      time: '2h ago',
      type: 'tip'
    }
  ];

  return (
    <header style={{
      height: '74px',
      background: 'rgba(6, 23, 45, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      {/* Left: Sidebar toggle + Global Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, maxWidth: '500px' }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Toggle Navigation Menu"
        >
          <Menu size={22} />
        </button>

        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%' }}>
          <Search
            size={18}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search prediction history or conditions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 42px',
              background: 'rgba(2, 11, 28, 0.6)',
              border: '1px solid rgba(8, 201, 245, 0.15)',
              borderRadius: 'var(--radius-full)',
              color: '#FFFFFF',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--cyan-accent)';
              e.target.style.boxShadow = '0 0 12px rgba(8, 201, 245, 0.25)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(8, 201, 245, 0.15)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </form>
      </div>

      {/* Right: Notifications & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            style={{
              background: 'rgba(8, 123, 255, 0.1)',
              border: '1px solid var(--border-color)',
              color: 'var(--cyan-accent)',
              cursor: 'pointer',
              padding: '10px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'all 0.2s ease',
            }}
            title="Notifications"
          >
            <Bell size={19} />
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--cyan-accent)',
              boxShadow: '0 0 8px var(--cyan-accent)',
            }} />
          </button>

          {notificationsOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '320px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              zIndex: 100,
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#FFFFFF' }}>Notifications</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--cyan-accent)', cursor: 'pointer' }}>Mark all read</span>
              </div>
              <div>
                {notifications.map((n) => (
                  <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '12px' }}>
                    <Info size={18} color="var(--cyan-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>{n.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{n.desc}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            style={{
              background: 'rgba(8, 123, 255, 0.08)',
              border: '1px solid var(--border-color)',
              padding: '6px 14px 6px 8px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#FFFFFF',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #087BFF 0%, #08C9F5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: '#FFFFFF',
              boxShadow: '0 0 10px rgba(8, 201, 245, 0.3)',
            }}>
              {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
            </div>
            <div style={{ textAlign: 'left', display: 'none' }} className="user-name-label">
              <div style={{ fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.2 }}>{user?.full_name || 'User'}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--cyan-accent)', textTransform: 'capitalize' }}>{user?.role || 'Patient'}</div>
            </div>
            <ChevronDown size={16} color="var(--text-muted)" />
          </button>

          {profileDropdownOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '52px',
              width: '210px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '8px 0',
              zIndex: 100,
            }}>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>{user?.full_name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
              </div>
              <Link
                to="/profile"
                onClick={() => setProfileDropdownOpen(false)}
                style={dropdownItemStyle}
              >
                <UserIcon size={16} />
                <span>My Profile</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setProfileDropdownOpen(false)}
                style={dropdownItemStyle}
              >
                <Settings size={16} />
                <span>Settings</span>
              </Link>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '4px 0' }} />
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                  navigate('/login');
                }}
                style={{ ...dropdownItemStyle, color: '#F87171', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .user-name-label { display: block !important; }
        }
      `}</style>
    </header>
  );
};

const dropdownItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 16px',
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  fontSize: '0.88rem',
  fontWeight: 500,
  transition: 'background 0.2s ease, color 0.2s ease',
};

export default TopNav;
