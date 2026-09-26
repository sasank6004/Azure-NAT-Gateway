import { useState } from 'react';
import { Card, PageHeader, Btn, CustomBadge } from '../components/ui';

const allRows = [
  { id: 'TR-001', original: 'Hello, how are you today?', src: 'English', tgt: 'Hindi', translation: 'नमस्ते, आप आज कैसे हैं?', model: 'T5-v2', quality: 95, latency: '0.76s', date: 'Sep 22, 2026', status: 'success' as const },
  { id: 'TR-002', original: 'The weather is pleasant today.', src: 'English', tgt: 'Telugu', translation: 'ఈరోజు వాతావరణం ఆహ్లాదకరంగా ఉంది.', model: 'T5-v2', quality: 91, latency: '0.81s', date: 'Sep 22, 2026', status: 'success' as const },
  { id: 'TR-003', original: 'Machine learning transforms industries.', src: 'English', tgt: 'Tamil', translation: 'இயந்திர கற்றல் தொழில்களை மாற்றுகிறது.', model: 'T5-v2', quality: 88, latency: '0.94s', date: 'Sep 21, 2026', status: 'warning' as const },
  { id: 'TR-004', original: 'Natural language processing is fascinating.', src: 'English', tgt: 'Kannada', translation: 'ನೈಸರ್ಗಿಕ ಭಾಷಾ ಸಂಸ್ಕರಣೆ ಆಕರ್ಷಣೀಯವಾಗಿದೆ.', model: 'T5-v2', quality: 92, latency: '0.88s', date: 'Sep 21, 2026', status: 'success' as const },
  { id: 'TR-005', original: 'Please schedule a meeting for tomorrow.', src: 'English', tgt: 'Malayalam', translation: 'ദയവായി നാളെ ഒരു യോഗം ഷെഡ്യൂൾ ചെയ്യുക.', model: 'T5-v1', quality: 79, latency: '1.12s', date: 'Sep 21, 2026', status: 'warning' as const },
  { id: 'TR-006', original: 'The project deadline is approaching fast.', src: 'English', tgt: 'French', translation: 'La date limite du projet approche rapidement.', model: 'T5-v2', quality: 96, latency: '0.72s', date: 'Sep 20, 2026', status: 'success' as const },
  { id: 'TR-007', original: 'Quantum computing will revolutionize AI.', src: 'English', tgt: 'German', translation: 'Quantencomputing wird KI revolutionieren.', model: 'T5-v2', quality: 93, latency: '0.84s', date: 'Sep 20, 2026', status: 'success' as const },
  { id: 'TR-008', original: 'The API endpoint timed out unexpectedly.', src: 'English', tgt: 'Spanish', translation: null, model: 'T5-v2', quality: null, latency: '2.10s', date: 'Sep 19, 2026', status: 'error' as const },
  { id: 'TR-009', original: 'Deep learning models need large datasets.', src: 'English', tgt: 'Hindi', translation: 'डीप लर्निंग मॉडल को बड़े डेटासेट की जरूरत होती है।', model: 'T5-v2', quality: 90, latency: '0.89s', date: 'Sep 19, 2026', status: 'success' as const },
  { id: 'TR-010', original: 'Continuous integration ensures code quality.', src: 'English', tgt: 'Telugu', translation: 'కంటిన్యూస్ ఇంటిగ్రేషన్ కోడ్ నాణ్యతను నిర్ధారిస్తుంది.', model: 'T5-v1', quality: 82, latency: '1.04s', date: 'Sep 18, 2026', status: 'warning' as const },
];

export default function History() {
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modelFilter, setModelFilter] = useState('All');

  const filtered = allRows.filter((r) => {
    const matchSearch = !search || r.original.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search);
    const matchLang = langFilter === 'All' || r.src === langFilter || r.tgt === langFilter;
    const matchStatus = statusFilter === 'All' || r.status === statusFilter.toLowerCase();
    const matchModel = modelFilter === 'All' || r.model === modelFilter;
    return matchSearch && matchLang && matchStatus && matchModel;
  });

  const qualityColor = (q: number | null) => {
    if (!q) return '#ef4444';
    if (q >= 90) return '#10b981';
    if (q >= 80) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div>
      <PageHeader
        title="Translation History"
        subtitle="View and search all past translation requests."
        actions={
          <Btn variant="ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </Btn>
        }
      />

      {/* Filters */}
      <Card style={{ padding: '14px 16px', marginBottom: 16 }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1" style={{ minWidth: 200 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2} className="w-4 h-4 flex-shrink-0">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by ID or text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: 13, color: '#0f172a', background: 'transparent', width: '100%' }}
            />
          </div>
          <div style={{ width: 1, height: 20, background: '#e2e8f0' }} />
          {[
            { label: 'Language', value: langFilter, set: setLangFilter, opts: ['All', 'English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'French', 'German', 'Spanish'] },
            { label: 'Status', value: statusFilter, set: setStatusFilter, opts: ['All', 'Success', 'Warning', 'Error'] },
            { label: 'Model', value: modelFilter, set: setModelFilter, opts: ['All', 'T5-v1', 'T5-v2'] },
          ].map(({ label, value, set, opts }) => (
            <div key={label} className="flex items-center gap-2">
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{label}:</span>
              <select
                value={value}
                onChange={(e) => set(e.target.value)}
                style={{ fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 7, padding: '5px 10px', background: '#f8fafc', color: '#0f172a', cursor: 'pointer' }}
              >
                {opts.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>{filtered.length} records</span>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['ID', 'Original Text', 'Src', 'Tgt', 'Translation', 'Model', 'Quality', 'Latency', 'Date', 'Status'].map((col) => (
                  <th key={col} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr
                  key={row.id}
                  style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbff' }}
                >
                  <td style={{ padding: '10px 14px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#4f46e5', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {row.id}
                  </td>
                  <td style={{ padding: '10px 14px', maxWidth: 180 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#0f172a' }} title={row.original}>
                      {row.original}
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    <CustomBadge label={row.src} status="info" />
                  </td>
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    <CustomBadge label={row.tgt} status="purple" />
                  </td>
                  <td style={{ padding: '10px 14px', maxWidth: 180 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: row.translation ? '#475569' : '#ef4444' }} title={row.translation ?? 'Translation failed'}>
                      {row.translation ?? '— Translation failed —'}
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#7c3aed', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {row.model}
                  </td>
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    {row.quality ? (
                      <span style={{ fontSize: 13, fontWeight: 700, color: qualityColor(row.quality), fontFamily: "'JetBrains Mono',monospace" }}>
                        {row.quality}%
                      </span>
                    ) : <span style={{ color: '#ef4444' }}>N/A</span>}
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                    {row.latency}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                    {row.date}
                  </td>
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    <CustomBadge
                      label={row.status === 'success' ? 'Success' : row.status === 'warning' ? 'Warning' : 'Failed'}
                      status={row.status === 'success' ? 'success' : row.status === 'warning' ? 'warning' : 'error'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Showing {filtered.length} of {allRows.length} records</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, '...', 12].map((p, i) => (
              <button
                key={i}
                style={{
                  width: 30, height: 30, borderRadius: 6, fontSize: 12, fontWeight: p === 1 ? 700 : 400,
                  background: p === 1 ? '#4f46e5' : '#f1f5f9', color: p === 1 ? '#fff' : '#475569', cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
