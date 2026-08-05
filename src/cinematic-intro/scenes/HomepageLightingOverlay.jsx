import React, { useEffect, useRef } from 'react'
import { INTRO_STATES } from '../IntroStateMachine'
import { INTRO_CONFIG } from '../introConfig'

export default function HomepageLightingOverlay({
  currentState,
  lerpPosRef,
  isTouch
}) {
  const maskRef = useRef(null)

  const isTorchActive = [
    INTRO_STATES.TORCH_LIT,
    INTRO_STATES.SEARCHING_FOR_CAMPFIRE,
    INTRO_STATES.CAMPFIRE_IGNITING,
    INTRO_STATES.HOMEPAGE_ILLUMINATING
  ].includes(currentState)

  const isIlluminating = currentState === INTRO_STATES.HOMEPAGE_ILLUMINATING

  // Spotlight radial mask following burning cursor torch
  useEffect(() => {
    if (!isTorchActive || isIlluminating) return

    let animId = null
    const radius = isTouch
      ? INTRO_CONFIG.TORCH_SPOTLIGHT_RADIUS_MOBILE
      : INTRO_CONFIG.TORCH_SPOTLIGHT_RADIUS_DESKTOP

    const updateSpotlightMask = () => {
      if (maskRef.current && lerpPosRef.current) {
        const x = lerpPosRef.current.x
        const y = lerpPosRef.current.y

        const maskStyle = `radial-gradient(circle ${radius}px at ${x}px ${y}px, transparent 0%, rgba(0,0,0,0.92) 80%, #000000 100%)`
        maskRef.current.style.background = maskStyle
      }

      animId = requestAnimationFrame(updateSpotlightMask)
    }

    animId = requestAnimationFrame(updateSpotlightMask)
    return () => cancelAnimationFrame(animId)
  }, [isIlluminating, isTorchActive, isTouch, lerpPosRef])

  return (
    <>
      {/* Dark Spotlight Mask Layer dissolving smoothly to reveal original website colors */}
      {isTorchActive && (
        <div
          ref={maskRef}
          className="homepage-darkness-mask"
          style={{
            opacity: isIlluminating ? 0 : 0.98,
            transition: isIlluminating ? 'opacity 4.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'opacity 0.3s ease-out'
          }}
        />
      )}
    </>
  )
}
