import React, { useEffect, useRef } from 'react'
import { INTRO_STATES } from '../IntroStateMachine'
import { INTRO_CONFIG } from '../introConfig'

export default function HomepageLightingOverlay({
  currentState,
  lerpPosRef,
  campfirePos,
  isTouch,
  isReducedMotion
}) {
  const maskRef = useRef(null)
  const waveRef = useRef(null)

  const isTorchLit = [
    INTRO_STATES.TORCH_LIT,
    INTRO_STATES.SEARCHING_FOR_CAMPFIRE,
    INTRO_STATES.CAMPFIRE_IGNITING
  ].includes(currentState)

  const isIlluminating = currentState === INTRO_STATES.HOMEPAGE_ILLUMINATING

  // Spotlight radial mask following burning cursor torch
  useEffect(() => {
    if (!isTorchLit) return

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
  }, [isTorchLit, isTouch, lerpPosRef])

  return (
    <>
      {/* Dark Spotlight Mask Layer above Homepage */}
      {isTorchLit && (
        <div
          ref={maskRef}
          className="homepage-darkness-mask"
          style={{ opacity: 0.98 }}
        />
      )}

      {/* Expanding Illumination Wave from Campfire */}
      {isIlluminating && (
        <div
          ref={waveRef}
          className="final-illumination-wave"
          style={{
            left: `${campfirePos.x}px`,
            top: `${campfirePos.y}px`,
            width: '10px',
            height: '10px',
            animation: `expandWave ${isReducedMotion ? 1.2 : 2.5}s cubic-bezier(0.16, 1, 0.3, 1) forwards`
          }}
        />
      )}

      <style>{`
        @keyframes expandWave {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          70% {
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(400);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
