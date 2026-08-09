import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Grain from './components/Grain.jsx'
import SiteEffects from './components/SiteEffects.jsx'
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
  return (
    <>
      {/* Cinematic Interactive Introduction Overlay (Homepage only) */}
      <CinematicIntroOverlay />

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
