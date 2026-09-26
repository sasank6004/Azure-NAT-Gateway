import { Card, PageHeader, SectionTitle, CustomBadge } from '../components/ui';

const stages = [
  { id: 'github', label: 'GitHub Push', icon: '⬡', status: 'completed', time: '14:02', detail: 'main · commit a3f9e2b' },
  { id: 'build', label: 'Build', icon: '⚙', status: 'completed', time: '14:03', detail: '~45s · pnpm build' },
  { id: 'test', label: 'Tests', icon: '✓', status: 'completed', time: '14:04', detail: '38 passed · 0 failed' },
  { id: 'eval', label: 'Model Evaluation', icon: '📊', status: 'completed', time: '14:07', detail: 'BLEU: 0.82 · pass threshold' },
  { id: 'docker', label: 'Docker Build', icon: '🐳', status: 'completed', time: '14:09', detail: 'Image: translytics:2.0' },
  { id: 'deploy', label: 'Deploy', icon: '🚀', status: 'completed', time: '14:11', detail: 'K8s rollout · 3 replicas' },
  { id: 'prod', label: 'Production', icon: '✦', status: 'running', time: '14:12', detail: 'Health: OK · Traffic live' },
];

const history = [
  { id: 'DEP-012', model: 'T5-v2', env: 'Production', trigger: 'Manual', status: 'success', duration: '9m 42s', date: 'Sep 22, 2026 14:12' },
  { id: 'DEP-011', model: 'T5-v2', env: 'Staging', trigger: 'Push', status: 'success', duration: '8m 18s', date: 'Sep 21, 2026 09:34' },
  { id: 'DEP-010', model: 'T5-v1', env: 'Production', trigger: 'Manual', status: 'failed', duration: '5m 12s', date: 'Sep 18, 2026 16:00' },
  { id: 'DEP-009', model: 'T5-v1', env: 'Staging', trigger: 'Push', status: 'success', duration: '8m 55s', date: 'Sep 15, 2026 11:20' },
  { id: 'DEP-008', model: 'Transformer-v1', env: 'Staging', trigger: 'Push', status: 'failed', duration: '3m 07s', date: 'Apr 3, 2026 08:45' },
];

const statusColor = (s: string) => ({ success: '#10b981', failed: '#ef4444', running: '#4f46e5' })[s] ?? '#94a3b8';
const stageStatusBg = (s: string) => ({
  completed: { bg: '#dcfce7', color: '#166534', label: 'Done' },
  running: { bg: '#e0e7ff', color: '#3730a3', label: 'Live' },
  pending: { bg: '#f1f5f9', color: '#94a3b8', label: 'Waiting' },
  failed: { bg: '#fee2e2', color: '#991b1b', label: 'Failed' },
})[s] ?? { bg: '#f1f5f9', color: '#94a3b8', label: s };

export default function Deployment() {
  return (
    <div>
      <PageHeader
        title="Deployment & CI/CD"
        subtitle="Live pipeline status for TransLytics model deployment."
        actions={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.41" /></svg>
              Rollback
            </button>
            <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              Deploy Now
            </button>
          </div>
        }
      />

      <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {/* Pipeline stages */}
        <Card style={{ padding: 24 }}>
          <SectionTitle>Pipeline Stages — DEP-012</SectionTitle>
          <div className="relative">
            {stages.map((stage, i) => {
              const s = stageStatusBg(stage.status);
              return (
                <div key={stage.id} className="flex gap-4">
                  {/* Left — icon + connector */}
                  <div className="flex flex-col items-center" style={{ width: 36 }}>
                    <div
                      className="rounded-xl flex items-center justify-center text-sm flex-shrink-0 z-10"
                      style={{ width: 36, height: 36, background: s.bg, color: s.color, fontWeight: 700, border: `2px solid ${s.color}22`, position: 'relative' }}
                    >
                      {stage.status === 'running' ? (
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#4f46e5', animation: 'pulse 1.5s ease-in-out infinite' }} />
                      ) : stage.status === 'completed' ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth={2.5} className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : stage.status === 'failed' ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth={2.5} className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      ) : '·'}
                    </div>
                    {i < stages.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 20, background: stage.status === 'completed' ? '#10b981' : '#e2e8f0', margin: '2px 0' }} />
                    )}
                  </div>
                  {/* Right — details */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{stage.label}</div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: "'JetBrains Mono',monospace" }}>{stage.time}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: s.bg, color: s.color }}>{s.label}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{stage.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Current deployment info */}
        <div className="flex flex-col gap-4">
          <Card style={{ padding: 20 }}>
            <SectionTitle>Current Deployment</SectionTitle>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Model', val: 'T5-v2', color: '#4f46e5' },
                { label: 'Version', val: '2.0', color: '#0f172a' },
                { label: 'Environment', val: 'Production', color: '#10b981' },
                { label: 'Docker Image', val: 'translytics:2.0', color: '#7c3aed' },
                { label: 'Replicas', val: '3 / 3 running', color: '#10b981' },
                { label: 'Last Deploy', val: 'Sep 22, 2026', color: '#64748b' },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex justify-between items-center py-1.5" style={{ borderBottom: '1px solid #f8fafc' }}>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: ['Model', 'Docker Image'].includes(label) ? "'JetBrains Mono',monospace" : 'inherit' }}>{val}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding: 20 }}>
            <SectionTitle>Health Status</SectionTitle>
            <div className="flex flex-col gap-2">
              {[
                { label: 'API Server', status: 'Healthy' },
                { label: 'Translation Model', status: 'Healthy' },
                { label: 'Load Balancer', status: 'Healthy' },
                { label: 'Redis Cache', status: 'Healthy' },
              ].map(({ label, status }) => (
                <div key={label} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid #f8fafc' }}>
                  <span style={{ fontSize: 12, color: '#475569' }}>{label}</span>
                  <span className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5" style={{ fontSize: 11, background: '#dcfce7', color: '#166534', fontWeight: 600 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Deployment history */}
      <Card style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <SectionTitle>Deployment History</SectionTitle>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Deploy ID', 'Model', 'Environment', 'Trigger', 'Duration', 'Status', 'Date', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '9px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((row, i) => (
              <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbff' }}>
                <td style={{ padding: '11px 16px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#4f46e5', fontWeight: 700 }}>{row.id}</td>
                <td style={{ padding: '11px 16px', fontWeight: 600, color: '#0f172a' }}>{row.model}</td>
                <td style={{ padding: '11px 16px' }}><CustomBadge label={row.env} status={row.env === 'Production' ? 'success' : 'info'} /></td>
                <td style={{ padding: '11px 16px', fontSize: 12, color: '#64748b' }}>{row.trigger}</td>
                <td style={{ padding: '11px 16px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#64748b' }}>{row.duration}</td>
                <td style={{ padding: '11px 16px' }}>
                  <CustomBadge label={row.status === 'success' ? 'Success' : 'Failed'} status={row.status === 'success' ? 'success' : 'error'} />
                </td>
                <td style={{ padding: '11px 16px', fontSize: 12, color: '#94a3b8' }}>{row.date}</td>
                <td style={{ padding: '11px 16px' }}>
                  <button style={{ fontSize: 11, padding: '3px 9px', borderRadius: 5, background: '#f1f5f9', color: '#475569', fontWeight: 600, cursor: 'pointer', border: 'none' }}>View Logs</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.2)} }`}</style>
    </div>
  );
}
