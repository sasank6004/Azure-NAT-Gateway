import type { ReactNode, CSSProperties } from 'react';

// Shared Card
export function Card({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 6px rgba(15,23,42,0.05)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// KPI card
export function KpiCard({
  label,
  value,
  sub,
  accent,
  icon,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  accent: string;
  icon: ReactNode;
  trend?: { dir: 'up' | 'down'; value: string };
}) {
  return (
    <Card style={{ padding: '20px 22px' }}>
      <div className="flex items-start justify-between">
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', fontFamily: "'DM Sans',sans-serif", letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{sub}</div>}
          {trend && (
            <div
              className="flex items-center gap-1 mt-2"
              style={{ fontSize: 12, fontWeight: 600, color: trend.dir === 'up' ? '#10b981' : '#ef4444' }}
            >
              {trend.dir === 'up' ? '↑' : '↓'} {trend.value}
            </div>
          )}
        </div>
        <div
          className="rounded-xl flex items-center justify-center"
          style={{ width: 44, height: 44, background: `${accent}15`, color: accent, flexShrink: 0 }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

// Status Badge
export function Badge({ status }: { status: 'success' | 'warning' | 'error' | 'info' | 'neutral' }) {
  const map = {
    success: { bg: '#dcfce7', color: '#166534', label: 'Success' },
    warning: { bg: '#fef3c7', color: '#92400e', label: 'Warning' },
    error: { bg: '#fee2e2', color: '#991b1b', label: 'Failed' },
    info: { bg: '#e0e7ff', color: '#3730a3', label: 'Info' },
    neutral: { bg: '#f1f5f9', color: '#475569', label: 'Pending' },
  };
  const s = map[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        letterSpacing: '0.03em',
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, marginRight: 5, display: 'inline-block' }} />
      {s.label}
    </span>
  );
}

// CustomBadge with label
export function CustomBadge({ label, status }: { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple' }) {
  const map: Record<string, { bg: string; color: string }> = {
    success: { bg: '#dcfce7', color: '#166534' },
    warning: { bg: '#fef3c7', color: '#92400e' },
    error: { bg: '#fee2e2', color: '#991b1b' },
    info: { bg: '#e0e7ff', color: '#3730a3' },
    neutral: { bg: '#f1f5f9', color: '#475569' },
    purple: { bg: '#f3e8ff', color: '#7e22ce' },
  };
  const s = map[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        letterSpacing: '0.03em',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, marginRight: 5, display: 'inline-block' }} />
      {label}
    </span>
  );
}

// Page header
export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 24, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// Button
export function Btn({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}) {
  const variants = {
    primary: { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none' },
    secondary: { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' },
    ghost: { background: 'transparent', color: '#4f46e5', border: '1px solid #4f46e5' },
    danger: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' },
  };
  const sizes = {
    sm: { padding: '5px 12px', fontSize: 12 },
    md: { padding: '8px 16px', fontSize: 13 },
    lg: { padding: '11px 22px', fontSize: 14 },
  };
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg font-semibold transition-all ${className}`}
      style={{ ...variants[variant], ...sizes[size], cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}
    >
      {children}
    </button>
  );
}

// Section title
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 14, letterSpacing: '-0.2px' }}>
      {children}
    </div>
  );
}

// Health indicator row
export function HealthRow({ label, status }: { label: string; status: 'online' | 'healthy' | 'connected' | 'active' | 'failed' }) {
  const ok = status !== 'failed';
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ fontSize: 13, color: '#475569' }}>{label}</span>
      <span
        className="flex items-center gap-1.5 rounded-full px-3 py-0.5"
        style={{ fontSize: 11, fontWeight: 600, background: ok ? '#dcfce7' : '#fee2e2', color: ok ? '#166534' : '#991b1b' }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: ok ? '#10b981' : '#ef4444', display: 'inline-block' }} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}
