import React, { useEffect, useState } from 'react'
import { INTRO_STATES } from '../IntroStateMachine'

export default function CampfireIgnition({ campfirePos, currentState, progress, lerpPosRef }) {
  const [glowIntensity, setGlowIntensity] = useState(0.4)

  const isSearching = currentState === INTRO_STATES.SEARCHING_FOR_CAMPFIRE
  const isIgniting = currentState === INTRO_STATES.CAMPFIRE_IGNITING
  const isLit = [INTRO_STATES.CAMPFIRE_LIT, INTRO_STATES.HOMEPAGE_ILLUMINATING].includes(currentState)

  // Dynamic proximity glow calculation (glow boosts as burning torch comes closer)
  useEffect(() => {
    if (!isSearching && !isIgniting) return

    let animId = null
    const updateProximityGlow = () => {
      if (lerpPosRef?.current && campfirePos) {
        const dx = lerpPosRef.current.x - campfirePos.x
        const dy = lerpPosRef.current.y - campfirePos.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Map distance 350px -> 80px to glow intensity 0.35 -> 1.0
        const clampedDist = Math.max(80, Math.min(350, dist))
        const intensity = 0.35 + (1 - (clampedDist - 80) / 270) * 0.65
        setGlowIntensity(intensity)
      }
      animId = requestAnimationFrame(updateProximityGlow)
    }

    animId = requestAnimationFrame(updateProximityGlow)
    return () => cancelAnimationFrame(animId)
  }, [campfirePos, isIgniting, isSearching, lerpPosRef])

  if (!campfirePos) return null

  return (
    <div
      className={`overlay-campfire-target ${isLit ? 'fade-out' : ''}`}
      style={{
        left: `${campfirePos.x}px`,
        top: `${campfirePos.y}px`
      }}
    >
      {/* Unlit Campfire Overlay Logs & Pit */}
      <div className="overlay-campfire-wood" />

      {/* Visible, Dim Amber/Orange Target Oval with Proximity Boost */}
      {!isLit && (
        <div
          className="campfire-target-oval"
          style={{
            opacity: isLit ? 0 : Math.min(1, glowIntensity + (isIgniting ? 0.3 : 0)),
            boxShadow: `0 0 ${20 + glowIntensity * 25}px rgba(214, 154, 92, ${0.4 * glowIntensity}), inset 0 0 ${15 + glowIntensity * 20}px rgba(255, 152, 0, ${0.25 * glowIntensity})`
          }}
        >
          {/* Subtle Glowing Embers Visual Hint */}
          <div className="ember-particle ember-1" />
          <div className="ember-particle ember-2" />
          <div className="ember-particle ember-3" />
          <div className="ember-particle ember-4" />
        </div>
      )}

      {/* Progressive Ignition Ring when Torch Enters Activation Area */}
      {isIgniting && (
        <div className="ignition-progress-ring">
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: `conic-gradient(#ff9800 ${progress * 360}deg, transparent 0deg)`,
              opacity: 0.85
            }}
          />
        </div>
      )}

      {/* Lit Campfire Overlay Flame (grows progressively) */}
      {(isIgniting || isLit) && (
        <div
          className="overlay-campfire-flame"
          style={{
            position: 'absolute',
            bottom: '10px',
            width: `${40 + progress * 60}px`,
            height: `${50 + progress * 70}px`,
            borderRadius: '50% 50% 35% 35%',
            background: 'radial-gradient(ellipse at 50% 80%, #ffffff 15%, #f5ecd8 40%, #ff9800 70%, #e65100 90%)',
            boxShadow: '0 0 35px #ff9800, 0 0 70px rgba(255, 85, 0, 0.8)',
            transform: `scale(${0.4 + progress * 0.6})`,
            transition: 'transform 0.2s ease-out'
          }}
        />
      )}
    </div>
  )
}
