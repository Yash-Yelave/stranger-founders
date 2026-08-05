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

  const isTorchActive = [
    INTRO_STATES.TORCH_LIT,
    INTRO_STATES.SEARCHING_FOR_CAMPFIRE,
    INTRO_STATES.CAMPFIRE_IGNITING,
    INTRO_STATES.CAMPFIRE_LIT,
    INTRO_STATES.HOMEPAGE_ILLUMINATING
  ].includes(currentState)

  const isIlluminating = [
    INTRO_STATES.CAMPFIRE_LIT,
    INTRO_STATES.HOMEPAGE_ILLUMINATING
  ].includes(currentState)

  // Continuous frame-by-frame 13-second radial expansion loop
  useEffect(() => {
    if (!isTorchActive) return

    let animId = null
    let startTime = null

    const updateSpotlightMask = (timestamp) => {
      if (!maskRef.current) return

      if (isIlluminating) {
        if (!startTime) startTime = timestamp
        const elapsed = (timestamp - startTime) / 1000 // elapsed seconds
        const totalDuration = 13.0 // 13 seconds for full expansion

        const progress = Math.min(1, elapsed / totalDuration)

        // Smooth cubic ease-out expansion curve from 240px to 4500px
        const ease = 1 - Math.pow(1 - progress, 3)
        const currentRadius = 240 + ease * 4200

        const cx = campfirePos ? campfirePos.x : window.innerWidth / 2
        const cy = campfirePos ? campfirePos.y : window.innerHeight * 0.75

        const maskStyle = `radial-gradient(circle ${currentRadius}px at ${cx}px ${cy}px, transparent 0%, transparent 55%, rgba(0,0,0,0.85) 80%, #000000 100%)`
        maskRef.current.style.background = maskStyle
      } else if (lerpPosRef.current) {
        const x = lerpPosRef.current.x
        const y = lerpPosRef.current.y
        const radius = isTouch
          ? INTRO_CONFIG.TORCH_SPOTLIGHT_RADIUS_MOBILE
          : INTRO_CONFIG.TORCH_SPOTLIGHT_RADIUS_DESKTOP

        const maskStyle = `radial-gradient(circle ${radius}px at ${x}px ${y}px, transparent 0%, rgba(0,0,0,0.92) 80%, #000000 100%)`
        maskRef.current.style.background = maskStyle
      }

      animId = requestAnimationFrame(updateSpotlightMask)
    }

    animId = requestAnimationFrame(updateSpotlightMask)
    return () => cancelAnimationFrame(animId)
  }, [campfirePos, isIlluminating, isTorchActive, isTouch, lerpPosRef])

  return (
    <>
      {/* Dark Spotlight Mask Layer dissolving ultra-slowly over 13s */}
      {isTorchActive && (
        <div
          ref={maskRef}
          className="homepage-darkness-mask"
          style={{
            opacity: isIlluminating ? 0 : 0.98,
            transition: isIlluminating
              ? 'opacity 13.0s cubic-bezier(0.12, 0.6, 0.2, 1)'
              : 'opacity 0.4s ease-out'
          }}
        />
      )}
    </>
  )
}
