import React, { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout.jsx'
import { getHistory } from '../services/api.js'
import { Loader2, CheckCircle, XCircle, AlertTriangle, ScanSearch, Image, Link2, Mail } from 'lucide-react'

const typeIcon = {
  TEXT:         <ScanSearch size={14} />,
  IMAGE:        <Image size={14} />,
  URL:          <Link2 size={14} />,
  EMAIL_HEADER: <Mail size={14} />,
}

const verdictStyle = {
  SPAM:       { color: '#dc2626', bg: '#fff1f2', icon: <XCircle size={13} /> },
  LEGITIMATE: { color: '#059669', bg: '#f0fdf4', icon: <CheckCircle size={13} /> },
  DANGEROUS:  { color: '#dc2626', bg: '#fff1f2', icon: <XCircle size={13} /> },
  SUSPICIOUS: { color: '#d97706', bg: '#fffbeb', icon: <AlertTriangle size={13} /> },
  SAFE:       { color: '#059669', bg: '#f0fdf4', icon: <CheckCircle size={13} /> },
}

function HistoryRow({ item }) {
  const [expanded, setExpanded] = useState(false)
  const vs = verdictStyle[item.verdict] || { color: 'var(--ink-3)', bg: 'var(--bg)', icon: null }

  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)',
      borderRadius: 10, overflow: 'hidden', marginBottom: 8,
    }}>
      <button onClick={() => setExpanded(!expanded)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
        padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        {/* Type badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '3px 9px', borderRadius: 100, background: 'var(--bg)',
          fontSize: 11, fontWeight: 600, color: 'var(--ink-3)',
          flexShrink: 0, textTransform: 'uppercase',
        }}>
          {typeIcon[item.type] || <ScanSearch size={14} />}
          <span>{item.type?.replace('_', ' ')}</span>
        </div>

        {/* Preview */}
        <span style={{
          flex: 1, fontSize: 13.5, color: 'var(--ink-2)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.url || item.preview || '(image scan)'}
        </span>

        {/* Verdict */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '3px 10px', borderRadius: 100,
          background: vs.bg, color: vs.color,
          fontSize: 11, fontWeight: 700, flexShrink: 0,
        }}>
          {vs.icon} {item.verdict}
        </div>

        {/* Date */}
        <span style={{ fontSize: 11, color: 'var(--ink-4)', flexShrink: 0 }}>
          {new Date(item.date).toLocaleDateString()}
        </span>
      </button>

      {expanded && (
        <div style={{
          padding: '12px 16px 14px', borderTop: '1px solid var(--border)',
          background: 'var(--bg)', display: 'flex', flexDirection: 'column', gap: 8,
          animation: 'fadeIn .2s ease',
        }}>
          {item.explanation && (
            <p style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>{item.explanation}</p>
          )}
          {item.confidence !== undefined && (
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
              Confidence: <strong style={{ color: 'var(--ink)' }}>{item.confidence}%</strong>
              {item.category && <> · Category: <strong style={{ color: 'var(--ink)' }}>{item.category}</strong></>}
              {item.language && <> · Language: <strong style={{ color: 'var(--ink)' }}>{item.language}</strong></>}
            </div>
          )}
          {item.flags && <p style={{ fontSize: 12, color: '#dc2626', margin: 0 }}>{item.flags}</p>}
          {item.riskLevel && (
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
              Risk: <strong style={{ color: 'var(--ink)' }}>{item.riskLevel}</strong>
              {item.maliciousCount !== undefined && <> · Malicious engines: <strong style={{ color: 'var(--ink)' }}>{item.maliciousCount}</strong></>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function History() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('spam')

  useEffect(() => {
    getHistory()
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const items = tab === 'spam' ? (data?.spamHistory || []) : (data?.urlHistory || [])

  return (
    <AppLayout title="Scan History">
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--blue-600)' }} />
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
            {[
              { key: 'spam', label: `Messages (${data?.spamHistory?.length || 0})` },
              { key: 'url',  label: `URLs (${data?.urlHistory?.length || 0})` },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, transition: 'all .15s',
                background: tab === t.key ? 'var(--blue-600)' : '#fff',
                color: tab === t.key ? '#fff' : 'var(--ink-2)',
                border: `1px solid ${tab === t.key ? 'var(--blue-600)' : 'var(--border)'}`,
              }}>{t.label}</button>
            ))}
          </div>

          {items.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 24px',
              background: '#fff', borderRadius: 12, border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
              <p style={{ fontSize: 15, color: 'var(--ink-3)' }}>No scans yet. Go analyze something!</p>
            </div>
          ) : (
            items.map((item, i) => <HistoryRow key={i} item={item} />)
          )}
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </AppLayout>
  )
}
