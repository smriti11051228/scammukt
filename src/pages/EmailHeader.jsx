import React, { useState } from 'react'
import AppLayout from '../components/AppLayout.jsx'
import ResultCard from '../components/ResultCard.jsx'
import { analyzeEmailHeader } from '../services/api.js'
import { Mail, Loader2, Trash2 } from 'lucide-react'

const EXAMPLE = `Delivered-To: user@gmail.com
Received: from mail-oi1-f176.google.com (mail-oi1-f176.google.com [209.85.167.176])
From: PayPal Support <support@paypa1-secure.com>
Reply-To: noreply@totally-not-phishing.ru
To: user@gmail.com
Subject: Urgent: Verify your account immediately
Date: Mon, 12 Feb 2024 10:23:45 -0800
Message-ID: <abc123@mail.gmail.com>
Authentication-Results: spf=fail; dkim=fail`

export default function EmailHeader() {
  const [headers, setHeaders] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!headers.trim()) return
    setLoading(true); setResult(null); setError('')
    try {
      const res = await analyzeEmailHeader(headers)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed.')
    } finally { setLoading(false) }
  }

  return (
    <AppLayout title="Email Header Analyzer">
      <div style={{ maxWidth: 720 }}>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 8 }}>
          Paste raw email headers to detect spoofing, check SPF/DKIM, and trace the email origin.
        </p>
        <p style={{ fontSize: 13, color: 'var(--ink-4)', marginBottom: 24 }}>
          In Gmail: Open email → ⋮ menu → "Show original" → copy the headers section.
        </p>

        <div style={{
          background: '#fff', border: '1.5px solid var(--border)',
          borderRadius: 14, overflow: 'hidden', marginBottom: 12,
        }}>
          <textarea
            value={headers}
            onChange={e => { setHeaders(e.target.value); setResult(null) }}
            placeholder="Paste email headers here..."
            rows={10}
            style={{
              width: '100%', padding: '16px', border: 'none', outline: 'none',
              fontSize: 12.5, lineHeight: 1.7, resize: 'vertical',
              fontFamily: 'monospace', color: 'var(--ink)',
              background: 'transparent', boxSizing: 'border-box', minHeight: 200,
            }}
          />
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg)',
          }}>
            <button onClick={() => { setHeaders(EXAMPLE); setResult(null) }} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--blue-600)', fontSize: 12, fontWeight: 600,
            }}>Try example headers</button>
            {headers && (
              <button onClick={() => { setHeaders(''); setResult(null) }} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--ink-4)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
              }}>
                <Trash2 size={13} /> Clear
              </button>
            )}
          </div>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 10,
            background: '#fff1f2', border: '1px solid #fecaca',
            fontSize: 14, color: '#dc2626', marginBottom: 16,
          }}>{error}</div>
        )}

        <button onClick={handleAnalyze} disabled={loading || !headers.trim()} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 24px', borderRadius: 10,
          background: 'var(--blue-600)', color: '#fff', border: 'none',
          fontSize: 15, fontWeight: 600,
          cursor: (loading || !headers.trim()) ? 'not-allowed' : 'pointer',
          opacity: (loading || !headers.trim()) ? .6 : 1, transition: 'all .2s', marginBottom: 24,
        }}>
          {loading
            ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</>
            : <><Mail size={16} /> Analyze headers</>}
        </button>

        {result && <ResultCard result={result} />}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </AppLayout>
  )
}
