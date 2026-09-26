import { useState } from 'react';
import { Card, PageHeader } from '../components/ui';

type Severity = 'critical' | 'high' | 'medium' | 'low';

interface Alert {
  id: string;
  severity: Severity;
  type: string;
  message: string;
  metric: string;
  timestamp: string;
  action: string;
  resolved: boolean;
}

const initialAlerts: Alert[] = [
  { id: 'ALT-001', severity: 'critical', type: 'Quality Degradation', message: 'Translation quality dropped below threshold. Current BLEU: 0.74 (baseline: 0.82).', metric: 'BLEU: 0.74 → 0.82', timestamp: 'Sep 22, 2026 · 10:32 AM', action: 'Trigger model re-evaluation and compare with T5-v2 on Dataset-v3', resolved: false },
  { id: 'ALT-002', severity: 'high', type: 'Data Drift Detected', message: 'Vocabulary drift score exceeded PSI threshold of 0.15. Current: 0.22.', metric: 'PSI: 0.22 (threshold: 0.15)', timestamp: 'Sep 22, 2026 · 09:14 AM', action: 'Review input distribution and consider dataset refresh', resolved: false },
  { id: 'ALT-003', severity: 'high', type: 'API Latency Spike', message: 'P95 latency exceeded 2.0s during peak hours (12:00–13:00).', metric: 'P95 Latency: 2.1s', timestamp: 'Sep 22, 2026 · 12:48 PM', action: 'Scale up inference replicas to 5 and review batching config', resolved: false },
  { id: 'ALT-004', severity: 'medium', type: 'High Error Rate', message: 'Error rate climbed to 2.4% for EN→ES translations specifically.', metric: 'Error Rate: 2.4% (normal: <1%)', timestamp: 'Sep 21, 2026 · 06:11 PM', action: 'Inspect failed translation logs and check ES tokenizer config', resolved: false },
  { id: 'ALT-005', severity: 'medium', type: 'Model Performance', message: 'Experiment-004 training loss plateaued for 5 consecutive epochs.', metric: 'Val Loss: 0.84 (plateau)', timestamp: 'Sep 21, 2026 · 03:25 PM', action: 'Adjust learning rate schedule or increase regularization', resolved: false },
  { id: 'ALT-006', severity: 'low', type: 'Deployment Notice', message: 'DEP-010 deployment failed during Docker build — image pull timeout.', metric: 'Stage: Docker Build', timestamp: 'Sep 18, 2026 · 04:02 PM', action: 'Retry deployment with increased Docker registry timeout', resolved: true },
];

const sevConfig: Record<Severity, { bg: string; border: string; label: string; dot: string; textColor: string }> = {
  critical: { bg: '#fff1f2', border: '#fca5a5', label: 'Critical', dot: '#ef4444', textColor: '#991b1b' },
  high: { bg: '#fff7ed', border: '#fed7aa', label: 'High', dot: '#f59e0b', textColor: '#92400e' },
  medium: { bg: '#fffbeb', border: '#fde68a', label: 'Medium', dot: '#eab308', textColor: '#854d0e' },
  low: { bg: '#f0fdf4', border: '#bbf7d0', label: 'Low', dot: '#10b981', textColor: '#166534' },
};

export default function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active');

  const resolve = (id: string) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, resolved: true } : a));

  const visible = alerts.filter((a) => filter === 'all' ? true : filter === 'active' ? !a.resolved : a.resolved);
  const counts = { critical: alerts.filter((a) => a.severity === 'critical' && !a.resolved).length, high: alerts.filter((a) => a.severity === 'high' && !a.resolved).length, total: alerts.filter((a) => !a.resolved).length };

  return (
    <div>
      <PageHeader
        title="Alerts & Notifications"
        subtitle="System-wide alerts for quality, performance, and deployment events."
        actions={
          <div className="flex gap-2">
            {(['all', 'active', 'resolved'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  fontSize: 13, padding: '7px 14px', borderRadius: 8, fontWeight: 600, cursor: 'pointer',
                  background: filter === f ? '#4f46e5' : '#f1f5f9',
                  color: filter === f ? '#fff' : '#475569',
                  border: 'none',
                  textTransform: 'capitalize',
                }}
              >
                {f}{f === 'active' && counts.total > 0 && <span style={{ marginLeft: 6, background: '#ef4444', color: '#fff', borderRadius: 99, padding: '0 6px', fontSize: 11 }}>{counts.total}</span>}
              </button>
            ))}
          </div>
        }
      />

      {/* Summary bar */}
      <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Critical', val: counts.critical, bg: '#fee2e2', color: '#991b1b' },
          { label: 'High', val: counts.high, bg: '#fef3c7', color: '#92400e' },
          { label: 'Medium', val: alerts.filter((a) => a.severity === 'medium' && !a.resolved).length, bg: '#fefce8', color: '#854d0e' },
          { label: 'Resolved', val: alerts.filter((a) => a.resolved).length, bg: '#dcfce7', color: '#166534' },
        ].map(({ label, val, bg, color }) => (
          <div key={label} className="rounded-xl p-4 flex items-center gap-3" style={{ background: bg, border: `1px solid ${color}22` }}>
            <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'DM Sans',sans-serif" }}>{val}</div>
            <div style={{ fontSize: 13, color, fontWeight: 600 }}>{label} Alerts</div>
          </div>
        ))}
      </div>

      {/* Alert cards */}
      <div className="flex flex-col gap-3">
        {visible.map((alert) => {
          const cfg = sevConfig[alert.severity];
          return (
            <Card
              key={alert.id}
              style={{
                padding: '18px 20px',
                border: `1px solid ${cfg.border}`,
                background: alert.resolved ? '#fafbff' : cfg.bg,
                opacity: alert.resolved ? 0.8 : 1,
              }}
            >
              <div className="flex items-start gap-4">
                {/* Severity indicator */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: alert.resolved ? '#cbd5e1' : cfg.dot }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: alert.resolved ? '#f1f5f9' : cfg.bg, color: alert.resolved ? '#94a3b8' : cfg.textColor, border: `1px solid ${cfg.border}` }}>
                          {cfg.label}
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#94a3b8' }}>{alert.id}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{alert.type}</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.5 }}>{alert.message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!alert.resolved ? (
                        <button
                          onClick={() => resolve(alert.id)}
                          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
                          style={{ background: '#fff', border: `1px solid ${cfg.border}`, color: cfg.textColor, cursor: 'pointer' }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Resolve
                        </button>
                      ) : (
                        <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>✓ Resolved</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-5 mt-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2} className="w-3.5 h-3.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                      <span style={{ fontSize: 11, color: '#64748b', fontFamily: "'JetBrains Mono',monospace" }}>{alert.metric}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2} className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{alert.timestamp}</span>
                    </div>
                  </div>

                  {!alert.resolved && (
                    <div className="flex items-start gap-2 mt-3 p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.8)' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth={2} className="w-4 h-4 flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 1 }}>Recommended Action</div>
                        <div style={{ fontSize: 12, color: '#475569' }}>{alert.action}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {visible.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>All clear</div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>No {filter} alerts at this time.</div>
          </div>
        )}
      </div>
    </div>
  );
}
