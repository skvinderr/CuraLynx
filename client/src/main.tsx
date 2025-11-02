import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import LearnMore from './pages/LearnMore.tsx'
import GetStarted from './pages/GetStarted.tsx'
import Dashboard from './pages/Dashboard.tsx'
import SessionPage from './pages/SessionPage.tsx'
import PatientTimeline from './pages/PatientTimeline.tsx'
import { TranscriptionPage } from './features/transcription'
import { PatientDashboardPage } from './features/patient'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/todays-session' element={<SessionPage />} />
        <Route path="/patient-timeline" element={<PatientTimeline />} />
        <Route path="/transcription" element={<TranscriptionPage />} />
        <Route path="/patient/dashboard" element={<PatientDashboardPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
