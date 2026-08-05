import React from 'react'
import { INTRO_STATES } from '../IntroStateMachine'

export default function CampfireIgnition({ campfirePos, currentState, progress }) {
  const isIgniting = currentState === INTRO_STATES.CAMPFIRE_IGNITING
  const isLit = [INTRO_STATES.CAMPFIRE_LIT, INTRO_STATES.HOMEPAGE_ILLUMINATING].includes(currentState)

  if (!campfirePos) return null

  return (
    <div
      className="overlay-campfire-target"
      style={{
        left: `${campfirePos.x}px`,
        top: `${campfirePos.y}px`
      }}
    >
      {/* Unlit Campfire Overlay Logs & Pit */}
      <div className="overlay-campfire-wood" />

      {/* Progressive Hold Ignition Ring */}
      {isIgniting && (
        <div className="ignition-progress-ring">
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: `conic-gradient(#d69a5c ${progress * 360}deg, transparent 0deg)`,
              opacity: 0.6
            }}
          />
        </div>
      )}

      {/* Lit Campfire Overlay Flame (grows progressively) */}
      {(isIgniting || isLit) && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            width: `${40 + progress * 60}px`,
            height: `${50 + progress * 70}px`,
            borderRadius: '50% 50% 35% 35%',
            background: 'radial-gradient(ellipse at 50% 80%, #ffffff 15%, #f5ecd8 40%, #d69a5c 70%, #b3703a 90%)',
            boxShadow: '0 0 30px #d69a5c, 0 0 60px rgba(179, 112, 58, 0.8)',
            transform: `scale(${0.4 + progress * 0.6})`,
            transition: 'transform 0.2s ease-out'
          }}
        />
      )}
    </div>
  )
}
