import React, { useState, useEffect, useRef } from 'react'
import {
  Shield, ScanSearch, Link2, Image, Mail, MessageSquare,
  LayoutDashboard, Globe, ChevronDown, ChevronUp, ArrowRight,
  Menu, X, Lock
} from 'lucide-react'

/* ── tiny hook: animate elements when they enter viewport ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

/* ══════════════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all .3s ease',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 24px',
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={17} color="#fff" strokeWidth={2.2} />
          </div>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17, color: 'var(--ink)', letterSpacing: '-.3px' }}>
            ScamMukt
          </span>
        </a>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="desktop-nav">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} style={{
              fontSize: 14, fontWeight: 500, color: 'var(--ink-2)',
              textDecoration: 'none', transition: 'color .2s',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--blue-600)'}
              onMouseLeave={e => e.target.style.color = 'var(--ink-2)'}
            >{l.label}</a>
          ))}
        </nav>

        {/* Login button */}
        <a href="/login" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 18px', borderRadius: 8,
          border: '1.5px solid var(--blue-600)', color: 'var(--blue-600)',
          fontSize: 14, fontWeight: 600, textDecoration: 'none',
          transition: 'all .2s', background: 'transparent',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-600)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--blue-600)' }}
          className="login-btn"
        >
          <Lock size={13} strokeWidth={2.5} />
          Login
        </a>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="hamburger" style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 4,
          display: 'none', color: 'var(--ink)',
        }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: '#fff', borderTop: '1px solid var(--border)',
          padding: '16px 24px 20px',
        }}>
          {navLinks.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '10px 0', fontSize: 15, fontWeight: 500,
              color: 'var(--ink-2)', textDecoration: 'none', borderBottom: '1px solid var(--border)',
            }}>{l.label}</a>
          ))}
          <a href="/login" style={{
            display: 'flex', alignItems: 'center', gap: 6, marginTop: 14,
            padding: '10px 20px', borderRadius: 8, background: 'var(--blue-600)',
            color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none', justifyContent: 'center',
          }}>
            <Lock size={13} /> Login
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .login-btn   { display: none !important; }
          .hamburger   { display: flex !important; }
        }
      `}</style>
    </header>
  )
}

/* ══════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '120px 24px 80px', textAlign: 'center',
      background: 'linear-gradient(160deg, #eff6ff 0%, #f8faff 55%, #dbeafe 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle background orb */}
      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Badge */}
      <div className="fade-up" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 14px', borderRadius: 100,
        background: 'var(--blue-50)', border: '1px solid var(--blue-200)',
        fontSize: 12, fontWeight: 600, color: 'var(--blue-700)',
        letterSpacing: '.4px', textTransform: 'uppercase', marginBottom: 28,
      }}>
        <Shield size={11} strokeWidth={2.5} /> AI-Powered Protection
      </div>

      {/* Heading */}
      <h1 className="fade-up delay-1" style={{
        fontFamily: 'var(--font-serif)', fontWeight: 400,
        fontSize: 'clamp(2.4rem, 6vw, 4rem)',
        lineHeight: 1.12, color: 'var(--ink)',
        maxWidth: 680, marginBottom: 20, letterSpacing: '-.5px',
      }}>
        Stay safe from spam,<br />
        <span style={{ color: 'var(--blue-600)' }}>scams & phishing</span>
      </h1>

      {/* Subtext */}
      <p className="fade-up delay-2" style={{
        fontSize: 'clamp(1rem, 2.2vw, 1.15rem)', color: 'var(--ink-3)',
        maxWidth: 480, marginBottom: 40, lineHeight: 1.7, fontWeight: 400,
      }}>
        ScamMukt uses AI to instantly detect spam in text, images, URLs, and emails —
        all in one place, completely free.
      </p>

      {/* CTA buttons */}
      <div className="fade-up delay-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="/login" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '13px 28px', borderRadius: 10,
          background: 'var(--blue-600)', color: '#fff',
          fontSize: 15, fontWeight: 600, textDecoration: 'none',
          boxShadow: '0 4px 18px rgba(37,99,235,.28)',
          transition: 'all .2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-700)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--blue-600)'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          Get started free <ArrowRight size={16} />
        </a>
        <a href="#features" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '13px 28px', borderRadius: 10,
          background: '#fff', color: 'var(--ink-2)',
          fontSize: 15, fontWeight: 600, textDecoration: 'none',
          border: '1.5px solid var(--border)',
          transition: 'all .2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue-400)'; e.currentTarget.style.color = 'var(--blue-600)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--ink-2)' }}
        >
          See features
        </a>
      </div>

      {/* Stats row */}
      <div className="fade-up delay-4" style={{
        display: 'flex', gap: 40, marginTop: 64, flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {[
          { val: '8+', label: 'AI Features' },
          { val: '<2s', label: 'Analysis time' },
          { val: '100%', label: 'Free to use' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--blue-600)', fontFamily: 'var(--font-serif)' }}>{s.val}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-4)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* scroll cue */}
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', animation: 'fadeIn 1s ease 1.2s both' }}>
        <a href="#features" style={{ color: 'var(--ink-4)', display: 'block' }}>
          <ChevronDown size={22} />
        </a>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   FEATURES  (card grid like Brevo screenshot)
══════════════════════════════════════════════════════════ */
const features = [
  {
    icon: <ScanSearch size={22} strokeWidth={1.8} />,
    title: 'Spam Text Detection',
    desc: 'Paste any message or SMS and get an instant AI verdict — confidence score, category, and red flags.',
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    icon: <Image size={22} strokeWidth={1.8} />,
    title: 'Screenshot Analyzer',
    desc: 'Upload a screenshot of a suspicious message. Our AI reads the image and analyzes it automatically.',
    color: '#0d9488',
    bg: '#f0fdfa',
  },
  {
    icon: <Link2 size={22} strokeWidth={1.8} />,
    title: 'URL / Link Scanner',
    desc: 'Paste any link and run a dual-layer scan — VirusTotal reputation check plus AI structural analysis.',
    color: '#dc2626',
    bg: '#fff1f2',
  },
  {
    icon: <MessageSquare size={22} strokeWidth={1.8} />,
    title: 'AI Chatbot',
    desc: 'Ask anything about spam or safety. Our AI assistant explains results and gives personalised advice.',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    icon: <LayoutDashboard size={22} strokeWidth={1.8} />,
    title: 'Smart Dashboard',
    desc: 'See your spam trends, category breakdown charts, and AI-generated weekly insights — all in one view.',
    color: '#d97706',
    bg: '#fffbeb',
  },
  {
    icon: <Mail size={22} strokeWidth={1.8} />,
    title: 'Email Header Analyzer',
    desc: 'Paste raw email headers. ScamMukt decodes the origin, detects spoofing, and checks SPF / DKIM.',
    color: '#059669',
    bg: '#f0fdf4',
  },
  {
    icon: <Globe size={22} strokeWidth={1.8} />,
    title: 'Multi-language',
    desc: 'Works in Hindi, Telugu, Arabic, Chinese, Spanish and more. Results always returned in English.',
    color: '#0369a1',
    bg: '#f0f9ff',
  },
  {
    icon: <Shield size={22} strokeWidth={1.8} />,
    title: 'OTP Secure Login',
    desc: 'No passwords. Just your email and a one-time code. Simple, fast, and secure by design.',
    color: '#475569',
    bg: '#f8fafc',
  },
]

function Features() {
  const [ref, visible] = useInView()
  return (
    <section id="features" ref={ref} style={{ padding: '96px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Section label */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            fontSize: 12, fontWeight: 600, color: 'var(--blue-600)',
            letterSpacing: '.6px', textTransform: 'uppercase',
          }}>What ScamMukt can do</span>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 400, marginTop: 10, color: 'var(--ink)', letterSpacing: '-.3px',
          }}>Protect yourself your way</h2>
        </div>

        {/* Card grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: 16,
        }}>
          {features.map((f, i) => (
            <div key={f.title}
              className={visible ? `fade-up delay-${Math.min(i + 1, 8)}` : ''}
              style={{
                background: '#fff', border: '1.5px solid var(--border)',
                borderRadius: 14, padding: '26px 22px',
                transition: 'border-color .2s, transform .2s, box-shadow .2s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = f.color
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.07)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Icon bubble */}
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: f.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: f.color, marginBottom: 16,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   HOW IT WORKS  (numbered steps with dividers)
══════════════════════════════════════════════════════════ */
const steps = [
  {
    n: '01',
    title: 'Create your free account',
    desc: 'Sign up with just your email address. We send a one-time code — no passwords, no forms.',
  },
  {
    n: '02',
    title: 'Choose a feature',
    desc: 'Pick from spam text check, image upload, URL scan, chatbot, or email header analyzer.',
  },
  {
    n: '03',
    title: 'Get your AI verdict',
    desc: 'In under 2 seconds you get a clear verdict, confidence score, red flags, and a plain-English explanation.',
  },
  {
    n: '04',
    title: 'Track your history',
    desc: 'Every scan is saved to your dashboard. See trends, AI insights, and stay ahead of threats.',
  },
]

function HowItWorks() {
  const [ref, visible] = useInView()
  return (
    <section id="how" ref={ref} style={{
      padding: '96px 24px',
      background: 'linear-gradient(180deg, #f8faff 0%, #eff6ff 100%)',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue-600)', letterSpacing: '.6px', textTransform: 'uppercase' }}>Simple by design</span>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 400, marginTop: 10, color: 'var(--ink)', letterSpacing: '-.3px',
          }}>How it works</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {steps.map((step, i) => (
            <div key={step.n}>
              <div
                className={visible ? `fade-up delay-${i + 1}` : ''}
                style={{ display: 'flex', gap: 24, alignItems: 'flex-start', padding: '28px 0' }}
              >
                {/* Number */}
                <div style={{
                  minWidth: 48, height: 48, borderRadius: 12,
                  background: i === 0 ? 'var(--blue-600)' : '#fff',
                  border: `1.5px solid ${i === 0 ? 'var(--blue-600)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  color: i === 0 ? '#fff' : 'var(--blue-600)',
                  flexShrink: 0,
                }}>
                  {step.n}
                </div>
                {/* Text */}
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   FAQ
══════════════════════════════════════════════════════════ */
const faqs = [
  {
    q: 'Is ScamMukt completely free?',
    a: 'Yes. ScamMukt is 100% free. We use free-tier APIs (Gemini, VirusTotal, Neon DB) so there are no hidden charges.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'Yes. An account lets us save your scan history and generate personalised AI insights on your dashboard. Sign-up takes under 30 seconds — just your email and a one-time code.',
  },
  {
    q: 'What types of spam can ScamMukt detect?',
    a: 'ScamMukt detects phishing, scams, promotional spam, malware links, and spoofed emails across text, images, URLs, and raw email headers.',
  },
  {
    q: 'Which languages does it support?',
    a: 'ScamMukt works with messages in any language — Hindi, Telugu, Tamil, Arabic, Spanish, Chinese, and more. Results are always returned in English.',
  },
  {
    q: 'How does the URL scanner work?',
    a: 'We run a dual-layer check: VirusTotal scans the URL against 70+ security engines, and our Gemini AI analyses the URL structure for phishing patterns. You get both results combined.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Your scan history is private to your account. We do not sell data or share it with third parties.',
  },
]

