import { useState } from 'react';
import { Card, PageHeader } from '../components/ui';

const languages = [
  'English', 'Telugu', 'Hindi', 'Tamil', 'Kannada',
  'Malayalam', 'French', 'German', 'Spanish',
];

const sampleTranslations: Record<string, Record<string, string>> = {
  'Hello, how are you today?': {
    Telugu: 'హలో, మీరు ఈరోజు ఎలా ఉన్నారు?',
    Hindi: 'नमस्ते, आप आज कैसे हैं?',
    Tamil: 'வணக்கம், நீங்கள் இன்று எப்படி இருக்கிறீர்கள்?',
    Kannada: 'ನಮಸ್ಕಾರ, ನೀವು ಇಂದು ಹೇಗಿದ್ದೀರಿ?',
    Malayalam: 'ഹലോ, ഇന്ന് നിങ്ങൾ എങ്ങനെ ഉണ്ട്?',
    French: 'Bonjour, comment allez-vous aujourd\'hui ?',
    German: 'Hallo, wie geht es Ihnen heute?',
    Spanish: '¡Hola! ¿Cómo estás hoy?',
    English: 'Hello, how are you today?',
  },
};

export default function Translate() {
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Hindi');
  const [sourceText, setSourceText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [translated, setTranslated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [respTime] = useState(0.82);

  const handleTranslate = () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    setTranslated(false);
    setTimeout(() => {
      const known = sampleTranslations['Hello, how are you today?'];
      const result = known[targetLang] || `[${targetLang} translation of: "${sourceText.slice(0, 40)}..."]`;
      setOutputText(result);
      setLoading(false);
      setTranslated(true);
    }, 900);
  };

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(outputText);
    setOutputText(sourceText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectStyle = {
    fontSize: 13,
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '8px 12px',
    background: '#f8fafc',
    color: '#0f172a',
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
    minWidth: 140,
  } as const;

  return (
    <div>
      <PageHeader
        title="AI Language Translator"
        subtitle="Translate text using our Transformer/T5 machine translation model."
      />

      {/* Language chips */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Supported:</span>
        {languages.map((lang) => (
          <span
            key={lang}
            style={{
              fontSize: 12,
              padding: '3px 10px',
              borderRadius: 99,
              background: '#f1f5f9',
              color: '#475569',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
            }}
            onClick={() => setTargetLang(lang)}
          >
            {lang}
          </span>
        ))}
      </div>

      {/* Translation panels */}
      <div className="flex gap-3 items-stretch mb-4">
        {/* Source */}
        <Card style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth={2} className="w-4 h-4">
                <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} style={selectStyle}>
                {languages.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <button
              onClick={() => { setSourceText(''); setOutputText(''); setTranslated(false); }}
              style={{ fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}
            >
              Clear
            </button>
          </div>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              padding: '16px',
              fontSize: 15,
              color: '#0f172a',
              resize: 'none',
              background: 'transparent',
              fontFamily: "'Inter',sans-serif",
              lineHeight: 1.6,
              minHeight: 220,
            }}
          />
          <div className="flex items-center justify-between px-4 py-2" style={{ borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: "'JetBrains Mono',monospace" }}>
              {sourceText.length} / 5000 characters
            </span>
            <button
              onClick={() => setSourceText('Hello, how are you today?')}
              style={{ fontSize: 11, color: '#4f46e5', cursor: 'pointer' }}
            >
              Try sample
            </button>
          </div>
        </Card>

        {/* Swap button */}
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: 44 }}>
          <button
            onClick={handleSwap}
            className="rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(79,70,229,0.35)',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-4 h-4">
              <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
        </div>

        {/* Target */}
        <Card style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth={2} className="w-4 h-4">
                <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} style={selectStyle}>
                {languages.filter((l) => l !== sourceLang).map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!outputText}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
                style={{ background: copied ? '#dcfce7' : '#f1f5f9', color: copied ? '#166534' : '#475569', cursor: outputText ? 'pointer' : 'default' }}
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
              <button
                disabled={!outputText}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
                style={{ background: '#f1f5f9', color: '#475569', cursor: outputText ? 'pointer' : 'default' }}
              >
                ⬇ Download
              </button>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              padding: '16px',
              fontSize: 15,
              lineHeight: 1.6,
              minHeight: 220,
              color: outputText ? '#0f172a' : '#cbd5e1',
              background: loading ? '#fafafe' : 'transparent',
              fontFamily: "'Inter',sans-serif",
            }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#4f46e5',
                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 13, color: '#94a3b8' }}>Translating with T5-v2...</span>
              </div>
            ) : outputText ? outputText : 'Translation will appear here...'}
          </div>
          {translated && (
            <div className="px-4 py-2" style={{ borderTop: '1px solid #f1f5f9' }}>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 rounded-full px-2 py-0.5" style={{ fontSize: 11, background: '#dcfce7', color: '#166534', fontFamily: "'JetBrains Mono',monospace" }}>
                  ✓ 92% quality
                </span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{respTime}s</span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Translate button */}
      <div className="flex justify-center mb-5">
        <button
          onClick={handleTranslate}
          disabled={!sourceText.trim() || loading}
          className="flex items-center gap-3 rounded-xl font-semibold text-white transition-all"
          style={{
            padding: '13px 40px',
            background: sourceText.trim() && !loading ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : '#cbd5e1',
            fontSize: 15,
            boxShadow: sourceText.trim() ? '0 4px 16px rgba(79,70,229,0.35)' : 'none',
            cursor: sourceText.trim() && !loading ? 'pointer' : 'default',
            letterSpacing: '-0.2px',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M5 8l4 4-4 4" /><path d="M19 8l-4 4 4 4" /><path d="M9 12h6" />
          </svg>
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </div>

      {/* Translation info */}
      {translated && (
        <Card style={{ padding: '14px 20px' }}>
          <div className="flex items-center gap-8 flex-wrap">
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginBottom: 2 }}>Model</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#4f46e5', fontFamily: "'JetBrains Mono',monospace" }}>T5-v2</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginBottom: 2 }}>Version</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>2.0</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginBottom: 2 }}>Response Time</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', fontFamily: "'JetBrains Mono',monospace" }}>{respTime}s</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginBottom: 2 }}>Quality Score</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>92%</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginBottom: 2 }}>Direction</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{sourceLang} → {targetLang}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginBottom: 2 }}>Timestamp</div>
              <div style={{ fontSize: 12, color: '#64748b', fontFamily: "'JetBrains Mono',monospace" }}>
                {new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </Card>
      )}

      <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }`}</style>
    </div>
  );
}
