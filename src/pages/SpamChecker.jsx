import React, { useState } from 'react'
import AppLayout from '../components/AppLayout.jsx'
import ResultCard from '../components/ResultCard.jsx'
import { analyzeText } from '../services/api.js'
import { ScanSearch, Loader2, Trash2 } from 'lucide-react'

const EXAMPLES = [
  'URGENT: Your bank account has been suspended. Click here to verify: http://secure-bank-login.xyz',
  'Congratulations! You have won ₹50,000. Call now to claim your prize: 9999999999',
  'Hey, your Amazon order #112-3456789 has been shipped and will arrive by Friday.',
]

export default function SpamChecker() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!text.trim()) return
    setLoading(true); setResult(null); setError('')
    try {
      const res = await analyzeText(text)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <AppLayout title="Spam Text Checker">
      <div style={{ maxWidth: 720 }}>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 24 }}>
          Paste any message, email, or SMS below and our AI will analyze it instantly.
        </p>

        {/* Textarea */}
        <div style={{
          background: '#fff', border: '1.5px solid var(--border)',
          borderRadius: 14, overflow: 'hidden', marginBottom: 12,
        }}>
          <textarea
            value={text}
            onChange={e => { setText(e.target.value); setResult(null) }}
            placeholder="Paste your message here..."
            rows={6}
            style={{
              width: '100%', padding: '16px', border: 'none', outline: 'none',
              fontSize: 14, lineHeight: 1.7, resize: 'vertical', fontFamily: 'inherit',
              color: 'var(--ink)', background: 'transparent', boxSizing: 'border-box',
              minHeight: 140,
            }}
          />
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', borderTop: '1px solid var(--border)',
            background: 'var(--bg)',
          }}>
            <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>{text.length} characters</span>
            {text && (
              <button onClick={() => { setText(''); setResult(null) }} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--ink-4)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
              }}>
                <Trash2 size={13} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Examples */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.4px' }}>
            Try an example
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => { setText(ex); setResult(null) }} style={{
                background: '#fff', border: '1px solid var(--border)', borderRadius: 8,
                padding: '8px 12px', textAlign: 'left', cursor: 'pointer',
                fontSize: 12.5, color: 'var(--ink-3)', transition: 'all .15s',
                fontFamily: 'inherit',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue-400)'; e.currentTarget.style.color = 'var(--ink)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--ink-3)' }}
              >
                {ex.slice(0, 80)}…
              </button>
            ))}
          </div>
        </div>

        {/* Analyze button */}
        <button onClick={handleAnalyze} disabled={loading || !text.trim()} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 24px', borderRadius: 10,
          background: 'var(--blue-600)', color: '#fff', border: 'none',
          fontSize: 15, fontWeight: 600, cursor: (loading || !text.trim()) ? 'not-allowed' : 'pointer',
          opacity: (loading || !text.trim()) ? .6 : 1, transition: 'all .2s', marginBottom: 24,
        }}>
          {loading
            ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</>
            : <><ScanSearch size={16} /> Analyze message</>}
        </button>

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
