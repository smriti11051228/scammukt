import React, { useState, useRef, useEffect } from 'react'
import AppLayout from '../components/AppLayout.jsx'
import { sendChat } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Send, Loader2, Bot } from 'lucide-react'

const SUGGESTIONS = [
  'How do I spot a phishing email?',
  'What are common WhatsApp scams in India?',
  'How do I check if a website is safe?',
  'What is smishing and how to avoid it?',
]

export default function Chatbot() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m ScamShield AI 🛡️ Ask me anything about spam, phishing, or online safety.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (question) => {
    const q = question || input.trim()
    if (!q || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setLoading(true)
    try {
      const res = await sendChat(q)
      setMessages(prev => [...prev, { role: 'bot', text: res.data.answer }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: '⚠️ Something went wrong. Please try again.' }])
    } finally { setLoading(false) }
  }

  return (
    <AppLayout title="AI Chatbot">
      <div style={{
        maxWidth: 720, height: 'calc(100vh - 140px)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', display: 'flex',
          flexDirection: 'column', gap: 14, paddingBottom: 16,
        }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              gap: 8, alignItems: 'flex-end',
            }}>
              {m.role === 'bot' && (
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'var(--blue-600)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bot size={15} color="#fff" />
                </div>
              )}
              <div style={{
                maxWidth: '75%', padding: '11px 15px', borderRadius: 14,
                borderBottomLeftRadius: m.role === 'bot' ? 4 : 14,
                borderBottomRightRadius: m.role === 'user' ? 4 : 14,
                background: m.role === 'user' ? 'var(--blue-600)' : '#fff',
                color: m.role === 'user' ? '#fff' : 'var(--ink)',
                fontSize: 14, lineHeight: 1.65,
                border: m.role === 'bot' ? '1px solid var(--border)' : 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,.06)',
                whiteSpace: 'pre-wrap',
              }}>
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'var(--blue-600)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={15} color="#fff" />
              </div>
              <div style={{
                padding: '11px 15px', borderRadius: 14, borderBottomLeftRadius: 4,
                background: '#fff', border: '1px solid var(--border)',
                display: 'flex', gap: 4, alignItems: 'center',
              }}>
                {[0, 1, 2].map(d => (
                  <div key={d} style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: 'var(--ink-4)',
                    animation: `bounce .9s ease ${d * .15}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => send(s)} style={{
                padding: '7px 13px', borderRadius: 100,
                background: '#fff', border: '1px solid var(--border)',
                fontSize: 12.5, color: 'var(--ink-2)', cursor: 'pointer',
                transition: 'all .15s', fontFamily: 'inherit',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue-400)'; e.currentTarget.style.color = 'var(--blue-600)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--ink-2)' }}
              >{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{
          display: 'flex', gap: 8,
          background: '#fff', border: '1.5px solid var(--border)',
          borderRadius: 12, padding: '8px 8px 8px 14px',
        }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask about spam, phishing, or safety..."
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 14, color: 'var(--ink)', fontFamily: 'inherit',
              background: 'transparent',
            }}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()} style={{
            width: 36, height: 36, borderRadius: 8,
            background: input.trim() ? 'var(--blue-600)' : 'var(--bg)',
            border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all .2s', flexShrink: 0,
          }}>
            {loading
              ? <Loader2 size={15} color="var(--ink-4)" style={{ animation: 'spin 1s linear infinite' }} />
              : <Send size={15} color={input.trim() ? '#fff' : 'var(--ink-4)'} />}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin   { to { transform: rotate(360deg) } }
        @keyframes bounce { 0%,80%,100% { transform: translateY(0) } 40% { transform: translateY(-5px) } }
      `}</style>
    </AppLayout>
  )
}
