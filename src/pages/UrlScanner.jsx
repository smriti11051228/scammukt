import React, { useState } from 'react'
import AppLayout from '../components/AppLayout.jsx'
import ResultCard from '../components/ResultCard.jsx'
import { scanUrl } from '../services/api.js'
import { Link2, Loader2 } from 'lucide-react'

export default function UrlScanner() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleScan = async () => {
    if (!url.trim()) return
    setLoading(true); setResult(null); setError('')
    try {
      const res = await scanUrl(url.trim())
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Scan failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <AppLayout title="URL Scanner">
      <div style={{ maxWidth: 720 }}>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 24 }}>
          Paste any suspicious link. We run a dual check — VirusTotal (70+ engines) + AI analysis.
        </p>

        <div style={{
          display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap',
        }}>
          <input
            type="url" value={url}
            onChange={e => { setUrl(e.target.value); setResult(null) }}
            onKeyDown={e => e.key === 'Enter' && handleScan()}
            placeholder="https://suspicious-link.com/..."
            style={{
              flex: 1, minWidth: 200,
              padding: '12px 16px', borderRadius: 10,
              border: '1.5px solid var(--border)', fontSize: 14,
              outline: 'none', fontFamily: 'monospace', color: 'var(--ink)',
              transition: 'border-color .2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--blue-400)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button onClick={handleScan} disabled={loading || !url.trim()} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 22px', borderRadius: 10,
            background: 'var(--blue-600)', color: '#fff', border: 'none',
            fontSize: 15, fontWeight: 600,
            cursor: (loading || !url.trim()) ? 'not-allowed' : 'pointer',
            opacity: (loading || !url.trim()) ? .6 : 1, transition: 'all .2s',
            whiteSpace: 'nowrap',
          }}>
            {loading
              ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Scanning...</>
              : <><Link2 size={16} /> Scan URL</>}
          </button>
        </div>

        {loading && (
          <div style={{
            background: '#eff6ff', border: '1px solid var(--blue-200)',
            borderRadius: 10, padding: '14px 18px', marginBottom: 16,
            fontSize: 14, color: 'var(--blue-700)',
          }}>
            ⏳ This may take 5–10 seconds while VirusTotal checks 70+ security engines…
          </div>
        )}

        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 10,
            background: '#fff1f2', border: '1px solid #fecaca',
            fontSize: 14, color: '#dc2626', marginBottom: 16,
          }}>{error}</div>
        )}

        {result && <ResultCard result={result} />}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </AppLayout>
  )
}
