import React from 'react'
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react'

const verdictConfig = {
  SPAM:       { color: '#dc2626', bg: '#fff1f2', border: '#fecaca', icon: <XCircle size={20} />,       label: '🚨 SPAM' },
  LEGITIMATE: { color: '#059669', bg: '#f0fdf4', border: '#bbf7d0', icon: <CheckCircle size={20} />,   label: '✅ LEGITIMATE' },
  DANGEROUS:  { color: '#dc2626', bg: '#fff1f2', border: '#fecaca', icon: <XCircle size={20} />,       label: '🔴 DANGEROUS' },
  SUSPICIOUS: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: <AlertTriangle size={20} />, label: '⚠️ SUSPICIOUS' },
  SAFE:       { color: '#059669', bg: '#f0fdf4', border: '#bbf7d0', icon: <CheckCircle size={20} />,   label: '✅ SAFE' },
  UNKNOWN:    { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0', icon: <Info size={20} />,           label: '❓ UNKNOWN' },
}

export default function ResultCard({ result }) {
  if (!result) return null
  const verdict = result.verdict || 'UNKNOWN'
  const cfg = verdictConfig[verdict] || verdictConfig.UNKNOWN
  const flags = Array.isArray(result.redFlags)
    ? result.redFlags
    : typeof result.redFlags === 'string' && result.redFlags.startsWith('[')
      ? JSON.parse(result.redFlags)
      : result.redFlags ? [result.redFlags] : []

  return (
    <div style={{
      border: `1.5px solid ${cfg.border}`,
      borderRadius: 14, overflow: 'hidden',
      animation: 'fadeUp .4s ease',
    }}>
      {/* Verdict header */}
      <div style={{
        background: cfg.bg, padding: '18px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: cfg.color }}>
          {cfg.icon}
          <span style={{ fontWeight: 700, fontSize: 16 }}>{cfg.label}</span>
        </div>
        {result.confidence !== undefined && (
          <div style={{
            padding: '4px 12px', borderRadius: 100,
            background: '#fff', border: `1px solid ${cfg.border}`,
            fontSize: 13, fontWeight: 600, color: cfg.color,
          }}>
            {result.confidence}% confidence
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ background: '#fff', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Category */}
        {result.category && (
          <Row label="Category">
            <span style={{
              padding: '3px 10px', borderRadius: 100,
              background: 'var(--blue-50)', color: 'var(--blue-700)',
              fontSize: 12, fontWeight: 600,
            }}>{result.category}</span>
          </Row>
        )}

        {/* Language */}
        {result.language && (
          <Row label="Language"><span style={{ fontSize: 14, color: 'var(--ink-2)' }}>{result.language}</span></Row>
        )}

        {/* Explanation */}
        {result.explanation && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>Explanation</div>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.7 }}>{result.explanation}</p>
          </div>
        )}

        {/* Red flags */}
        {flags.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.4px' }}>Red Flags</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {flags.map((f, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  fontSize: 13.5, color: 'var(--ink-2)',
                }}>
                  <span style={{ color: '#dc2626', marginTop: 1, flexShrink: 0 }}>•</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* URL specific */}
        {result.maliciousCount !== undefined && (
          <Row label="Malicious engines">
            <span style={{ fontSize: 14, fontWeight: 600, color: result.maliciousCount > 0 ? '#dc2626' : '#059669' }}>
              {result.maliciousCount} / {result.totalEngines || '—'}
            </span>
          </Row>
        )}

        {/* Extracted text from image */}
        {result.extractedText && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>Text extracted from image</div>
            <p style={{
              fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6,
              background: 'var(--bg)', padding: '10px 14px', borderRadius: 8,
              border: '1px solid var(--border)',
            }}>{result.extractedText}</p>
          </div>
        )}

        {/* Email header specific */}
        {result.spoofingDetected !== undefined && (
          <Row label="Spoofing detected">
            <span style={{ fontSize: 14, fontWeight: 600, color: result.spoofingDetected ? '#dc2626' : '#059669' }}>
              {result.spoofingDetected ? '⚠️ Yes' : '✅ No'}
            </span>
          </Row>
        )}
        {result.spfStatus && <Row label="SPF Status"><Badge val={result.spfStatus} /></Row>}
        {result.dkimStatus && <Row label="DKIM Status"><Badge val={result.dkimStatus} /></Row>}
        {result.senderOrigin && <Row label="Sender Origin"><span style={{ fontSize: 14, color: 'var(--ink-2)' }}>{result.senderOrigin}</span></Row>}
      </div>
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '.4px' }}>{label}</span>
      {children}
    </div>
  )
}

function Badge({ val }) {
  const good = val === 'PASS'
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 600,
      background: good ? '#f0fdf4' : '#fff1f2',
      color: good ? '#059669' : '#dc2626',
    }}>{val}</span>
  )
}
