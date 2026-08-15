import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Grain from './components/Grain.jsx'
import SiteEffects from './components/SiteEffects.jsx'
import CinematicDoorOverlay from './cinematic-door-intro/CinematicDoorOverlay.jsx'
import CinematicIntroOverlay from './cinematic-intro/CinematicIntroOverlay.jsx'
import Home from './pages/Home.jsx'
import Experience from './pages/Experience.jsx'
import Season from './pages/Season.jsx'
import Partners from './pages/Partners.jsx'
import Apply from './pages/Apply.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()

  // Master One-Way Intro Phase: 'DOOR' -> 'CREAM_TEXT' -> 'COMPLETED'
  const [masterPhase, setMasterPhase] = useState(() => {
    if (typeof window === 'undefined' || pathname !== '/') return 'COMPLETED'
    try {
      if (sessionStorage.getItem('sf_intro_master_done') === 'true') {
        return 'COMPLETED'
      }
    } catch (e) {}
    return 'DOOR'
  })

  // Handlers for strict ONE-WAY forward progression
  const handleDoorComplete = () => {
    setMasterPhase((prev) => {
      if (prev === 'DOOR') {
        try { sessionStorage.setItem('sf_door_intro_done', 'true') } catch (e) {}
        return 'CREAM_TEXT'
      }
      return prev
    })
  }

  const handleFullIntroComplete = () => {
    setMasterPhase('COMPLETED')
    try { sessionStorage.setItem('sf_intro_master_done', 'true') } catch (e) {}
  }

  const handleSkipAllIntro = () => {
    setMasterPhase('COMPLETED')
    try {
      sessionStorage.setItem('sf_door_intro_done', 'true')
      sessionStorage.setItem('sf_intro_master_done', 'true')
    } catch (e) {}
  }

  const isDoorActive = masterPhase === 'DOOR' && pathname === '/'
  const isIntroActive = (masterPhase === 'DOOR' || masterPhase === 'CREAM_TEXT') && pathname === '/'

  return (
    <>
      {/* 1. Door + Key + Box Cinematic Overlay Layer (Active during DOOR phase) */}
      {isDoorActive && (
        <CinematicDoorOverlay
          onDoorComplete={handleDoorComplete}
          onSkipIntro={handleSkipAllIntro}
        />
      )}

      {/* 2. Cream Text & Torch Sequence (Active during DOOR & CREAM_TEXT phases, starts running when masterPhase === 'CREAM_TEXT') */}
      {isIntroActive && (
        <CinematicIntroOverlay
          isDoorActive={isDoorActive}
          onIntroComplete={handleFullIntroComplete}
        />
      )}

      {/* Scroll progress bar */}
      <div id="scrollProgress" className="scroll-progress" aria-hidden="true" />

      {/* Cursor glow (desktop only, hidden on touch via CSS) */}
      <div id="cursorGlow" className="cursor-glow" aria-hidden="true" />

      {/* Back to top */}
      <button id="backToTop" className="back-to-top" aria-label="Back to top">
        <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15" /></svg>
      </button>

      <Grain />
      <Nav />
      <SiteEffects />
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/lander"     element={<Navigate to="/" replace />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/story"      element={<Experience />} />
          <Route path="/season-01"  element={<Season />} />
          <Route path="/partners"   element={<Partners />} />
          <Route path="/apply"      element={<Apply />} />
          <Route path="*"           element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
