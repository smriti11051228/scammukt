import React, { useState, useCallback } from 'react'
import AppLayout from '../components/AppLayout.jsx'
import ResultCard from '../components/ResultCard.jsx'
import { analyzeImage } from '../services/api.js'
import { Image, Upload, Loader2, X } from 'lucide-react'

export default function ImageScan() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [drag, setDrag] = useState(false)

  const handleFile = (f) => {
    if (!f) return
    if (!f.type.startsWith('image/')) return setError('Please upload an image file (JPG, PNG, WEBP, GIF)')
    setFile(f); setResult(null); setError('')
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  const onDrop = useCallback(e => {
    e.preventDefault(); setDrag(false)
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }, [])

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true); setResult(null); setError('')
    try {
      const res = await analyzeImage(file)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Image analysis failed.')
    } finally { setLoading(false) }
  }

  const clear = () => { setFile(null); setPreview(null); setResult(null); setError('') }

  return (
    <AppLayout title="Image Scan">
      <div style={{ maxWidth: 720 }}>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 24 }}>
          Upload a screenshot of a suspicious message. Our AI reads and analyzes the text inside it.
        </p>

        {!preview ? (
          <div
            onDragOver={e => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById('img-input').click()}
            style={{
              border: `2px dashed ${drag ? 'var(--blue-500)' : 'var(--border)'}`,
              borderRadius: 14, padding: '56px 24px',
              textAlign: 'center', cursor: 'pointer',
              background: drag ? 'var(--blue-50)' : '#fff',
              transition: 'all .2s', marginBottom: 16,
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'var(--blue-50)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', color: 'var(--blue-600)',
            }}>
              <Upload size={24} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
              Drop your screenshot here
            </p>
            <p style={{ fontSize: 13, color: 'var(--ink-4)' }}>or click to browse · JPG, PNG, WEBP, GIF</p>
            <input id="img-input" type="file" accept="image/*" hidden onChange={e => handleFile(e.target.files[0])} />
          </div>
        ) : (
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <img src={preview} alt="preview" style={{
              width: '100%', maxHeight: 320, objectFit: 'contain',
              borderRadius: 12, border: '1px solid var(--border)', background: '#f8fafc',
            }} />
            <button onClick={clear} style={{
              position: 'absolute', top: 10, right: 10,
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(0,0,0,.55)', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <X size={14} color="#fff" />
            </button>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 8 }}>
              {file.name} — {(file.size / 1024).toFixed(1)} KB
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 10,
            background: '#fff1f2', border: '1px solid #fecaca',
            fontSize: 14, color: '#dc2626', marginBottom: 16,
          }}>{error}</div>
        )}

        <button onClick={handleAnalyze} disabled={loading || !file} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 24px', borderRadius: 10,
          background: 'var(--blue-600)', color: '#fff', border: 'none',
          fontSize: 15, fontWeight: 600, cursor: (loading || !file) ? 'not-allowed' : 'pointer',
          opacity: (loading || !file) ? .6 : 1, transition: 'all .2s', marginBottom: 24,
        }}>
          {loading
            ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing image...</>
            : <><Image size={16} /> Analyze image</>}
        </button>

        {result && <ResultCard result={result} />}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </AppLayout>
  )
}
