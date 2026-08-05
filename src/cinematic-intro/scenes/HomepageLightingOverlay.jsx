import React, { useEffect, useRef } from 'react'
import { INTRO_STATES } from '../IntroStateMachine'
import { INTRO_CONFIG } from '../introConfig'

export default function HomepageLightingOverlay({
  currentState,
  lerpPosRef,
  campfirePos,
  isTouch
}) {
  const maskRef = useRef(null)
  const startTimeRef = useRef(null)

  const isTorchActive = [
    INTRO_STATES.TORCH_LIT,
    INTRO_STATES.SEARCHING_FOR_CAMPFIRE,
    INTRO_STATES.CAMPFIRE_IGNITING,
    INTRO_STATES.CAMPFIRE_LIT,
    INTRO_STATES.HOMEPAGE_ILLUMINATING
  ].includes(currentState)

  const isIlluminating = currentState === INTRO_STATES.HOMEPAGE_ILLUMINATING

  // One-time continuous soft radial expansion reveal engine (6.0s ease-in-out)
  useEffect(() => {
    if (!isTorchActive) return

    let animId = null

    const updateSpotlightMask = (timestamp) => {
      if (!maskRef.current) return

      if (isIlluminating) {
        if (!startTimeRef.current) startTimeRef.current = timestamp
        const elapsed = (timestamp - startTimeRef.current) / 1000 // elapsed seconds
        const totalDuration = 6.0 // 6.0 seconds continuous smooth reveal

        const rawProgress = Math.min(1, Math.max(0, elapsed / totalDuration))

        // Standard smooth ease-in-out curve
        const ease = rawProgress < 0.5
          ? 2 * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2

        // Radius expands smoothly from 140px to 3800px
        const currentRadius = 140 + ease * 3660

        // Darkness opacity reduces gradually from 0.98 to 0.0
        const currentOpacity = 0.98 * (1 - ease)

        const cx = campfirePos ? campfirePos.x : window.innerWidth / 2
        const cy = campfirePos ? campfirePos.y : window.innerHeight * 0.75

        // Feathered soft radial gradient (no harsh edges)
        const darkMid = (0.85 * (1 - ease)).toFixed(3)
        const maskStyle = `radial-gradient(circle ${currentRadius.toFixed(0)}px at ${cx.toFixed(0)}px ${cy.toFixed(0)}px, transparent 0%, transparent 45%, rgba(0,0,0,${darkMid}) 75%, rgba(0,0,0,${currentOpacity.toFixed(3)}) 100%)`

        maskRef.current.style.background = maskStyle
        maskRef.current.style.opacity = currentOpacity.toFixed(3)
      } else if (lerpPosRef.current) {
        const x = lerpPosRef.current.x
        const y = lerpPosRef.current.y
        const radius = isTouch
          ? INTRO_CONFIG.TORCH_SPOTLIGHT_RADIUS_MOBILE
          : INTRO_CONFIG.TORCH_SPOTLIGHT_RADIUS_DESKTOP

        maskRef.current.style.background = `radial-gradient(circle ${radius}px at ${x}px ${y}px, transparent 0%, rgba(0,0,0,0.92) 80%, #000000 100%)`
        maskRef.current.style.opacity = '0.98'
      }

      animId = requestAnimationFrame(updateSpotlightMask)
    }

    animId = requestAnimationFrame(updateSpotlightMask)
    return () => cancelAnimationFrame(animId)
  }, [campfirePos, isIlluminating, isTorchActive, isTouch, lerpPosRef])

  return (
    <>
      {/* Dark Spotlight Mask Layer performing one-time continuous soft radial expansion */}
      {isTorchActive && (
        <div
          ref={maskRef}
          className="homepage-darkness-mask"
          style={{ opacity: 0.98 }}
        />
      )}
    </>
  )
}
