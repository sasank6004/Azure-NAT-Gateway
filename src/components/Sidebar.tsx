import { useState } from 'react';

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'translate',
    label: 'Translate',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M3 5h12M9 3v2M14.5 21l-2.5-6-2.5 6M12 17h5" />
        <path d="M19 5c0 0-2 4-4 6 1.5.5 2.5 1.5 3 2" />
        <path d="M17 5c0 0 2 4 4 6" />
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'Translation History',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M12 8v4l3 3" />
        <path d="M3.05 11a9 9 0 1 0 .5-4" />
        <path d="M3 3v4h4" />
      </svg>
    ),
  },
  {
    id: 'models',
    label: 'Model Management',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v4c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 9v4c0 1.66 4.03 3 9 3s9-1.34 9-3V9" />
        <path d="M3 13v4c0 1.66 4.03 3 9 3s9-1.34 9-3v-4" />
      </svg>
    ),
  },
  {
    id: 'datasets',
    label: 'Dataset Management',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: 'experiments',
    label: 'Experiments',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M9 3H5l-2 9h18L19 3h-4" />
        <path d="M9 3v5.5a3 3 0 0 0 6 0V3" />
        <path d="M6 21h12" />
        <path d="M12 12v9" />
      </svg>
    ),
  },
  {
    id: 'deployment',
    label: 'Deployment',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'alerts',
    label: 'Alerts',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    badge: 3,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1280);

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300 z-30"
      style={{
        width: collapsed ? '64px' : '220px',
        minWidth: collapsed ? '64px' : '220px',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        boxShadow: '2px 0 12px rgba(79,70,229,0.04)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid #e2e8f0', minHeight: 64 }}>
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} className="w-5 h-5">
            <path d="M5 8l4 4-4 4" />
            <path d="M19 8l-4 4 4 4" />
            <path d="M9 12h6" />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 17, color: '#0f172a', letterSpacing: '-0.3px' }}>
              Trans<span style={{ color: '#4f46e5' }}>Lytics</span>
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}>NLP · MLOps</div>
          </div>
        )}
        <button
          className="ml-auto text-slate-400 hover:text-slate-600 transition-colors"
          onClick={() => setCollapsed(!collapsed)}
          style={{ flexShrink: 0 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            {collapsed ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {!collapsed && (
          <div style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 10px 4px' }}>
            Navigation
          </div>
        )}
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-3 rounded-lg transition-all duration-150 group relative"
              style={{
                padding: collapsed ? '10px 0' : '9px 10px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: isActive ? 'linear-gradient(135deg, rgba(79,70,229,0.12), rgba(124,58,237,0.08))' : 'transparent',
                color: isActive ? '#4f46e5' : '#475569',
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              {isActive && (
                <div
                  className="absolute left-0 top-1 bottom-1 rounded-full"
                  style={{ width: 3, background: 'linear-gradient(180deg, #4f46e5, #7c3aed)' }}
                />
              )}
              <span className={isActive ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-700'}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge && (
                <span
                  className="ml-auto text-white text-xs rounded-full flex items-center justify-center"
                  style={{ width: 18, height: 18, fontSize: 10, fontWeight: 700, background: '#ef4444' }}
                >
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge && (
                <span
                  className="absolute top-1 right-1 rounded-full"
                  style={{ width: 8, height: 8, background: '#ef4444' }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* User profile */}
      <div style={{ borderTop: '1px solid #e2e8f0', padding: '12px 12px 16px' }}>
        <div className="flex items-center gap-3">
          <div
            className="rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
            style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
          >
            AK
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Arjun Kumar</div>
              <div
                className="inline-flex items-center gap-1 rounded-full px-2"
                style={{ fontSize: 10, background: 'rgba(79,70,229,0.1)', color: '#4f46e5', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}
              >
                ADMIN
              </div>
            </div>
          )}
          {!collapsed && (
            <button className="text-slate-400 hover:text-red-500 transition-colors" title="Logout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
