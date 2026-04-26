import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { sendOtp, verifyOtp } from '../services/api.js'
import { Shield, ArrowRight, Loader2, ArrowLeft } from 'lucide-react'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState('email') // 'email' | 'otp'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  useEffect(() => { if (user) navigate('/dashboard') }, [user])

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [countdown])

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!email.trim()) return setError('Please enter your email')
    setLoading(true); setError('')
    try {
      await sendOtp(email.trim().toLowerCase())
      setStep('otp')
      setCountdown(60)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Try again.')
    } finally { setLoading(false) }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) return setError('Please enter the 6-digit code')
    setLoading(true); setError('')
    try {
      const res = await verifyOtp(email.trim().toLowerCase(), otp.trim())
      login(res.data.token, res.data.email)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired code')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #eff6ff 0%, #f8faff 60%, #dbeafe 100%)',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--blue-600)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={20} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 20, color: 'var(--ink)' }}>ScamMukt</span>
          </a>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid var(--border)',
          boxShadow: '0 4px 24px rgba(0,0,0,.06)',
          padding: '36px 32px',
          animation: 'fadeUp .4s ease',
        }}>
          {step === 'email' ? (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>Welcome back</h2>
              <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 28 }}>
                Enter your email — we'll send a one-time code to sign you in.
              </p>
              <form onSubmit={handleSendOtp}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required autoFocus
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 9,
                    border: `1.5px solid ${error ? '#fca5a5' : 'var(--border)'}`,
                    fontSize: 14, outline: 'none', marginBottom: 8,
                    transition: 'border-color .2s', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--blue-400)'}
                  onBlur={e => e.target.style.borderColor = error ? '#fca5a5' : 'var(--border)'}
                />
                {error && <p style={{ fontSize: 13, color: '#dc2626', marginBottom: 12 }}>{error}</p>}
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '12px', borderRadius: 9,
                  background: 'var(--blue-600)', color: '#fff',
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: 15, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: loading ? .7 : 1, transition: 'all .2s', marginTop: 4,
                }}>
                  {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</> : <>Send code <ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          ) : (
            <>
              <button onClick={() => { setStep('email'); setError(''); setOtp('') }} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, color: 'var(--ink-3)', padding: 0, marginBottom: 20,
              }}>
                <ArrowLeft size={14} /> Back
              </button>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>Check your email</h2>
              <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 28 }}>
                We sent a 6-digit code to <strong style={{ color: 'var(--ink)' }}>{email}</strong>
              </p>
              <form onSubmit={handleVerifyOtp}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>
                  One-time code
                </label>
                <input
                  type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000" required autoFocus maxLength={6}
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 9,
                    border: `1.5px solid ${error ? '#fca5a5' : 'var(--border)'}`,
                    fontSize: 24, fontWeight: 700, letterSpacing: '8px', textAlign: 'center',
                    outline: 'none', marginBottom: 8, boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--blue-400)'}
                  onBlur={e => e.target.style.borderColor = error ? '#fca5a5' : 'var(--border)'}
                />
                {error && <p style={{ fontSize: 13, color: '#dc2626', marginBottom: 12 }}>{error}</p>}
                <button type="submit" disabled={loading || otp.length !== 6} style={{
                  width: '100%', padding: '12px', borderRadius: 9,
                  background: 'var(--blue-600)', color: '#fff',
                  border: 'none', cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                  fontSize: 15, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: (loading || otp.length !== 6) ? .6 : 1, transition: 'all .2s', marginTop: 4,
                }}>
                  {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Verifying...</> : 'Sign in'}
                </button>

                {/* Resend */}
                <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--ink-3)' }}>
                  {countdown > 0 ? (
                    <>Resend code in <strong style={{ color: 'var(--ink)' }}>{countdown}s</strong></>
                  ) : (
                    <button onClick={handleSendOtp} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--blue-600)', fontWeight: 600, fontSize: 13,
                    }}>Resend code</button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-4)', marginTop: 20 }}>
          By signing in you agree to use ScamMukt responsibly.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
