import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { DOOR_INTRO_STATES, isValidDoorTransition } from './doorIntroStateMachine'
import { DOOR_INTRO_CONFIG } from './doorIntroConfig'
import { useDoorPointerTracking } from './hooks/useDoorPointerTracking'
import { useDoorScrollProgress } from './hooks/useDoorScrollProgress'
import { checkDoorProximity } from './hooks/useDoorProximity'
import InitialDoorScene from './scenes/InitialDoorScene.jsx'
import ExplorationScene from './scenes/ExplorationScene.jsx'
import KeyItem from './scenes/KeyItem.jsx'
import './doorIntroStyles.css'

export default function CinematicDoorOverlay({ onDoorComplete, onSkipIntro }) {
  const { pathname } = useLocation()
  const [currentState, setCurrentState] = useState(DOOR_INTRO_STATES.DOOR_IDLE)
  const [isKeyPickedUp, setIsKeyPickedUp] = useState(false)
  const [isKeyFading, setIsKeyFading] = useState(false)
  const [keyRotation, setKeyRotation] = useState(0)
  const [cameraZoom, setCameraZoom] = useState(1)
  const [proximityProgress, setProximityProgress] = useState(0)
  const [isHandoffFading, setIsHandoffFading] = useState(false)

  const lockRef = useRef(null)
  const stateRef = useRef(currentState)
  stateRef.current = currentState

  // Pointer & Scroll hooks
  const { pointerPosRef, lerpPosRef } = useDoorPointerTracking(DOOR_INTRO_CONFIG.KEY_DRAG_LERP_FACTOR)
  const { scrollProgress, setProgress } = useDoorScrollProgress(
    ['DOOR_IDLE', 'EXPLORING', 'BOXES_VISIBLE', 'SEARCHING'].includes(currentState)
  )

  // Safe State Transition Handler
  const transitionTo = useCallback((nextState) => {
    if (isValidDoorTransition(stateRef.current, nextState)) {
      stateRef.current = nextState
      setCurrentState(nextState)
    }
  }, [])

  // 1. Initial mounting check: Active on homepage ('/')
  useEffect(() => {
    if (pathname !== '/') {
      setCurrentState(DOOR_INTRO_STATES.COMPLETE)
      return
    }

    setCurrentState(DOOR_INTRO_STATES.DOOR_IDLE)

    // Lock body scroll while door overlay is active
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [pathname])

  // 2. Pickup Key Handler: Picks up key and attaches it to user's cursor
  const handlePickupKey = () => {
    if (isKeyPickedUp) return
    setIsKeyPickedUp(true)
    transitionTo(DOOR_INTRO_STATES.KEY_PICKED)

    // Smoothly return view to door so user can manually place key on lock
    setProgress(0)
    setTimeout(() => {
      transitionTo(DOOR_INTRO_STATES.KEY_APPROACHING_LOCK)
    }, 400)
  }

  // 3. Key -> Lock Proximity Loop: Lock opens ONLY when user manually brings key near lock
  useEffect(() => {
    if (!isKeyPickedUp || !['KEY_PICKED', 'RETURNING_TO_DOOR', 'KEY_APPROACHING_LOCK'].includes(currentState)) return

    let animId
    const checkProximityLoop = () => {
      if (!lockRef.current) {
        animId = requestAnimationFrame(checkProximityLoop)
        return
      }

      const rect = lockRef.current.getBoundingClientRect()
      const lockCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      }

      const proximity = checkDoorProximity(
        lerpPosRef.current,
        lockCenter,
        DOOR_INTRO_CONFIG.LOCK_ACTIVATION_RADIUS
      )

      setProximityProgress(proximity.progress)

      // Snap & Unlock Sequence ONLY when user manually moves key into lock activation radius!
      if (proximity.isWithinRadius && (stateRef.current === DOOR_INTRO_STATES.KEY_APPROACHING_LOCK || stateRef.current === DOOR_INTRO_STATES.KEY_PICKED)) {
        transitionTo(DOOR_INTRO_STATES.KEY_SNAPPING)

        // Lock key position onto keyhole center for 100% precision
        lerpPosRef.current = { x: lockCenter.x, y: lockCenter.y }

        // 1. Key turns 90° smoothly in keyhole (350ms) - Door leaves REMAIN CLOSED
        setTimeout(() => {
          transitionTo(DOOR_INTRO_STATES.UNLOCKING)
          setKeyRotation(90)

          // 2. Key fades out into keyhole over 250ms until it is COMPLETELY NOT VISIBLE
          setTimeout(() => {
            setIsKeyFading(true)

            // 3. ONLY AFTER key is 100% gone, trigger door opening and camera zoom
            setTimeout(() => {
              transitionTo(DOOR_INTRO_STATES.DOOR_OPENING)

              // 4. Door leaves open AND camera SIMULTANEOUSLY zooms forward into dark doorway (1200ms)
              setTimeout(() => {
                transitionTo(DOOR_INTRO_STATES.ENTERING_DOOR)
                setCameraZoom(4.2)

                // 5. Dark curtain smoothly covers screen & triggers direct handoff to torch scene (800ms)
                setTimeout(() => {
                  transitionTo(DOOR_INTRO_STATES.HANDOFF)
                  setIsHandoffFading(true)
                  if (onDoorComplete) onDoorComplete()

                  setTimeout(() => {
                    try {
                      sessionStorage.setItem('sf_door_intro_completed', 'true')
                    } catch (e) {}
                    transitionTo(DOOR_INTRO_STATES.COMPLETE)
                    document.body.style.overflow = ''
                    document.documentElement.style.overflow = ''
                  }, 600)
                }, 800)
              }, 350)
            }, 350)
          }, 400)
        }, 350)
      } else {
        animId = requestAnimationFrame(checkProximityLoop)
      }
    }

    animId = requestAnimationFrame(checkProximityLoop)
    return () => cancelAnimationFrame(animId)
  }, [currentState, isKeyPickedUp, lerpPosRef, onDoorComplete, transitionTo])

  // 4. Skip Intro Handler (Immediate Teardown & Handoff)
  const handleSkipIntro = () => {
    setIsHandoffFading(true)
    if (onSkipIntro) {
      onSkipIntro()
    } else if (onDoorComplete) {
      onDoorComplete()
    }
    setTimeout(() => {
      try {
        sessionStorage.setItem('sf_door_intro_completed', 'true')
      } catch (e) {}
      transitionTo(DOOR_INTRO_STATES.COMPLETE)
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }, 300)
  }

  const isCreamCurtainActive = ['ENTERING_DOOR', 'HANDOFF', 'COMPLETE'].includes(currentState)

  // Unmount completely when state is COMPLETE or non-homepage
  if (currentState === DOOR_INTRO_STATES.COMPLETE || pathname !== '/') return null

  return (
    <div className={`sf-door-intro-root ${isHandoffFading ? 'is-handoff-fading' : ''}`}>
      {/* Skip Intro Button */}
      <button className="sf-door-skip-btn" onClick={handleSkipIntro} aria-label="Skip Door Intro">
        Skip Intro ✕
      </button>

      {/* Full-Screen Dark Torch Transition Curtain for Seamless Handoff */}
      <div className={`sf-full-cream-curtain ${isCreamCurtainActive ? 'is-active' : ''}`} />

      {/* Initial Door Scene with 3D Framing & Lock */}
      <InitialDoorScene
        doorState={currentState}
        lockState={currentState}
        proximityProgress={proximityProgress}
        lockRef={lockRef}
        scrollProgress={scrollProgress}
        cameraZoom={cameraZoom}
      />

      {/* Storage Archive Exploration Scene Below Door */}
      <ExplorationScene
        scrollProgress={scrollProgress}
        onOpenBox={() => {
          if (currentState === DOOR_INTRO_STATES.DOOR_IDLE || currentState === DOOR_INTRO_STATES.EXPLORING) {
            transitionTo(DOOR_INTRO_STATES.BOXES_VISIBLE)
          }
        }}
        onPickupKey={handlePickupKey}
        isKeyPickedUp={isKeyPickedUp}
      />

      {/* Floating Key Attached to Pointer once Picked Up (Fades out BEFORE door opens) */}
      {isKeyPickedUp && ['KEY_PICKED', 'RETURNING_TO_DOOR', 'KEY_APPROACHING_LOCK', 'KEY_SNAPPING', 'KEY_INSERTED', 'UNLOCKING'].includes(currentState) && (
        <KeyItem
          isPickedUp={true}
          isFading={isKeyFading}
          position={lerpPosRef.current}
          rotation={keyRotation}
        />
      )}
    </div>
  )
}
