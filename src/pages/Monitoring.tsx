import { Card, PageHeader, SectionTitle, KpiCard } from '../components/ui';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend,
} from 'recharts';

const qualityTrend = [
  { date: 'Sep 15', bleu: 0.81, rouge: 0.78, sem: 0.89 },
  { date: 'Sep 16', bleu: 0.82, rouge: 0.79, sem: 0.90 },
  { date: 'Sep 17', bleu: 0.80, rouge: 0.77, sem: 0.88 },
  { date: 'Sep 18', bleu: 0.83, rouge: 0.80, sem: 0.91 },
  { date: 'Sep 19', bleu: 0.79, rouge: 0.76, sem: 0.87 },
  { date: 'Sep 20', bleu: 0.78, rouge: 0.75, sem: 0.85 },
  { date: 'Sep 21', bleu: 0.76, rouge: 0.73, sem: 0.83 },
  { date: 'Sep 22', bleu: 0.74, rouge: 0.71, sem: 0.81 },
];

const sysData = [
  { time: '06:00', cpu: 42, memory: 58, latency: 0.78 },
  { time: '09:00', cpu: 68, memory: 65, latency: 0.91 },
  { time: '12:00', cpu: 82, memory: 72, latency: 1.12 },
  { time: '15:00', cpu: 75, memory: 70, latency: 0.96 },
  { time: '18:00', cpu: 61, memory: 66, latency: 0.84 },
  { time: '21:00', cpu: 48, memory: 60, latency: 0.80 },
  { time: 'Now', cpu: 52, memory: 63, latency: 0.82 },
];

const langDist = [
  { name: 'English→Hindi', value: 28 },
  { name: 'English→Telugu', value: 19 },
  { name: 'English→Tamil', value: 16 },
  { name: 'English→French', value: 14 },
  { name: 'English→German', value: 11 },
  { name: 'Others', value: 12 },
];

const COLORS = ['#4f46e5', '#7c3aed', '#818cf8', '#a78bfa', '#c4b5fd', '#e2e8f0'];

const driftData = [
  { feature: 'Sentence Length', drift: 0.12, threshold: 0.15 },
  { feature: 'Vocabulary', drift: 0.22, threshold: 0.15 },
  { feature: 'Punctuation', drift: 0.08, threshold: 0.15 },
  { feature: 'Formality', drift: 0.19, threshold: 0.15 },
  { feature: 'Language Mix', drift: 0.31, threshold: 0.15 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 14px', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <div style={{ color: '#94a3b8', marginBottom: 4, fontWeight: 600 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Monitoring() {
  return (
    <div>
      <PageHeader
        title="Translation Quality & System Monitoring"
        subtitle="Evidently AI-inspired drift and quality tracking for your MLOps pipeline."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: '#fee2e2', fontSize: 12, color: '#991b1b', fontWeight: 600 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              2 Active Alerts
            </div>
            <select style={{ fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px', background: '#fff', color: '#475569' }}>
              <option>Last 7 days</option><option>Last 24 hours</option>
            </select>
          </div>
        }
      />

      {/* Alert banner */}
      <div className="rounded-xl p-4 mb-5" style={{ background: 'linear-gradient(135deg,#fee2e2,#fef3c7)', border: '1px solid #fca5a5' }}>
        <div className="flex items-start gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} className="w-5 h-5 flex-shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div className="flex-1">
            <div style={{ fontWeight: 700, color: '#991b1b', fontSize: 14 }}>Quality Degradation Detected</div>
            <div className="flex items-center gap-6 mt-1 flex-wrap">
              <span style={{ fontSize: 13, color: '#7f1d1d' }}>Current: <strong>88.7%</strong></span>
              <span style={{ fontSize: 13, color: '#7f1d1d' }}>Previous: <strong>92.4%</strong></span>
              <span style={{ fontSize: 13, color: '#ef4444', fontWeight: 700 }}>Change: −3.7%</span>
              <span className="px-3 py-1 rounded-lg text-sm font-semibold" style={{ background: '#7f1d1d', color: '#fff' }}>
                Model Evaluation Recommended
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quality KPIs */}
      <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <KpiCard label="BLEU Score" value="0.74" sub="↓ from 0.82 (−9.8%)" accent="#ef4444" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>} trend={{ dir: 'down', value: '−0.08 this week' }} />
        <KpiCard label="ROUGE Score" value="0.71" sub="↓ from 0.79 (−10.1%)" accent="#f59e0b" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>} trend={{ dir: 'down', value: '−0.08 this week' }} />
        <KpiCard label="Semantic Similarity" value="81.3%" sub="BERTScore F1" accent="#7c3aed" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>} trend={{ dir: 'down', value: '−2.1% vs baseline' }} />
        <KpiCard label="Error Rate" value="1.8%" sub="Last 24 hours" accent="#10b981" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>} trend={{ dir: 'up', value: '+0.3% today' }} />
      </div>

      {/* Quality trends */}
      <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <Card style={{ padding: 20 }}>
          <SectionTitle>Quality Score Trends</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={qualityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0.65, 0.95]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="bleu" name="BLEU" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3, fill: '#4f46e5' }} />
              <Line type="monotone" dataKey="rouge" name="ROUGE" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3, fill: '#7c3aed' }} />
              <Line type="monotone" dataKey="sem" name="Semantic Sim" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding: 20 }}>
          <SectionTitle>Input Language Distribution</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={langDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {langDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* System performance */}
      <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <Card style={{ padding: 20 }}>
          <SectionTitle>CPU & Memory Usage</SectionTitle>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={sysData}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cpu" name="CPU %" stroke="#4f46e5" fill="url(#cpuGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="memory" name="Memory %" stroke="#7c3aed" fill="url(#memGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding: 20 }}>
          <SectionTitle>API Latency</SectionTitle>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={sysData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="latency" name="Latency (s)" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding: 20 }}>
          <SectionTitle>Data Drift Detection</SectionTitle>
          <div className="flex flex-col gap-2 mt-1">
            {driftData.map((d) => {
              const isDrift = d.drift > d.threshold;
              return (
                <div key={d.feature}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: 12, color: '#475569' }}>{d.feature}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: isDrift ? '#ef4444' : '#10b981' }}>
                      {d.drift.toFixed(2)} {isDrift ? '⚠' : '✓'}
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: '#f1f5f9', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(d.drift / 0.4) * 100}%`, borderRadius: 3, background: isDrift ? '#ef4444' : '#10b981', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Threshold: 0.15 (PSI)</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
