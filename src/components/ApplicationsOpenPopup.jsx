import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function ApplicationsOpenPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleIntroCompleted = () => {
      setIsVisible(true)
    }

    window.addEventListener('sf_intro_completed', handleIntroCompleted)

    // Check if intro is already finished (or not present on screen)
    const checkInterval = setInterval(() => {
      if (typeof window !== 'undefined') {
        const introRoot = document.querySelector('.cinematic-intro-root')
        if (!introRoot || window.__SF_INTRO_COMPLETED__) {
          setIsVisible(true)
        }
      }
    }, 200)

    return () => {
      window.removeEventListener('sf_intro_completed', handleIntroCompleted)
      clearInterval(checkInterval)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
  }

  if (!isVisible || isDismissed) return null

  return (
    <div className="sf-app-popup-wrapper" role="dialog" aria-label="Season 01 Applications Open">
      <div className="sf-app-popup-card">
        <button className="sf-app-popup-close" onClick={handleDismiss} aria-label="Close notification">
          ✕
        </button>
        <div className="sf-app-popup-badge">
          <span className="sf-popup-flame">🔥</span> Season 01 Applications Open
        </div>
        <h4 className="sf-app-popup-title">Request Your Seat at the Fire</h4>
        <p className="sf-app-popup-desc">
          Season 01 applications are officially open for creator founders. Four seats per episode.
        </p>
        <div className="sf-app-popup-actions">
          <Link to="/apply" className="btn btn-primary sf-popup-btn" onClick={handleDismiss}>
            Apply Now <span className="arw">→</span>
          </Link>
          <button className="btn btn-ghost sf-popup-btn-ghost" onClick={handleDismiss}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
