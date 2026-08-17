import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function ApplicationsOpenPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    let timerId = null

    // Handler when campfire ignites during fresh intro flow: Push popup after EXACT 1 SECOND!
    const handleCampfireLit = () => {
      if (timerId) clearTimeout(timerId)
      timerId = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
    }

    const handleIntroCompleted = () => {
      if (timerId) clearTimeout(timerId)
      timerId = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
    }

    window.addEventListener('sf_campfire_lit', handleCampfireLit)
    window.addEventListener('sf_intro_completed', handleIntroCompleted)

    return () => {
      window.removeEventListener('sf_campfire_lit', handleCampfireLit)
      window.removeEventListener('sf_intro_completed', handleIntroCompleted)
      if (timerId) clearTimeout(timerId)
    }
  }, [])

  useEffect(() => {
    if (isVisible && !isDismissed) {
      document.body.classList.add('sf-popup-open')
    } else {
      document.body.classList.remove('sf-popup-open')
    }

    return () => {
      document.body.classList.remove('sf-popup-open')
    }
  }, [isVisible, isDismissed])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    document.body.classList.remove('sf-popup-open')
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleDismiss()
    }
  }

  if (!isVisible || isDismissed) return null

  return (
    <div
      className="sf-app-popup-wrapper"
      role="dialog"
      aria-label="Season 01 Applications Open"
      onClick={handleBackdropClick}
    >
      <div className="sf-app-popup-card">
        <button className="sf-app-popup-close" onClick={handleDismiss} aria-label="Close notification">
          ✕
        </button>
        <div className="sf-app-popup-badge">
          <span className="sf-popup-flame">🔥</span> Season 01 Applications Open
        </div>
        <h4 className="sf-app-popup-title">Request Your Seat at the Fire</h4>
        <p className="sf-app-popup-desc">
          Season 01 applications are officially open for stranger founders. Four seats per episode.
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
