import { useState } from 'react';
import { Card, PageHeader, SectionTitle, CustomBadge, Btn } from '../components/ui';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const experiments = [
  { id: 'EXP-001', name: 'Experiment-001', model: 'T5-v1', dataset: 'Dataset-v1', bleu: 0.71, rouge: 0.68, sem: 0.82, latency: '1.24s', status: 'completed', date: 'Jan 15, 2026', epochs: 10, lr: '3e-4', batch: 32 },
  { id: 'EXP-002', name: 'Experiment-002', model: 'T5-v2', dataset: 'Dataset-v2', bleu: 0.78, rouge: 0.74, sem: 0.87, latency: '0.92s', status: 'completed', date: 'May 8, 2026', epochs: 15, lr: '2e-4', batch: 64 },
  { id: 'EXP-003', name: 'Experiment-003', model: 'T5-v2', dataset: 'Dataset-v3', bleu: 0.82, rouge: 0.79, sem: 0.91, latency: '0.81s', status: 'completed', date: 'Sep 10, 2026', epochs: 20, lr: '1e-4', batch: 64 },
  { id: 'EXP-004', name: 'Experiment-004', model: 'T5-v2', dataset: 'Dataset-v3', bleu: null, rouge: null, sem: null, latency: '—', status: 'running', date: 'Sep 22, 2026', epochs: 25, lr: '5e-5', batch: 128 },
  { id: 'EXP-005', name: 'Experiment-005', model: 'Transformer-v1', dataset: 'Dataset-v2', bleu: 0.68, rouge: 0.65, sem: 0.79, latency: '1.48s', status: 'failed', date: 'Apr 3, 2026', epochs: 12, lr: '1e-3', batch: 32 },
];

const radarData = [
  { metric: 'BLEU', exp1: 71, exp2: 78, exp3: 82 },
  { metric: 'ROUGE', exp1: 68, exp2: 74, exp3: 79 },
  { metric: 'Semantic', exp1: 82, exp2: 87, exp3: 91 },
  { metric: 'Speed', exp1: 45, exp2: 62, exp3: 72 },
  { metric: 'Coverage', exp1: 76, exp2: 82, exp3: 89 },
];

const statusMap: Record<string, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple' }> = {
  completed: { label: 'Completed', status: 'success' },
  running: { label: 'Running', status: 'info' },
  failed: { label: 'Failed', status: 'error' },
};

export default function Experiments() {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <div>
      <PageHeader
        title="Experiment Tracking"
        subtitle="MLflow-inspired experiment registry — track, compare, and promote runs."
        actions={
          <div className="flex gap-2">
            {selected.length >= 2 && (
              <Btn variant="ghost">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>
                Compare ({selected.length})
              </Btn>
            )}
            <Btn variant="primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              New Experiment
            </Btn>
          </div>
        }
      />

      {/* Best run highlight */}
      <div className="rounded-xl p-4 mb-5 flex items-center gap-4" style={{ background: 'linear-gradient(135deg,rgba(79,70,229,0.08),rgba(124,58,237,0.05))', border: '1px solid rgba(79,70,229,0.15)' }}>
        <div className="rounded-xl p-2.5" style={{ background: '#4f46e5' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-5 h-5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#4f46e5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Best Run</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Experiment-003 · T5-v2 + Dataset-v3</div>
        </div>
        <div className="flex gap-6 ml-auto">
          {[{ k: 'BLEU', v: '0.82' }, { k: 'ROUGE', v: '0.79' }, { k: 'Semantic', v: '0.91' }, { k: 'Latency', v: '0.81s' }].map(({ k, v }) => (
            <div key={k} className="text-center">
              <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>{k}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#4f46e5', fontFamily: "'JetBrains Mono',monospace" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {/* Table */}
        <Card style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
            <SectionTitle>All Experiments</SectionTitle>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '9px 14px', width: 36 }}></th>
                {['Name', 'Model', 'Dataset', 'BLEU', 'ROUGE', 'Latency', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {experiments.map((exp, i) => {
                const isSel = selected.includes(exp.id);
                return (
                  <tr key={exp.id} style={{ borderBottom: '1px solid #f1f5f9', background: isSel ? 'rgba(79,70,229,0.04)' : i % 2 === 0 ? '#fff' : '#fafbff' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <input type="checkbox" checked={isSel} onChange={() => toggle(exp.id)} style={{ cursor: 'pointer', accentColor: '#4f46e5' }} />
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>{exp.name}</td>
                    <td style={{ padding: '10px 14px' }}><CustomBadge label={exp.model} status="purple" /></td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>{exp.dataset}</td>
                    <td style={{ padding: '10px 14px', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: exp.bleu ? '#4f46e5' : '#cbd5e1' }}>
                      {exp.bleu ?? '—'}
                    </td>
                    <td style={{ padding: '10px 14px', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: exp.rouge ? '#7c3aed' : '#cbd5e1' }}>
                      {exp.rouge ?? '—'}
                    </td>
                    <td style={{ padding: '10px 14px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#64748b' }}>{exp.latency}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <CustomBadge label={statusMap[exp.status].label} status={statusMap[exp.status].status} />
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>{exp.date}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div className="flex gap-1">
                        {['View', exp.status === 'completed' ? 'Promote' : ''].filter(Boolean).map((a) => (
                          <button key={a} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 5, background: a === 'Promote' ? 'rgba(79,70,229,0.1)' : '#f1f5f9', color: a === 'Promote' ? '#4f46e5' : '#475569', fontWeight: 600, cursor: 'pointer', border: 'none' }}>{a}</button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Radar chart */}
        <Card style={{ padding: 20 }}>
          <SectionTitle>Top-3 Comparison</SectionTitle>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Radar name="EXP-001" dataKey="exp1" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.15} />
              <Radar name="EXP-002" dataKey="exp2" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} />
              <Radar name="EXP-003" dataKey="exp3" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="mt-2 p-3 rounded-lg" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Hyperparameter Snapshot — EXP-003</div>
            {[['Learning Rate', '1e-4'], ['Batch Size', '64'], ['Epochs', '20'], ['Optimizer', 'AdamW']].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span style={{ fontSize: 12, color: '#64748b' }}>{k}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5', fontFamily: "'JetBrains Mono',monospace" }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
