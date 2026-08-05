import React, { useEffect, useState } from 'react'
import { INTRO_STATES } from '../IntroStateMachine'
import { INTRO_CONFIG } from '../introConfig'

export default function DarknessTransition({ currentState, onTransition, isReducedMotion }) {
  const [lightScale, setLightScale] = useState(0.25)
  const [lightOpacity, setLightOpacity] = useState(0.85)

  useEffect(() => {
    if (currentState === INTRO_STATES.DISTANT_LIGHT) {
      // Instantly start light approach
      onTransition(INTRO_STATES.LIGHT_APPROACHING)
      return
    }

    if (currentState === INTRO_STATES.LIGHT_APPROACHING) {
      const duration = isReducedMotion
        ? INTRO_CONFIG.REDUCED_MOTION.LIGHT_APPROACH_DURATION
        : INTRO_CONFIG.LIGHT_APPROACH_DURATION

      const start = performance.now()

      const animateLight = (now) => {
        const elapsed = now - start
        const progress = Math.min(1, elapsed / duration)

        // Smooth cubic ease-in growth
        const ease = progress * progress * progress
        const scale = 0.25 + ease * 35
        const opacity = 0.85 + progress * 0.15

        setLightScale(scale)
        setLightOpacity(opacity)

        if (progress < 1) {
          requestAnimationFrame(animateLight)
        } else {
          onTransition(INTRO_STATES.WHITE_FLASH)
        }
      }

      const animId = requestAnimationFrame(animateLight)
      return () => cancelAnimationFrame(animId)
    }

    if (currentState === INTRO_STATES.WHITE_FLASH) {
      const flashDuration = isReducedMotion
        ? INTRO_CONFIG.REDUCED_MOTION.WHITE_FLASH_DURATION
        : INTRO_CONFIG.WHITE_FLASH_DURATION

      const timer = setTimeout(() => {
        onTransition(INTRO_STATES.RETURN_TO_DARKNESS)
      }, flashDuration)

      return () => clearTimeout(timer)
    }

    if (currentState === INTRO_STATES.RETURN_TO_DARKNESS) {
      const timer = setTimeout(() => {
        onTransition(INTRO_STATES.TORCH_AVAILABLE)
      }, 600)

      return () => clearTimeout(timer)
    }
  }, [currentState, isReducedMotion, onTransition])

  const isLightVisible = [
    INTRO_STATES.DISTANT_LIGHT,
    INTRO_STATES.LIGHT_APPROACHING
  ].includes(currentState)

  const isWhiteFlash = currentState === INTRO_STATES.WHITE_FLASH

  return (
    <div className="cinematic-layer darkness-scene">
      {/* Prominent Approaching Distant Source of Light */}
      {isLightVisible && (
        <div
          className="distant-light-dot"
          style={{
            width: '100px',
            height: '100px',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${lightScale})`,
            opacity: lightOpacity,
            boxShadow: '0 0 60px #ffffff, 0 0 120px #f5ecd8, 0 0 200px #d69a5c, 0 0 350px rgba(179,112,58,0.7)'
          }}
        />
      )}

      {/* Controlled White Flash Screen */}
      {isWhiteFlash && (
        <div
          className="white-flash-screen"
          style={{
            opacity: isReducedMotion ? 0.5 : 1,
            transition: 'opacity 0.6s ease-in-out'
          }}
        />
      )}
    </div>
  )
}
