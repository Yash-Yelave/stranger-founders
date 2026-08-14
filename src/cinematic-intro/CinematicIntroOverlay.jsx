import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { INTRO_STATES, canTransition } from './IntroStateMachine'
import { INTRO_CONFIG } from './introConfig'
import { usePointerTracking } from './hooks/usePointerTracking'
import { useCampfireTargetPosition } from './hooks/useCampfireTargetPosition'
import { isWithinProximity, getDistance } from './hooks/useProximityDetection'
import { useReducedMotion } from './hooks/useReducedMotion'

import TunnelScene from './scenes/TunnelScene'
import StationaryTorch from './scenes/StationaryTorch'
import CursorTorch from './scenes/CursorTorch'
import CampfireIgnition from './scenes/CampfireIgnition'
import HomepageLightingOverlay from './scenes/HomepageLightingOverlay'
import CampfireDirectionArrow from './scenes/CampfireDirectionArrow'

import './cinematicIntroStyles.css'

export default function CinematicIntroOverlay() {
  const { pathname } = useLocation()
  const [currentState, setCurrentState] = useState(() => {
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('sf_from_other_page') === 'true') {
        return INTRO_STATES.INTRO_COMPLETED
      }
    } catch (e) {}
    return INTRO_STATES.INITIALIZING
  })
  const [ignitionProgress, setIgnitionProgress] = useState(0)

  const stationaryTorchPosRef = useRef({ x: 0, y: 0 })
  const ignitionTimerRef = useRef(null)

  const isReducedMotion = useReducedMotion()
  const campfirePos = useCampfireTargetPosition()
  const { lerpPosRef, velocityRef, isTouch } = usePointerTracking(currentState !== INTRO_STATES.INTRO_COMPLETED)

  // State Transition Manager (Async to prevent React setstate-in-render warnings)
  const transitionTo = useCallback((nextState) => {
    setTimeout(() => {
      setCurrentState((prev) => {
        if (canTransition(prev, nextState)) {
          return nextState
        }
        return prev
      })
    }, 0)
  }, [])

  // Skip Intro Control (Accessibility)
  const handleSkipIntro = useCallback(() => {
    transitionTo(INTRO_STATES.INTRO_COMPLETED)
  }, [transitionTo])

  // Initialize intro on mounting homepage
  useEffect(() => {
    if (pathname !== '/') {
      try {
        sessionStorage.setItem('sf_from_other_page', 'true')
      } catch (e) {}
      return
    }

    try {
      if (sessionStorage.getItem('sf_from_other_page') === 'true') {
        sessionStorage.removeItem('sf_from_other_page')
        setCurrentState(INTRO_STATES.INTRO_COMPLETED)
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
        document.body.style.cursor = ''
        return
      }
    } catch (e) {}

    // Reset state for homepage load / reload
    setCurrentState(INTRO_STATES.INITIALIZING)

    // Prevent automatic browser scroll restoration on refresh/reload
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)

    // Prevent body scroll during initial scenes
    document.body.style.overflow = 'hidden'

    // Preload & transition to TEXT_STRANGER
    const preloadTimer = setTimeout(() => {
      transitionTo(INTRO_STATES.TEXT_STRANGER)
    }, 50)

    return () => clearTimeout(preloadTimer)
  }, [pathname, transitionTo])

  // Force programmatic scroll reset to top hero section (0,0) before torch scene starts & unlock webpage scroll during torch exploration
  useEffect(() => {
    if (pathname !== '/') {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      return
    }

    if (
      currentState === INTRO_STATES.TRANSITIONING_TO_DARKNESS ||
      currentState === INTRO_STATES.TORCH_AVAILABLE
    ) {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }

    const lockedStates = [
      INTRO_STATES.INITIALIZING,
      INTRO_STATES.TEXT_STRANGER,
      INTRO_STATES.TEXT_FOLLOW_ME,
      INTRO_STATES.TUNNEL_SCROLLING,
      INTRO_STATES.TRANSITIONING_TO_DARKNESS
    ]

    if (lockedStates.includes(currentState)) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [currentState, pathname])

  const hasTorchIgnitedRef = useRef(false)

  // Reset torch ignition ref on homepage mount
  useEffect(() => {
    if (pathname === '/') {
      hasTorchIgnitedRef.current = false
    }
  }, [pathname])

  // Scene 6: Torch Ignition Proximity Handler (Cursor Torch -> Stationary Torch)
  useEffect(() => {
    if (currentState !== INTRO_STATES.TORCH_AVAILABLE || hasTorchIgnitedRef.current) return

    let animId = null
    const radius = isTouch ? 110 : 90 // Generous activation area

    const checkTorchIgnition = () => {
      if (hasTorchIgnitedRef.current) return

      if (lerpPosRef.current && stationaryTorchPosRef.current) {
        if (isWithinProximity(lerpPosRef.current, stationaryTorchPosRef.current, radius)) {
          hasTorchIgnitedRef.current = true

          // Immediately start ignition animation without delay
          transitionTo(INTRO_STATES.TORCH_IGNITION)

          // Smooth 750ms flame transfer
          setTimeout(() => {
            transitionTo(INTRO_STATES.TORCH_LIT)
            transitionTo(INTRO_STATES.SEARCHING_FOR_CAMPFIRE)
          }, 750)
          return
        }
      }

      if (!hasTorchIgnitedRef.current) {
        animId = requestAnimationFrame(checkTorchIgnition)
      }
    }

    animId = requestAnimationFrame(checkTorchIgnition)
    return () => cancelAnimationFrame(animId)
  }, [currentState, isTouch, lerpPosRef, transitionTo])

  const hasIgnitedRef = useRef(false)

  // Reset ignition guard on homepage mount
  useEffect(() => {
    if (pathname === '/') {
      hasIgnitedRef.current = false
    }
  }, [pathname])

  // Scene 9: Campfire Ignition Proximity & Progressive Hold Handler
  useEffect(() => {
    if (
      currentState !== INTRO_STATES.SEARCHING_FOR_CAMPFIRE &&
      currentState !== INTRO_STATES.CAMPFIRE_IGNITING
    ) return

    let animId = null
    const radius = isTouch ? INTRO_CONFIG.CAMPFIRE_MOBILE_RADIUS : INTRO_CONFIG.CAMPFIRE_PROXIMITY_RADIUS

    const checkCampfireProximity = () => {
      if (hasIgnitedRef.current) return

      if (lerpPosRef.current && campfirePos) {
        const isNear = isWithinProximity(lerpPosRef.current, campfirePos, radius)

        if (isNear) {
          if (currentState !== INTRO_STATES.CAMPFIRE_IGNITING) {
            transitionTo(INTRO_STATES.CAMPFIRE_IGNITING)
          }

          setIgnitionProgress((prev) => {
            if (hasIgnitedRef.current) return 1

            const next = Math.min(1, prev + 0.025)
            if (next >= 1 && !hasIgnitedRef.current) {
              hasIgnitedRef.current = true

              // Fire final transition sequence EXACTLY ONCE
              transitionTo(INTRO_STATES.CAMPFIRE_LIT)

              setTimeout(() => {
                transitionTo(INTRO_STATES.HOMEPAGE_ILLUMINATING)
              }, 400)

              setTimeout(() => {
                transitionTo(INTRO_STATES.INTRO_COMPLETED)
              }, 400 + (isReducedMotion ? INTRO_CONFIG.REDUCED_MOTION.HOMEPAGE_ILLUMINATION_DURATION : INTRO_CONFIG.HOMEPAGE_ILLUMINATION_DURATION))
            }
            return next
          })
        } else {
          if (!hasIgnitedRef.current) {
            if (currentState === INTRO_STATES.CAMPFIRE_IGNITING) {
              transitionTo(INTRO_STATES.SEARCHING_FOR_CAMPFIRE)
            }
            setIgnitionProgress((prev) => Math.max(0, prev - 0.04))
          }
        }
      }

      if (!hasIgnitedRef.current) {
        animId = requestAnimationFrame(checkCampfireProximity)
      }
    }

    animId = requestAnimationFrame(checkCampfireProximity)
    return () => cancelAnimationFrame(animId)
  }, [campfirePos, currentState, isReducedMotion, isTouch, lerpPosRef, transitionTo])

  // Cursor visibility management: Hide default mouse cursor during torch effect, reveal after campfire is lit
  useEffect(() => {
    const isTorchEffectActive = [
      INTRO_STATES.TORCH_AVAILABLE,
      INTRO_STATES.TORCH_IGNITION,
      INTRO_STATES.TORCH_LIT,
      INTRO_STATES.SEARCHING_FOR_CAMPFIRE,
      INTRO_STATES.CAMPFIRE_IGNITING
    ].includes(currentState)

    if (isTorchEffectActive && !isTouch && pathname === '/') {
      document.body.classList.add('sf-hide-cursor')
      document.documentElement.classList.add('sf-hide-cursor')
      document.body.style.cursor = 'none'
      document.documentElement.style.cursor = 'none'
    } else {
      document.body.classList.remove('sf-hide-cursor')
      document.documentElement.classList.remove('sf-hide-cursor')
      document.body.style.cursor = ''
      document.documentElement.style.cursor = ''
    }

    return () => {
      document.body.classList.remove('sf-hide-cursor')
      document.documentElement.classList.remove('sf-hide-cursor')
      document.body.style.cursor = ''
      document.documentElement.style.cursor = ''
    }
  }, [currentState, isTouch, pathname])

  // Complete Teardown & Cleanup Strategy when intro finishes or on non-homepage route
  useEffect(() => {
    if (currentState === INTRO_STATES.INTRO_COMPLETED || pathname !== '/') {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.body.style.cursor = ''
      document.documentElement.style.cursor = ''
      document.body.classList.remove('sf-hide-cursor')
      document.documentElement.classList.remove('sf-hide-cursor')
    }
  }, [currentState, pathname])

  // Only render on homepage route and while intro is active
  if (pathname !== '/' || currentState === INTRO_STATES.INTRO_COMPLETED) {
    return null
  }

  const isCursorTorchActive = [
    INTRO_STATES.TORCH_AVAILABLE,
    INTRO_STATES.TORCH_IGNITION,
    INTRO_STATES.TORCH_LIT,
    INTRO_STATES.SEARCHING_FOR_CAMPFIRE,
    INTRO_STATES.CAMPFIRE_IGNITING,
    INTRO_STATES.CAMPFIRE_LIT
  ].includes(currentState)

  const isTorchLit = [
    INTRO_STATES.TORCH_IGNITION,
    INTRO_STATES.TORCH_LIT,
    INTRO_STATES.SEARCHING_FOR_CAMPFIRE,
    INTRO_STATES.CAMPFIRE_IGNITING,
    INTRO_STATES.CAMPFIRE_LIT,
    INTRO_STATES.HOMEPAGE_ILLUMINATING
  ].includes(currentState)

  const isTunnelSceneActive = [
    INTRO_STATES.INITIALIZING,
    INTRO_STATES.TEXT_STRANGER,
    INTRO_STATES.TEXT_FOLLOW_ME,
    INTRO_STATES.TUNNEL_SCROLLING,
    INTRO_STATES.TRANSITIONING_TO_DARKNESS
  ].includes(currentState)

  const isSolidBlackActive = [
    INTRO_STATES.TORCH_AVAILABLE,
    INTRO_STATES.TORCH_IGNITION
  ].includes(currentState)

  return (
    <div
      className={`cinematic-intro-root ${isCursorTorchActive && !isTouch ? 'hide-default-cursor' : ''}`}
    >
      {/* Unobtrusive Skip Intro Control */}
      <button
        className="intro-skip-btn"
        onClick={handleSkipIntro}
        aria-label="Skip Intro Experience"
      >
        Skip Intro ✕
      </button>

      {/* Opening Scene: White/Cream Perspective Tunnel ("Are you a stranger? -> Follow me") */}
      {isTunnelSceneActive && (
        <TunnelScene currentState={currentState} onTransition={transitionTo} />
      )}

      {/* Full Pitch Black Layer (Before Flambeau Ignition) */}
      {isSolidBlackActive && (
        <div className="solid-black-layer" />
      )}

      {/* Scene 6: Right Stationary Burning Torch */}
      {[
        INTRO_STATES.TORCH_AVAILABLE,
        INTRO_STATES.TORCH_IGNITION,
        INTRO_STATES.TORCH_LIT
      ].includes(currentState) && (
        <StationaryTorch torchPosRef={stationaryTorchPosRef} currentState={currentState} />
      )}

      {/* Scene 5 & 7: Handheld Flambeau Cursor */}
      {isCursorTorchActive && (
        <CursorTorch
          lerpPosRef={lerpPosRef}
          velocityRef={velocityRef}
          isLit={isTorchLit}
          isIgniting={currentState === INTRO_STATES.TORCH_IGNITION}
          isTouch={isTouch}
        />
      )}

      {/* Scene 8 & 9: Overlay Unlit/Igniting Campfire Target */}
      {(currentState === INTRO_STATES.SEARCHING_FOR_CAMPFIRE ||
        currentState === INTRO_STATES.CAMPFIRE_IGNITING ||
        currentState === INTRO_STATES.CAMPFIRE_LIT) && (
        <CampfireIgnition
          campfirePos={campfirePos}
          currentState={currentState}
          progress={ignitionProgress}
          lerpPosRef={lerpPosRef}
        />
      )}

      {/* Cursor-Attached Directional Campfire Arrow */}
      <CampfireDirectionArrow
        campfirePos={campfirePos}
        lerpPosRef={lerpPosRef}
        currentState={currentState}
        isTorchLit={isTorchLit}
      />

      {/* Scene 7 & 10: Dark Spotlight Mask & Illumination Wave */}
      <HomepageLightingOverlay
        currentState={currentState}
        lerpPosRef={lerpPosRef}
        campfirePos={campfirePos}
        isTouch={isTouch}
        isReducedMotion={isReducedMotion}
      />
    </div>
  )
}
