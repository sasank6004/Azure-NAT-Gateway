import { Card, KpiCard, PageHeader, SectionTitle, HealthRow } from '../components/ui';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const qualityTrend = [
  { date: 'Sep 1', quality: 91.2, baseline: 92.4 },
  { date: 'Sep 5', quality: 92.8, baseline: 92.4 },
  { date: 'Sep 10', quality: 90.5, baseline: 92.4 },
  { date: 'Sep 15', quality: 93.1, baseline: 92.4 },
  { date: 'Sep 18', quality: 91.8, baseline: 92.4 },
  { date: 'Sep 20', quality: 92.4, baseline: 92.4 },
  { date: 'Sep 22', quality: 88.7, baseline: 92.4 },
];

const latencyData = [
  { time: '00:00', latency: 0.78 },
  { time: '04:00', latency: 0.65 },
  { time: '08:00', latency: 0.91 },
  { time: '12:00', latency: 1.12 },
  { time: '16:00', latency: 0.88 },
  { time: '20:00', latency: 0.81 },
  { time: '24:00', latency: 0.76 },
];

const requestData = [
  { day: 'Mon', requests: 1840 },
  { day: 'Tue', requests: 2200 },
  { day: 'Wed', requests: 1980 },
  { day: 'Thu', requests: 2540 },
  { day: 'Fri', requests: 2180 },
  { day: 'Sat', requests: 1120 },
  { day: 'Sun', requests: 680 },
];

const errorData = [
  { day: 'Mon', rate: 1.2 },
  { day: 'Tue', rate: 1.8 },
  { day: 'Wed', rate: 0.9 },
  { day: 'Thu', rate: 2.1 },
  { day: 'Fri', rate: 1.5 },
  { day: 'Sat', rate: 1.8 },
  { day: 'Sun', rate: 1.2 },
];

const modelPerf = [
  { model: 'T5-v1', bleu: 0.71, rouge: 0.68 },
  { model: 'Trans-v1', bleu: 0.74, rouge: 0.70 },
  { model: 'T5-v2', bleu: 0.82, rouge: 0.79 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 14px', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <div style={{ color: '#94a3b8', marginBottom: 2 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>
            {p.name}: {p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Language Translation MLOps Dashboard"
        subtitle="Monitor translation quality, model performance and system health."
        actions={
          <div className="flex items-center gap-2">
            <select
              style={{ fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px', background: '#fff', color: '#475569', cursor: 'pointer' }}
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
            <button
              className="flex items-center gap-2 rounded-lg font-semibold text-white text-sm"
              style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Refresh
            </button>
          </div>
        }
      />

      {/* Alert banner */}
      <div className="flex items-center gap-3 rounded-xl mb-6 px-4 py-3" style={{ background: '#fef3c7', border: '1px solid #fbbf24' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth={2} className="w-5 h-5 flex-shrink-0">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div style={{ fontSize: 13, color: '#92400e' }}>
          <strong>Quality degradation detected:</strong> Current quality 88.7% is below baseline of 92.4% (−3.7%). Model re-evaluation recommended.
        </div>
        <button className="ml-auto text-amber-700 hover:text-amber-900 text-xs font-semibold underline">View Details</button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
        <KpiCard
          label="Total Translations"
          value="12,540"
          sub="All time"
          accent="#4f46e5"
          trend={{ dir: 'up', value: '+8.2% this week' }}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M5 8l4 4-4 4" /><path d="M19 8l-4 4 4 4" /><path d="M9 12h6" /></svg>}
        />
        <KpiCard
          label="Translation Quality"
          value="92.4%"
          sub="BLEU + Semantic"
          accent="#10b981"
          trend={{ dir: 'down', value: '−3.7% today' }}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
        />
        <KpiCard
          label="Avg Response Time"
          value="0.81s"
          sub="p95: 1.24s"
          accent="#7c3aed"
          trend={{ dir: 'up', value: '+0.04s vs yesterday' }}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
        />
        <KpiCard
          label="Error Rate"
          value="1.8%"
          sub="Last 24 hours"
          accent="#f59e0b"
          trend={{ dir: 'up', value: '+0.3% today' }}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>}
        />
        <KpiCard
          label="Active Model"
          value="T5-v2"
          sub="Production"
          accent="#4f46e5"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" /></svg>}
        />
        <KpiCard
          label="System Uptime"
          value="99.8%"
          sub="Last 30 days"
          accent="#10b981"
          trend={{ dir: 'up', value: 'SLA: 99.5%' }}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <Card style={{ padding: 20 }}>
          <SectionTitle>Translation Quality Trend</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={qualityTrend}>
              <defs>
                <linearGradient id="qualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[85, 96]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="quality" name="Quality %" stroke="#4f46e5" strokeWidth={2} fill="url(#qualGrad)" dot={{ fill: '#4f46e5', r: 3 }} />
              <Line type="monotone" dataKey="baseline" stroke="#10b981" strokeDasharray="4 3" strokeWidth={1.5} dot={false} name="Baseline" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding: 20 }}>
          <SectionTitle>API Response Time</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="latency" name="Latency (s)" stroke="#7c3aed" strokeWidth={2} dot={{ fill: '#7c3aed', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding: 20 }}>
          <SectionTitle>Translation Requests</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={requestData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="requests" name="Requests" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <Card style={{ padding: 20 }}>
          <SectionTitle>Error Rate (%)</SectionTitle>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={errorData}>
              <defs>
                <linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="rate" name="Error %" stroke="#ef4444" strokeWidth={2} fill="url(#errGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding: 20 }}>
          <SectionTitle>Model Performance (BLEU)</SectionTitle>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={modelPerf} barSize={22} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="model" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="bleu" name="BLEU" fill="#4f46e5" radius={[0, 4, 4, 0]} />
              <Bar dataKey="rouge" name="ROUGE" fill="#818cf8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding: 20 }}>
          <SectionTitle>System Health</SectionTitle>
          <div>
            <HealthRow label="API Server" status="online" />
            <HealthRow label="Translation Model" status="healthy" />
            <HealthRow label="Database" status="connected" />
            <HealthRow label="Monitoring" status="active" />
            <HealthRow label="CI/CD Pipeline" status="healthy" />
          </div>
          <div className="flex items-center gap-2 mt-3 p-2 rounded-lg" style={{ background: '#dcfce7' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2} className="w-4 h-4 flex-shrink-0">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>All systems operational</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
