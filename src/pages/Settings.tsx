import { useState } from 'react';
import { Card, PageHeader, SectionTitle, Btn } from '../components/ui';

const tabs = ['Profile', 'API Config', 'Model Config', 'Monitoring', 'Notifications', 'Security', 'Theme'];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [theme, setTheme] = useState('light');
  const [notifs, setNotifs] = useState({ quality: true, drift: true, latency: true, deploy: true, email: false });

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account, API keys, models, and monitoring preferences." />

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 flex-wrap" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 0 }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontSize: 13, padding: '9px 16px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: activeTab === tab ? 700 : 400,
              color: activeTab === tab ? '#4f46e5' : '#64748b',
              borderBottom: activeTab === tab ? '2px solid #4f46e5' : '2px solid transparent',
              marginBottom: -1,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Profile' && (
        <div className="flex flex-col gap-4">
          <Card style={{ padding: 24 }}>
            <SectionTitle>User Profile</SectionTitle>
            <div className="flex items-center gap-5 mb-6">
              <div className="rounded-full flex items-center justify-center text-white font-bold text-2xl" style={{ width: 72, height: 72, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', flexShrink: 0 }}>AK</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', fontFamily: "'DM Sans',sans-serif" }}>Arjun Kumar</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>arjun.kumar@translytics.ai</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5', marginTop: 4 }}>Administrator</div>
              </div>
              <button className="ml-auto text-sm font-semibold rounded-lg px-4 py-2" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>Change Avatar</button>
            </div>
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
              {[['Full Name', 'Arjun Kumar'], ['Email', 'arjun.kumar@translytics.ai'], ['Organization', 'TransLytics AI Lab'], ['Role', 'Administrator']].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                  <input defaultValue={val} style={{ width: '100%', fontSize: 13, padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc', color: '#0f172a', outline: 'none' }} />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Btn variant="primary">Save Changes</Btn>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'API Config' && (
        <div className="flex flex-col gap-4">
          <Card style={{ padding: 24 }}>
            <SectionTitle>API Configuration</SectionTitle>
            <div className="flex flex-col gap-4">
              {[
                { label: 'API Base URL', val: 'https://api.translytics.ai/v2', help: 'Production endpoint' },
                { label: 'API Key', val: 'tl_prod_sk_••••••••••••••••••••••••', help: 'Keep this secret' },
                { label: 'Request Timeout (ms)', val: '5000', help: 'Default: 5000ms' },
                { label: 'Max Concurrent Requests', val: '50', help: 'Rate limit per minute' },
              ].map(({ label, val, help }) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                  <input defaultValue={val} style={{ width: '100%', fontSize: 13, padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc', color: '#0f172a', outline: 'none', fontFamily: "'JetBrains Mono',monospace" }} />
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{help}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4"><Btn variant="primary">Save API Config</Btn></div>
          </Card>
        </div>
      )}

      {activeTab === 'Model Config' && (
        <Card style={{ padding: 24 }}>
          <SectionTitle>Model Configuration</SectionTitle>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {[
              { label: 'Default Model', val: 'T5-v2', type: 'select', options: ['T5-v1', 'T5-v2', 'Transformer-v1'] },
              { label: 'Max Input Length', val: '512', type: 'number' },
              { label: 'Beam Size', val: '4', type: 'number' },
              { label: 'Temperature', val: '1.0', type: 'number' },
              { label: 'Quality Threshold (%)', val: '80', type: 'number' },
              { label: 'Batch Size (inference)', val: '32', type: 'number' },
            ].map(({ label, val, type, options }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                {type === 'select' ? (
                  <select defaultValue={val} style={{ width: '100%', fontSize: 13, padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc', color: '#0f172a', outline: 'none' }}>
                    {options?.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={type} defaultValue={val} style={{ width: '100%', fontSize: 13, padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc', color: '#0f172a', outline: 'none' }} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4"><Btn variant="primary">Save Model Config</Btn></div>
        </Card>
      )}

      {activeTab === 'Notifications' && (
        <Card style={{ padding: 24 }}>
          <SectionTitle>Notification Settings</SectionTitle>
          <div className="flex flex-col gap-0">
            {[
              { key: 'quality' as const, label: 'Quality Degradation Alerts', desc: 'Notify when BLEU/ROUGE drops below threshold' },
              { key: 'drift' as const, label: 'Data Drift Detection', desc: 'Alert when input distribution changes significantly' },
              { key: 'latency' as const, label: 'API Latency Spikes', desc: 'Notify when P95 latency exceeds 2.0s' },
              { key: 'deploy' as const, label: 'Deployment Events', desc: 'Success and failure notifications for deployments' },
              { key: 'email' as const, label: 'Email Notifications', desc: 'Send digest emails for critical alerts' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{label}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{desc}</div>
                </div>
                <button
                  onClick={() => setNotifs((prev) => ({ ...prev, [key]: !prev[key] }))}
                  style={{
                    width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
                    background: notifs[key] ? '#4f46e5' : '#e2e8f0', transition: 'background 0.2s',
                  }}
                >
                  <div style={{ position: 'absolute', top: 2, left: notifs[key] ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'Theme' && (
        <Card style={{ padding: 24 }}>
          <SectionTitle>Appearance</SectionTitle>
          <div className="flex gap-4">
            {['light', 'dark', 'system'].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all"
                style={{ borderColor: theme === t ? '#4f46e5' : '#e2e8f0', background: theme === t ? 'rgba(79,70,229,0.04)' : '#f8fafc', cursor: 'pointer', minWidth: 110 }}
              >
                <div className="rounded-lg flex items-center justify-center" style={{ width: 56, height: 40, background: t === 'dark' ? '#0f172a' : t === 'light' ? '#f8fafc' : 'linear-gradient(135deg,#f8fafc 50%,#0f172a 50%)', border: '1px solid #e2e8f0' }}>
                  <div style={{ width: 24, height: 16, borderRadius: 3, background: t === 'dark' ? '#4f46e5' : '#e2e8f0' }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: theme === t ? '#4f46e5' : '#475569', textTransform: 'capitalize' }}>{t}</span>
                {theme === t && <span style={{ fontSize: 10, color: '#4f46e5', fontWeight: 700 }}>Active</span>}
              </button>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'Security' && (
        <Card style={{ padding: 24 }}>
          <SectionTitle>Security Settings</SectionTitle>
          <div className="flex flex-col gap-5">
            {[
              { label: 'Current Password', type: 'password' },
              { label: 'New Password', type: 'password' },
              { label: 'Confirm New Password', type: 'password' },
            ].map(({ label, type }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                <input type={type} placeholder="••••••••••••" style={{ width: '100%', maxWidth: 380, fontSize: 13, padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc', color: '#0f172a', outline: 'none' }} />
              </div>
            ))}
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2} className="w-5 h-5 flex-shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>Two-Factor Authentication: Enabled</div>
                <div style={{ fontSize: 12, color: '#10b981' }}>Your account is protected with 2FA.</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Btn variant="primary">Update Password</Btn>
              <Btn variant="secondary">Manage 2FA</Btn>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'Monitoring' && (
        <Card style={{ padding: 24 }}>
          <SectionTitle>Monitoring Configuration</SectionTitle>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {[
              { label: 'Quality Alert Threshold (%)', val: '80' },
              { label: 'Latency Alert (ms)', val: '2000' },
              { label: 'Error Rate Alert (%)', val: '3.0' },
              { label: 'Data Drift PSI Threshold', val: '0.15' },
              { label: 'Monitoring Window (days)', val: '7' },
              { label: 'Report Frequency', val: 'Daily' },
            ].map(({ label, val }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                <input defaultValue={val} style={{ width: '100%', fontSize: 13, padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc', color: '#0f172a', outline: 'none' }} />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4"><Btn variant="primary">Save Monitoring Config</Btn></div>
        </Card>
      )}
    </div>
  );
}
