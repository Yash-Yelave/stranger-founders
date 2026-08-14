import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function ApplicationsOpenPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if dismissed in this session
    try {
      if (sessionStorage.getItem('sf_app_popup_dismissed') === 'true') {
        return
      }
    } catch (e) {}

    const handleIntroCompleted = () => {
      // Delay slightly for smooth entrance right as homepage illuminates
      setTimeout(() => {
        setIsVisible(true)
      }, 600)
    }

    // Listen for custom event from CinematicIntroOverlay
    window.addEventListener('sf_intro_completed', handleIntroCompleted)

    // Fallback: If intro was skipped or already completed on page load
    try {
      if (sessionStorage.getItem('sf_from_other_page') === 'true') {
        const timer = setTimeout(() => {
          setIsVisible(true)
        }, 800)
        return () => clearTimeout(timer)
      }
    } catch (e) {}

    return () => {
      window.removeEventListener('sf_intro_completed', handleIntroCompleted)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    try {
      sessionStorage.setItem('sf_app_popup_dismissed', 'true')
    } catch (e) {}
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
