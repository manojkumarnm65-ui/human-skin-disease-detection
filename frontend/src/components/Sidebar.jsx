import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  History,
  BookOpen,
  User,
  Settings,
  LogOut,
  Activity,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Image', path: '/upload', icon: UploadCloud },
    { name: 'Prediction History', path: '/history', icon: History },
    { name: 'Diseases Info', path: '/diseases', icon: BookOpen },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside style={{
      width: isCollapsed ? '80px' : '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Brand Header */}
      <div style={{
        height: '74px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        padding: isCollapsed ? '0' : '0 20px',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #087BFF 0%, #08C9F5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 15px rgba(8, 201, 245, 0.4)',
          }}>
            <Activity size={22} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          {!isCollapsed && (
            <span style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
            }}>
              Human Skin <span style={{ color: 'var(--cyan-accent)' }}>Disease</span>
            </span>
          )}
        </div>

        {/* Collapse toggle button */}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Collapse Sidebar"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      {isCollapsed && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
          <button
            onClick={() => setIsCollapsed(false)}
            style={{
              background: 'rgba(8, 201, 245, 0.1)',
              border: '1px solid var(--border-color)',
              color: 'var(--cyan-accent)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
            }}
            title="Expand Sidebar"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <nav style={{
        flex: 1,
        padding: '20px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                background: isActive ? 'linear-gradient(90deg, rgba(8, 123, 255, 0.25) 0%, rgba(8, 201, 245, 0.15) 100%)' : 'transparent',
                border: isActive ? '1px solid rgba(8, 201, 245, 0.4)' : '1px solid transparent',
                boxShadow: isActive ? '0 0 15px rgba(8, 201, 245, 0.2)' : 'none',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s ease',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
              })}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon size={20} color={isCollapsed ? 'var(--cyan-accent)' : undefined} />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Safety Notice in Sidebar */}
      {!isCollapsed && (
        <div style={{
          margin: '12px 16px',
          padding: '12px',
          background: 'rgba(8, 123, 255, 0.08)',
          border: '1px solid rgba(8, 201, 245, 0.15)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cyan-accent)', fontWeight: 600, marginBottom: '4px' }}>
            <ShieldAlert size={15} />
            <span>Educational Use</span>
          </div>
          <p style={{ lineHeight: 1.4 }}>AI screening assistance. Not a certified clinical diagnosis.</p>
        </div>
      )}

      {/* User Info & Logout Button */}
      <div style={{
        padding: '16px 12px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            color: '#F87171',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            width: '100%',
          }}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
