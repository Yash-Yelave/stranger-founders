import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { DOOR_INTRO_STATES, isValidDoorTransition } from './doorIntroStateMachine'
import { DOOR_INTRO_CONFIG } from './doorIntroConfig'
import { useDoorScrollProgress } from './hooks/useDoorScrollProgress'
import InitialDoorScene from './scenes/InitialDoorScene.jsx'
import ExplorationScene from './scenes/ExplorationScene.jsx'
import CarriedKeyPortal from './scenes/CarriedKeyPortal.jsx'
import './doorIntroStyles.css'

export default function CinematicDoorOverlay({ onDoorComplete, onSkipIntro }) {
  const { pathname } = useLocation()
  const [currentState, setCurrentState] = useState(DOOR_INTRO_STATES.DOOR_IDLE)
  const [isKeyPickedUp, setIsKeyPickedUp] = useState(false)
  const [isKeyFading, setIsKeyFading] = useState(false)
  const [keyRotation, setKeyRotation] = useState(0)
  const [cameraZoom, setCameraZoom] = useState(1)
  const [proximityProgress, setProximityProgress] = useState(0)
  const [initialPickupPos, setInitialPickupPos] = useState({ x: 0, y: 0 })

  const [isHandoffFading, setIsHandoffFading] = useState(false)

  const lockRef = useRef(null)
  const stateRef = useRef(currentState)
  stateRef.current = currentState

  // Scroll progress hook
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

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [pathname])

  // 2. Pickup Key Handler: Captures exact grab position and mounts CarriedKeyPortal
  const handlePickupKey = (e) => {
    if (isKeyPickedUp) return

    let clientX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0
    let clientY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0

    if (e) {
      if (e.clientX && e.clientY) {
        clientX = e.clientX
        clientY = e.clientY
      } else if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      }
    }

    setInitialPickupPos({ x: clientX, y: clientY })
    setIsKeyPickedUp(true)
    transitionTo(DOOR_INTRO_STATES.KEY_PICKED)

    // Smoothly return view to door so user can manually place key on lock
    setProgress(0)
    setTimeout(() => {
      transitionTo(DOOR_INTRO_STATES.KEY_APPROACHING_LOCK)
    }, 400)
  }

  // 3. Callback when key enters lock activation radius: Performs snap, key turn, and door opening
  const handleSnapAndUnlock = useCallback((lockCenterX, lockCenterY, keyElem) => {
    transitionTo(DOOR_INTRO_STATES.KEY_SNAPPING)

    let snapStart = null
    const getPos = () => {
      if (!keyElem) return { x: lockCenterX, y: lockCenterY }
      const transform = window.getComputedStyle(keyElem).transform
      if (transform && transform !== 'none') {
        const matrix = transform.match(/matrix.*\((.+)\)/)
        if (matrix) {
          const values = matrix[1].split(', ')
          return { x: parseFloat(values[4]) || lockCenterX, y: parseFloat(values[5]) || lockCenterY }
        }
      }
      return { x: lockCenterX, y: lockCenterY }
    }

    const startPos = getPos()

    const animateSnap = (timestamp) => {
      if (!snapStart) snapStart = timestamp
      const elapsed = timestamp - snapStart
      const t = Math.min(1, elapsed / 180)

      const curX = startPos.x + (lockCenterX - startPos.x) * t
      const curY = startPos.y + (lockCenterY - startPos.y) * t

      if (keyElem) {
        keyElem.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%) rotate(0deg)`
      }

      if (t < 1) {
        requestAnimationFrame(animateSnap)
      } else {
        // Key is aligned on lock center. Turn key 90° smoothly
        transitionTo(DOOR_INTRO_STATES.UNLOCKING)
        setKeyRotation(90)
        if (keyElem) {
          keyElem.style.transform = `translate3d(${lockCenterX}px, ${lockCenterY}px, 0) translate(-50%, -50%) rotate(90deg)`
        }

        // Key fades out into keyhole over 250ms until completely gone
        setTimeout(() => {
          setIsKeyFading(true)
          if (keyElem) {
            keyElem.style.opacity = '0'
          }

          // Trigger door leaves opening and camera zooming
          setTimeout(() => {
            transitionTo(DOOR_INTRO_STATES.DOOR_OPENING)

            setTimeout(() => {
              transitionTo(DOOR_INTRO_STATES.ENTERING_DOOR)
              setCameraZoom(4.2)

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
      }
    }

    requestAnimationFrame(animateSnap)
  }, [onDoorComplete, transitionTo])

  // 4. Skip Intro Handler (Immediate Teardown & Handoff)
  const handleSkipIntro = () => {
    try {
      sessionStorage.setItem('sf_door_intro_completed', 'true')
    } catch (e) {}
    transitionTo(DOOR_INTRO_STATES.COMPLETE)
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    if (onSkipIntro) onSkipIntro()
    if (onDoorComplete) onDoorComplete()
  }

  // Hide overlay once sequence is complete
  if (currentState === DOOR_INTRO_STATES.COMPLETE || pathname !== '/') {
    return null
  }

  const isDarkCurtainActive = currentState === DOOR_INTRO_STATES.HANDOFF
  const isCreamCurtainActive = ['ENTERING_DOOR', 'HANDOFF'].includes(currentState)

  return (
    <div className={`sf-door-intro-root ${isDarkCurtainActive ? 'handoff-dark' : ''}`}>
      {/* Skip Button */}
      <button
        type="button"
        className="sf-door-skip-btn"
        onClick={handleSkipIntro}
        aria-label="Skip Intro"
      >
        Skip Intro &rarr;
      </button>

      {/* Dark Transition Curtain for Handoff */}
      <div className={`sf-door-dark-curtain ${isDarkCurtainActive ? 'is-active' : ''}`} />

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

      {/* Dedicated CarriedKeyPortal with unbroken RAF loop & zero freezing */}
      <CarriedKeyPortal
        isPickedUp={isKeyPickedUp}
        currentState={currentState}
        initialPos={initialPickupPos}
        lockRef={lockRef}
        scrollProgress={scrollProgress}
        onSnapAndUnlock={handleSnapAndUnlock}
      />
    </div>
  )
}
