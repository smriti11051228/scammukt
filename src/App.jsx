import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Home        from './pages/Home.jsx'
import Login       from './pages/Login.jsx'
import Dashboard   from './pages/Dashboard.jsx'
import SpamChecker from './pages/SpamChecker.jsx'
import ImageScan   from './pages/ImageScan.jsx'
import UrlScanner  from './pages/UrlScanner.jsx'
import Chatbot     from './pages/Chatbot.jsx'
import EmailHeader from './pages/EmailHeader.jsx'
import History     from './pages/History.jsx'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/dashboard"    element={<Protected><Dashboard /></Protected>} />
          <Route path="/spam"         element={<Protected><SpamChecker /></Protected>} />
          <Route path="/image"        element={<Protected><ImageScan /></Protected>} />
          <Route path="/url"          element={<Protected><UrlScanner /></Protected>} />
          <Route path="/chat"         element={<Protected><Chatbot /></Protected>} />
          <Route path="/email-header" element={<Protected><EmailHeader /></Protected>} />
          <Route path="/history"      element={<Protected><History /></Protected>} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
