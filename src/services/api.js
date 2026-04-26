import axios from 'axios'

const API = axios.create({
  baseURL: 'https://backend-puth.onrender.com',
  timeout: 30000,
})

// Auto-attach JWT token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('email')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ────────────────────────────────────────────────────────
export const sendOtp    = (email) => API.post('/api/auth/send-otp', { email })
export const verifyOtp  = (email, otp) => API.post('/api/auth/verify-otp', { email, otp })

// ── Spam ────────────────────────────────────────────────────────
export const analyzeText        = (text)    => API.post('/api/spam/analyze', { text })
export const analyzeImage       = (file)    => {
  const form = new FormData()
  form.append('file', file)
  return API.post('/api/spam/image', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}
export const analyzeEmailHeader = (headers) => API.post('/api/spam/email-header', { headers })

// ── URL ─────────────────────────────────────────────────────────
export const scanUrl = (url) => API.post('/api/url/scan', { url })

// ── Chat ────────────────────────────────────────────────────────
export const sendChat      = (question) => API.post('/api/chat', { question })
export const getChatHistory = ()         => API.get('/api/chat/history')

// ── Dashboard & History ─────────────────────────────────────────
export const getDashboard = () => API.get('/api/dashboard')
export const getHistory   = () => API.get('/api/history')

export default API
