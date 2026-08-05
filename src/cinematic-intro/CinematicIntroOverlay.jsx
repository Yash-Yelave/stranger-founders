import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { INTRO_STATES, canTransition } from './IntroStateMachine'
import { INTRO_CONFIG } from './introConfig'
import { usePointerTracking } from './hooks/usePointerTracking'
import { useCampfireTargetPosition } from './hooks/useCampfireTargetPosition'
import { isWithinProximity, getDistance } from './hooks/useProximityDetection'
import { useReducedMotion } from './hooks/useReducedMotion'

import DoorScene from './scenes/DoorScene'
import DarknessTransition from './scenes/DarknessTransition'
import StationaryTorch from './scenes/StationaryTorch'
import CursorTorch from './scenes/CursorTorch'
import CampfireIgnition from './scenes/CampfireIgnition'
import HomepageLightingOverlay from './scenes/HomepageLightingOverlay'

import './cinematicIntroStyles.css'

export default function CinematicIntroOverlay() {
  const { pathname } = useLocation()
  const [currentState, setCurrentState] = useState(INTRO_STATES.INITIALIZING)
  const [ignitionProgress, setIgnitionProgress] = useState(0)

  const stationaryTorchPosRef = useRef({ x: 0, y: 0 })
  const ignitionTimerRef = useRef(null)

  const isReducedMotion = useReducedMotion()
  const campfirePos = useCampfireTargetPosition()
  const { lerpPosRef, velocityRef, isTouch } = usePointerTracking(currentState !== INTRO_STATES.INTRO_COMPLETED)

  // State Transition Manager
  const transitionTo = useCallback((nextState) => {
    setCurrentState((prev) => {
      if (canTransition(prev, nextState)) {
        return nextState
      }
      return prev
    })
  }, [])

  // Skip Intro Control (Accessibility)
  const handleSkipIntro = useCallback(() => {
    transitionTo(INTRO_STATES.INTRO_COMPLETED)
  }, [transitionTo])

  // Initialize intro on mounting homepage
  useEffect(() => {
    if (pathname !== '/') return

    // Prevent body scroll during initial scenes
    document.body.style.overflow = 'hidden'

    // Preload & transition to DOOR_LOCKED
    const preloadTimer = setTimeout(() => {
      transitionTo(INTRO_STATES.DOOR_LOCKED)
    }, 400)

    return () => clearTimeout(preloadTimer)
  }, [pathname, transitionTo])

  // Scene 6: Torch Ignition Proximity Handler (Cursor Torch -> Stationary Torch)
  useEffect(() => {
    if (currentState !== INTRO_STATES.TORCH_AVAILABLE) return

    let animId = null
    const radius = isTouch ? INTRO_CONFIG.TORCH_IGNITE_MOBILE_RADIUS : INTRO_CONFIG.TORCH_IGNITE_PROXIMITY_RADIUS

    const checkTorchIgnition = () => {
      if (lerpPosRef.current && stationaryTorchPosRef.current) {
        if (isWithinProximity(lerpPosRef.current, stationaryTorchPosRef.current, radius)) {
          transitionTo(INTRO_STATES.TORCH_IGNITION)

          setTimeout(() => {
            transitionTo(INTRO_STATES.TORCH_LIT)
            transitionTo(INTRO_STATES.SEARCHING_FOR_CAMPFIRE)
          }, 600)
        }
      }
      animId = requestAnimationFrame(checkTorchIgnition)
    }

    animId = requestAnimationFrame(checkTorchIgnition)
    return () => cancelAnimationFrame(animId)
  }, [currentState, isTouch, lerpPosRef, transitionTo])

  // Scene 9: Campfire Ignition Proximity & Progressive Hold Handler
  useEffect(() => {
    if (
      currentState !== INTRO_STATES.SEARCHING_FOR_CAMPFIRE &&
      currentState !== INTRO_STATES.CAMPFIRE_IGNITING
    ) return

    let animId = null
    const radius = isTouch ? INTRO_CONFIG.CAMPFIRE_MOBILE_RADIUS : INTRO_CONFIG.CAMPFIRE_PROXIMITY_RADIUS

    const checkCampfireProximity = () => {
      if (lerpPosRef.current && campfirePos) {
        const isNear = isWithinProximity(lerpPosRef.current, campfirePos, radius)

        if (isNear) {
          if (currentState !== INTRO_STATES.CAMPFIRE_IGNITING) {
            transitionTo(INTRO_STATES.CAMPFIRE_IGNITING)
          }

          setIgnitionProgress((prev) => {
            const next = Math.min(1, prev + 0.025)
            if (next >= 1) {
              transitionTo(INTRO_STATES.CAMPFIRE_LIT)

              // Trigger final illumination animation sequence
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
          if (currentState === INTRO_STATES.CAMPFIRE_IGNITING) {
            transitionTo(INTRO_STATES.SEARCHING_FOR_CAMPFIRE)
          }
          setIgnitionProgress((prev) => Math.max(0, prev - 0.04))
        }
      }

      animId = requestAnimationFrame(checkCampfireProximity)
    }

    animId = requestAnimationFrame(checkCampfireProximity)
    return () => cancelAnimationFrame(animId)
  }, [campfirePos, currentState, isReducedMotion, isTouch, lerpPosRef, transitionTo])

  // Complete Teardown & Cleanup Strategy when intro finishes
  useEffect(() => {
    if (currentState === INTRO_STATES.INTRO_COMPLETED) {
      document.body.style.overflow = ''
      document.body.style.cursor = ''
    }
  }, [currentState])

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
    INTRO_STATES.TORCH_LIT,
    INTRO_STATES.SEARCHING_FOR_CAMPFIRE,
    INTRO_STATES.CAMPFIRE_IGNITING,
    INTRO_STATES.CAMPFIRE_LIT,
    INTRO_STATES.HOMEPAGE_ILLUMINATING
  ].includes(currentState)

  const isDoorSceneActive = [
    INTRO_STATES.INITIALIZING,
    INTRO_STATES.DOOR_LOCKED,
    INTRO_STATES.SCROLLING_TO_BOXES,
    INTRO_STATES.SEARCHING_FOR_KEY,
    INTRO_STATES.KEY_FOUND,
    INTRO_STATES.KEY_DRAGGING,
    INTRO_STATES.KEY_INSERTED,
    INTRO_STATES.DOOR_UNLOCKING,
    INTRO_STATES.DOOR_OPENING,
    INTRO_STATES.ENTERING_DARKNESS
  ].includes(currentState)

  const isDarknessTransitionActive = [
    INTRO_STATES.ENTERING_DARKNESS,
    INTRO_STATES.DISTANT_LIGHT,
    INTRO_STATES.LIGHT_APPROACHING,
    INTRO_STATES.WHITE_FLASH,
    INTRO_STATES.RETURN_TO_DARKNESS
  ].includes(currentState)

  const isSolidBlackActive = [
    INTRO_STATES.RETURN_TO_DARKNESS,
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

      {/* Scene 1 & 2: Locked Door & Key Search */}
      {isDoorSceneActive && (
        <DoorScene currentState={currentState} onTransition={transitionTo} />
      )}

      {/* Scene 3 & 4: Darkness Entry & Approaching Light */}
      {isDarknessTransitionActive && (
        <DarknessTransition
          currentState={currentState}
          onTransition={transitionTo}
          isReducedMotion={isReducedMotion}
        />
      )}

      {/* Full Pitch Black Layer (Before Flambeau Ignition) */}
      {isSolidBlackActive && (
        <div className="solid-black-layer" />
      )}

      {/* Scene 6: Right Stationary Burning Torch */}
      {currentState === INTRO_STATES.TORCH_AVAILABLE && (
        <StationaryTorch torchPosRef={stationaryTorchPosRef} />
      )}

      {/* Scene 5 & 7: Handheld Flambeau Cursor */}
      {isCursorTorchActive && (
        <CursorTorch
          lerpPosRef={lerpPosRef}
          velocityRef={velocityRef}
          isLit={isTorchLit}
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
        />
      )}

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
