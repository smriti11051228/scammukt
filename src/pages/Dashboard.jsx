import React, { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout.jsx'
import { getDashboard } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { ScanSearch, Link2, AlertTriangle, CheckCircle, Loader2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  { href: '/spam',         label: 'Spam Checker',   desc: 'Analyze any text message',     color: 'var(--blue-600)',  bg: '#eff6ff' },
  { href: '/image',        label: 'Image Scan',      desc: 'Upload a screenshot',          color: '#0d9488',          bg: '#f0fdfa' },
  { href: '/url',          label: 'URL Scanner',     desc: 'Check any suspicious link',    color: '#dc2626',          bg: '#fff1f2' },
  { href: '/chat',         label: 'AI Chatbot',      desc: 'Ask about spam & safety',      color: '#7c3aed',          bg: '#f5f3ff' },
  { href: '/email-header', label: 'Email Headers',   desc: 'Analyze raw email headers',    color: '#059669',          bg: '#f0fdf4' },
  { href: '/history',      label: 'History',         desc: 'View all your past scans',     color: '#d97706',          bg: '#fffbeb' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <AppLayout title="Dashboard">
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
          Hello, {user?.email?.split('@')[0]} 👋
        </h2>
        <p style={{ fontSize: 14, color: 'var(--ink-3)' }}>Here's your protection overview</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--blue-600)' }} />
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 32 }}>
            {[
              { label: 'Total Scans',     val: data?.totalScans || 0,    icon: <ScanSearch size={18} />, color: 'var(--blue-600)', bg: '#eff6ff' },
              { label: 'Spam Detected',   val: data?.spamCount || 0,     icon: <AlertTriangle size={18} />, color: '#dc2626', bg: '#fff1f2' },
              { label: 'Legitimate',      val: data?.legitimateCount || 0, icon: <CheckCircle size={18} />, color: '#059669', bg: '#f0fdf4' },
              { label: 'Dangerous URLs',  val: data?.dangerousUrls || 0, icon: <Link2 size={18} />, color: '#d97706', bg: '#fffbeb' },
            ].map(s => (
              <div key={s.label} style={{
                background: '#fff', border: '1px solid var(--border)',
                borderRadius: 12, padding: '18px 16px',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: s.bg, color: s.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12,
                }}>{s.icon}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* AI Insights */}
          {data?.insights && data.insights !== '{}' && (() => {
            try {
              const ins = typeof data.insights === 'string' ? JSON.parse(data.insights) : data.insights
              return ins.insights?.length ? (
                <div style={{
                  background: '#eff6ff', border: '1px solid var(--blue-200)',
                  borderRadius: 12, padding: '20px', marginBottom: 32,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue-600)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 12 }}>
                    🤖 AI Insights
                  </div>
                  {ins.insights.map((insight, i) => (
                    <div key={i} style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 6, display: 'flex', gap: 8 }}>
                      <span style={{ color: 'var(--blue-500)' }}>›</span> {insight}
                    </div>
                  ))}
                  {ins.weeklyTip && (
                    <div style={{
                      marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--blue-200)',
                      fontSize: 13, color: 'var(--blue-700)', fontWeight: 500,
                    }}>
                      💡 Tip: {ins.weeklyTip}
                    </div>
                  )}
                </div>
              ) : null
            } catch { return null }
          })()}
        </>
      )}

      {/* Feature grid */}
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 14 }}>Quick access</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {features.map(f => (
            <Link key={f.href} to={f.href} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#fff', border: '1.5px solid var(--border)',
              borderRadius: 12, padding: '16px', textDecoration: 'none',
              transition: 'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>{f.label}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{f.desc}</div>
              </div>
              <ArrowRight size={16} color="var(--ink-4)" />
            </Link>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </AppLayout>
  )
}