function FAQ() {
  const [open, setOpen] = useState(null)
  const [ref, visible] = useInView()

  return (
    <section id="faq" ref={ref} style={{ padding: '96px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue-600)', letterSpacing: '.6px', textTransform: 'uppercase' }}>Got questions?</span>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 400, marginTop: 10, color: 'var(--ink)', letterSpacing: '-.3px',
          }}>Frequently asked</h2>
        </div>

        <div>
          {faqs.map((faq, i) => (
            <div key={i} className={visible ? `fade-up delay-${Math.min(i + 1, 6)}` : ''}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '20px 0', background: 'none',
                  border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{faq.q}</span>
                <span style={{ color: 'var(--blue-600)', flexShrink: 0 }}>
                  {open === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>

              {open === i && (
                <p style={{
                  fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.75,
                  paddingBottom: 20, animation: 'fadeIn .25s ease',
                }}>{faq.a}</p>
              )}

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   CTA BANNER
══════════════════════════════════════════════════════════ */
function CTABanner() {
  const [ref, visible] = useInView()
  return (
    <section ref={ref} style={{
      padding: '80px 24px',
      background: 'linear-gradient(135deg, var(--blue-700) 0%, var(--blue-500) 100%)',
      textAlign: 'center',
    }}>
      <div className={visible ? 'fade-up' : ''} style={{ maxWidth: 560, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
          color: '#fff', fontWeight: 400, marginBottom: 14, letterSpacing: '-.3px',
        }}>
          Start protecting yourself today
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,.75)', marginBottom: 32 }}>
          Free, instant, and no password required.
        </p>
        <a href="/login" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '13px 30px', borderRadius: 10,
          background: '#fff', color: 'var(--blue-700)',
          fontSize: 15, fontWeight: 700, textDecoration: 'none',
          boxShadow: '0 4px 18px rgba(0,0,0,.15)',
          transition: 'transform .2s',
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Get started — it's free <ArrowRight size={16} />
        </a>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{
      background: 'var(--ink)', color: 'rgba(255,255,255,.55)',
      padding: '40px 24px',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 20,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'var(--blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={14} color="#fff" />
          </div>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>ScamMukt</span>
        </div>

        {/* Quick links */}
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          {[
            { label: 'Features', href: '#features' },
            { label: 'How it works', href: '#how' },
            { label: 'FAQ', href: '#faq' },
            { label: 'Login', href: '/login' },
          ].map(l => (
            <a key={l.label} href={l.href} style={{
              fontSize: 13, color: 'rgba(255,255,255,.55)', textDecoration: 'none',
              transition: 'color .2s',
            }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.55)'}
            >{l.label}</a>
          ))}
        </div>

        {/* Copyright */}
        <p style={{ fontSize: 12 }}>© {new Date().getFullYear()} ScamMukt. All rights reserved.</p>
      </div>
    </footer>
  )
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </>
  )
}
