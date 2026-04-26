import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  Shield, LayoutDashboard, ScanSearch, Image, Link2,
  MessageSquare, Mail, History, LogOut, Menu, X, ChevronRight
} from 'lucide-react'

const navItems = [
  { href: '/dashboard',    icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { href: '/spam',         icon: <ScanSearch size={18} />,      label: 'Spam Checker' },
  { href: '/image',        icon: <Image size={18} />,           label: 'Image Scan' },
  { href: '/url',          icon: <Link2 size={18} />,           label: 'URL Scanner' },
  { href: '/chat',         icon: <MessageSquare size={18} />,   label: 'AI Chatbot' },
  { href: '/email-header', icon: <Mail size={18} />,            label: 'Email Headers' },
  { href: '/history',      icon: <History size={18} />,         label: 'History' },
]

export default function AppLayout({ children, title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const Sidebar = ({ mobile = false }) => (
    <aside style={{
      width: mobile ? '100%' : 220,
      background: '#fff',
      borderRight: mobile ? 'none' : '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      height: mobile ? 'auto' : '100%',
      flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'var(--blue-600)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Shield size={16} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>ScamMukt</span>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(item => {
          const active = location.pathname === item.href
          return (
            <Link key={item.href} to={item.href}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8, textDecoration: 'none',
                fontSize: 14, fontWeight: active ? 600 : 400,
                color: active ? 'var(--blue-600)' : 'var(--ink-2)',
                background: active ? 'var(--blue-50)' : 'transparent',
                transition: 'all .15s',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--ink)' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-2)' } }}
            >
              <span style={{ color: active ? 'var(--blue-600)' : 'var(--ink-4)' }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
        <div style={{
          padding: '10px 12px', borderRadius: 8, background: 'var(--bg)',
          marginBottom: 6,
        }}>
          <div style={{ fontSize: 11, color: 'var(--ink-4)', marginBottom: 1 }}>Logged in as</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email}
          </div>
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 12px', borderRadius: 8, border: 'none',
          background: 'none', cursor: 'pointer', fontSize: 14,
          color: 'var(--ink-3)', transition: 'all .15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fff1f2'; e.currentTarget.style.color = '#dc2626' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--ink-3)' }}
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Desktop sidebar */}
      <div className="desktop-sidebar">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          display: 'flex',
        }}>
          <div style={{
            width: 260, background: '#fff',
            boxShadow: '4px 0 24px rgba(0,0,0,.12)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 12px 0' }}>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={20} color="var(--ink-3)" />
              </button>
            </div>
            <Sidebar mobile />
          </div>
          <div style={{ flex: 1, background: 'rgba(0,0,0,.3)' }} onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <header style={{
          height: 58, display: 'flex', alignItems: 'center',
          padding: '0 24px', borderBottom: '1px solid var(--border)',
          background: '#fff', gap: 14, flexShrink: 0,
        }}>
          <button className="hamburger-app" onClick={() => setSidebarOpen(true)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 4, display: 'none', color: 'var(--ink)',
          }}>
            <Menu size={20} />
          </button>
          <h1 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{title}</h1>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '28px 24px' }}>
          {children}
        </main>
      </div>

      <style>{`
        .desktop-sidebar {
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none; }
          .hamburger-app   { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
