import { Card, PageHeader, SectionTitle, CustomBadge, Btn } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const versions = [
  { v: 'v1', samples: 40000, quality: '81.2%', date: 'Jan 2026', status: 'archived', langs: 4 },
  { v: 'v2', samples: 85000, quality: '87.6%', date: 'May 2026', status: 'archived', langs: 6 },
  { v: 'v3', samples: 125000, quality: '92.8%', date: 'Sep 2026', status: 'active', langs: 8 },
];

const langData = [
  { lang: 'EN-HI', pairs: 28000 },
  { lang: 'EN-TE', pairs: 19500 },
  { lang: 'EN-TA', pairs: 17000 },
  { lang: 'EN-FR', pairs: 16000 },
  { lang: 'EN-DE', pairs: 15000 },
  { lang: 'EN-KN', pairs: 14000 },
  { lang: 'EN-ML', pairs: 9500 },
  { lang: 'EN-ES', pairs: 6000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 14px', fontSize: 12 }}>
        <div style={{ color: '#64748b', marginBottom: 2 }}>{label}</div>
        <div style={{ color: '#4f46e5', fontWeight: 700 }}>{payload[0].value.toLocaleString()} pairs</div>
      </div>
    );
  }
  return null;
};

export default function Datasets() {
  return (
    <div>
      <PageHeader
        title="Dataset Management"
        subtitle="DVC-inspired dataset versioning and lineage tracking."
        actions={<Btn variant="primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>Upload Dataset</Btn>}
      />

      {/* Current dataset hero */}
      <Card style={{ padding: '22px 26px', marginBottom: 20 }}>
        <div className="flex items-start justify-between">
          <div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Current Dataset</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Translation Dataset</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Parallel sentence pairs across 8 language pairs · DVC tracked</div>
          </div>
          <div className="flex gap-8">
            {[
              { label: 'Current Version', val: 'v3', mono: true, color: '#4f46e5' },
              { label: 'Total Samples', val: '125,000', mono: true, color: '#0f172a' },
              { label: 'Languages', val: '8 pairs', mono: false, color: '#0f172a' },
              { label: 'Last Updated', val: 'Sep 2026', mono: false, color: '#0f172a' },
            ].map(({ label, val, mono, color }) => (
              <div key={label} className="text-right">
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: mono ? "'JetBrains Mono',monospace" : "'DM Sans',sans-serif" }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex gap-4 mt-5 pt-4" style={{ borderTop: '1px solid #f1f5f9' }}>
          {[
            { label: 'Training Set', val: '100,000', pct: '80%' },
            { label: 'Validation Set', val: '12,500', pct: '10%' },
            { label: 'Test Set', val: '12,500', pct: '10%' },
          ].map(({ label, val, pct }) => (
            <div key={label} className="flex items-center gap-3">
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{label}:</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', fontFamily: "'JetBrains Mono',monospace" }}>{val}</div>
              <CustomBadge label={pct} status="info" />
            </div>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>✓ DVC tracked</span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>·</span>
            <span style={{ fontSize: 12, color: '#4f46e5', fontWeight: 600 }}>SHA: a3f9e2b</span>
          </div>
        </div>
      </Card>

      {/* Table + chart */}
      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <Card style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <SectionTitle>Version History</SectionTitle>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Version', 'Samples', 'Langs', 'Quality', 'Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {versions.map((row) => (
                <tr key={row.v} style={{ borderBottom: '1px solid #f1f5f9', background: row.status === 'active' ? 'rgba(79,70,229,0.02)' : '#fff' }}>
                  <td style={{ padding: '11px 14px', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: '#4f46e5' }}>{row.v}</td>
                  <td style={{ padding: '11px 14px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{row.samples.toLocaleString()}</td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: '#64748b' }}>{row.langs}</td>
                  <td style={{ padding: '11px 14px', fontWeight: 700, color: '#10b981', fontFamily: "'JetBrains Mono',monospace" }}>{row.quality}</td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: '#94a3b8' }}>{row.date}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <CustomBadge label={row.status === 'active' ? 'Active' : 'Archived'} status={row.status === 'active' ? 'success' : 'neutral'} />
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <div className="flex gap-1">
                      {['View', 'Compare', row.status !== 'active' ? 'Restore' : ''].filter(Boolean).map((a) => (
                        <button key={a} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 5, background: a === 'Restore' ? '#dcfce7' : '#f1f5f9', color: a === 'Restore' ? '#166534' : '#475569', fontWeight: 600, cursor: 'pointer', border: 'none' }}>{a}</button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card style={{ padding: 20 }}>
          <SectionTitle>Language Pair Distribution</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={langData} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="lang" tick={{ fontSize: 11, fill: '#475569', fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="pairs" fill="#4f46e5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quality metrics */}
      <Card style={{ padding: 20 }}>
        <SectionTitle>Dataset Quality Metrics (v3)</SectionTitle>
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {[
            { label: 'Avg Sentence Length', val: '18.4 tokens', color: '#4f46e5' },
            { label: 'Vocabulary Size', val: '84,200 words', color: '#7c3aed' },
            { label: 'Alignment Score', val: '97.2%', color: '#10b981' },
            { label: 'Noise Ratio', val: '0.8%', color: '#f59e0b' },
            { label: 'Coverage Score', val: '94.1%', color: '#4f46e5' },
          ].map(({ label, val, color }) => (
            <div key={label} className="p-3 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color, fontFamily: "'JetBrains Mono',monospace" }}>{val}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
