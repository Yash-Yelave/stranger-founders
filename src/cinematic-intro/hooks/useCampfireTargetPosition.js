import { useEffect, useState, useCallback } from 'react'

/**
 * Measure existing homepage campfire target position in viewport coordinates.
 * Reads existing DOM elements (.flame-outer / .hero-scene svg) without modifying Home.jsx.
 */
export function useCampfireTargetPosition() {
  const [campfirePos, setCampfirePos] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight - 100,
    width: 120,
    height: 60,
    isReady: false
  })

  const updatePosition = useCallback(() => {
    const flameEl = document.querySelector('.flame-outer') || document.querySelector('.hero-scene svg')
    
    if (flameEl) {
      const rect = flameEl.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      setCampfirePos({
        x: centerX,
        y: centerY,
        width: rect.width || 140,
        height: rect.height || 70,
        isReady: true
      })
    } else {
      // Mathematical fallback based on hero scene SVG viewBox 1600x1100 and xMidYMax slice
      const scale = Math.max(window.innerWidth / 1600, window.innerHeight / 1100)
      const fallbackX = window.innerWidth / 2
      const fallbackY = window.innerHeight - (1100 - 1048) * scale

      setCampfirePos({
        x: fallbackX,
        y: fallbackY,
        width: 140 * scale,
        height: 70 * scale,
        isReady: false
      })
    }
  }, [])

  useEffect(() => {
    updatePosition()

    const handleResize = () => updatePosition()
    const handleScroll = () => updatePosition()

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('orientationchange', handleResize)

    // ResizeObserver on body to capture dynamic layout adjustments
    let observer = null
    if (window.ResizeObserver) {
      observer = new ResizeObserver(updatePosition)
      observer.observe(document.body)
    }

    // Interval retry for early mounting before hero SVG completes rendering
    const retryInterval = setInterval(updatePosition, 300)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('orientationchange', handleResize)
      if (observer) observer.disconnect()
      clearInterval(retryInterval)
    }
  }, [updatePosition])

  return campfirePos
}
