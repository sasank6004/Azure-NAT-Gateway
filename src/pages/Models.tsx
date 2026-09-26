import { Card, PageHeader, CustomBadge, Btn, SectionTitle } from '../components/ui';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const models = [
  {
    name: 'T5-v1',
    version: '1.0',
    quality: '84.2%',
    latency: '1.24s',
    status: 'archived',
    created: 'Mar 2026',
    bleu: 0.71,
    rouge: 0.68,
    params: '220M',
    framework: 'PyTorch',
  },
  {
    name: 'Transformer-v1',
    version: '1.0',
    quality: '80.1%',
    latency: '1.48s',
    status: 'archived',
    created: 'Jan 2026',
    bleu: 0.68,
    rouge: 0.65,
    params: '175M',
    framework: 'TensorFlow',
  },
  {
    name: 'T5-v2',
    version: '2.0',
    quality: '92.4%',
    latency: '0.81s',
    status: 'production',
    created: 'Sep 2026',
    bleu: 0.82,
    rouge: 0.79,
    params: '580M',
    framework: 'PyTorch',
  },
];

const scatterData = [
  { name: 'T5-v1', x: 1.24, y: 84.2, fill: '#94a3b8' },
  { name: 'Transformer-v1', x: 1.48, y: 80.1, fill: '#f59e0b' },
  { name: 'T5-v2', x: 0.81, y: 92.4, fill: '#4f46e5' },
];

const statusBadge = (s: string) => {
  if (s === 'production') return <CustomBadge label="Production" status="success" />;
  if (s === 'staging') return <CustomBadge label="Staging" status="info" />;
  return <CustomBadge label="Archived" status="neutral" />;
};

export default function Models() {
  return (
    <div>
      <PageHeader
        title="Model Management"
        subtitle="MLOps model registry — version, compare, and deploy models."
        actions={
          <Btn variant="primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Register Model
          </Btn>
        }
      />

      {/* Production model hero */}
      <Card style={{ padding: '24px 28px', marginBottom: 20, background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', border: 'none' }}>
        <div className="flex items-start justify-between">
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              Current Production Model
            </div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 4 }}>
              T5-v2
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Transformer-based seq2seq model · 580M parameters</div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.3)' }}>
              ● LIVE
            </span>
            <div className="flex gap-6 text-right">
              {[
                { label: 'Quality Score', val: '92.4%' },
                { label: 'BLEU Score', val: '0.82' },
                { label: 'Avg Latency', val: '0.81s' },
                { label: 'Deployed', val: 'Sep 2026' },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 500, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: "'DM Sans',sans-serif" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Model table */}
      <Card style={{ marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <SectionTitle>Model Registry</SectionTitle>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Model Name', 'Version', 'Framework', 'Params', 'Quality', 'BLEU', 'Latency', 'Status', 'Created', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {models.map((m, i) => (
              <tr key={m.name} style={{ borderBottom: '1px solid #f1f5f9', background: m.status === 'production' ? 'rgba(79,70,229,0.02)' : i % 2 === 0 ? '#fff' : '#fafbff' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontFamily: "'DM Sans',sans-serif" }}>{m.name}</div>
                  {m.status === 'production' && (
                    <div style={{ fontSize: 10, color: '#4f46e5', fontWeight: 600 }}>↑ Active Deployment</div>
                  )}
                </td>
                <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#475569' }}>v{m.version}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>{m.framework}</td>
                <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#64748b' }}>{m.params}</td>
                <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: '#10b981' }}>{m.quality}</td>
                <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono',monospace", color: '#7c3aed', fontWeight: 600 }}>{m.bleu}</td>
                <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#64748b' }}>{m.latency}</td>
                <td style={{ padding: '12px 16px' }}>{statusBadge(m.status)}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8' }}>{m.created}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div className="flex items-center gap-1">
                    {['View', 'Compare', m.status !== 'production' ? 'Deploy' : 'Rollback'].map((action) => (
                      <button
                        key={action}
                        style={{
                          fontSize: 11,
                          padding: '4px 10px',
                          borderRadius: 6,
                          background: action === 'Deploy' ? '#dcfce7' : action === 'Rollback' ? '#fee2e2' : '#f1f5f9',
                          color: action === 'Deploy' ? '#166534' : action === 'Rollback' ? '#991b1b' : '#475569',
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Quality vs Latency scatter */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <Card style={{ padding: 20 }}>
          <SectionTitle>Quality vs Latency</SectionTitle>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>Ideal: top-left (high quality, low latency)</div>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="x" name="Latency (s)" type="number" domain={[0.6, 1.7]} label={{ value: 'Latency (s)', position: 'bottom', fontSize: 11, fill: '#94a3b8' }} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="y" name="Quality %" domain={[75, 96]} label={{ value: 'Quality %', angle: -90, position: 'left', fontSize: 11, fill: '#94a3b8' }} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(val, name) => [val, name]} />
              <Legend />
              {scatterData.map((d) => (
                <Scatter key={d.name} name={d.name} data={[d]} fill={d.fill} r={10} />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding: 20 }}>
          <SectionTitle>Model Comparison</SectionTitle>
          <div className="flex flex-col gap-3 mt-2">
            {['Quality Score', 'BLEU Score', 'ROUGE Score', 'Avg Latency'].map((metric) => {
              const vals: Record<string, string[]> = {
                'Quality Score': ['84.2%', '80.1%', '92.4%'],
                'BLEU Score': ['0.71', '0.68', '0.82'],
                'ROUGE Score': ['0.68', '0.65', '0.79'],
                'Avg Latency': ['1.24s', '1.48s', '0.81s'],
              };
              return (
                <div key={metric}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{metric}</div>
                  <div className="flex gap-2">
                    {models.map((m, i) => (
                      <div key={m.name} className="flex-1 rounded-lg p-2 text-center" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>{m.name}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: i === 2 ? '#10b981' : '#475569' }}>
                          {vals[metric][i]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
