import React, { useState, useRef, useEffect, useCallback } from 'react'
import { INTRO_STATES } from '../IntroStateMachine'
import { INTRO_CONFIG } from '../introConfig'
import { isWithinProximity } from '../hooks/useProximityDetection'

export default function DoorScene({ currentState, onTransition }) {
  const [scrollY, setScrollY] = useState(0)
  const [openBoxIndex, setOpenBoxIndex] = useState(null)
  const [keyFound, setKeyFound] = useState(false)
  const [keyDragging, setKeyDragging] = useState(false)
  const [keyPos, setKeyPos] = useState({ x: 0, y: 0 })
  const [keyInserted, setKeyInserted] = useState(false)

  const lockRef = useRef(null)
  const keyRef = useRef(null)
  const isTouchRef = useRef(false)
  const insertedRef = useRef(false)

  // Secret key box index (box index 1 of 3)
  const KEY_BOX_INDEX = 1

  // Handle scroll exploration to transition between Scene 1 and Scene 2
  useEffect(() => {
    if (
      currentState !== INTRO_STATES.DOOR_LOCKED &&
      currentState !== INTRO_STATES.SCROLLING_TO_BOXES &&
      currentState !== INTRO_STATES.SEARCHING_FOR_KEY
    ) return

    const handleWheel = (e) => {
      setScrollY((prev) => {
        const next = Math.max(0, Math.min(window.innerHeight, prev + e.deltaY * INTRO_CONFIG.SCROLL_SENSITIVITY))
        if (next > window.innerHeight * 0.4 && currentState === INTRO_STATES.DOOR_LOCKED) {
          onTransition(INTRO_STATES.SCROLLING_TO_BOXES)
        }
        if (next >= window.innerHeight * 0.8 && currentState !== INTRO_STATES.SEARCHING_FOR_KEY && !keyFound) {
          onTransition(INTRO_STATES.SEARCHING_FOR_KEY)
        }
        return next
      })
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [currentState, keyFound, onTransition])

  // Execute sequence when key is inserted into lock
  const triggerUnlockAndOpenSequence = useCallback((targetX, targetY) => {
    if (insertedRef.current) return
    insertedRef.current = true

    setKeyDragging(false)
    setKeyInserted(true)
    setKeyPos({ x: targetX, y: targetY })
    onTransition(INTRO_STATES.KEY_INSERTED)

    // 1. Turn key & unlock shackle
    setTimeout(() => {
      onTransition(INTRO_STATES.DOOR_UNLOCKING)
    }, 400)

    // 2. Swing open 3D door wings
    setTimeout(() => {
      onTransition(INTRO_STATES.DOOR_OPENING)
    }, 400 + INTRO_CONFIG.DOOR_UNLOCK_DURATION)

    // 3. Walk through doorway into darkness
    setTimeout(() => {
      onTransition(INTRO_STATES.ENTERING_DARKNESS)
    }, 400 + INTRO_CONFIG.DOOR_UNLOCK_DURATION + INTRO_CONFIG.DOOR_OPEN_DURATION)
  }, [onTransition])

  // Handle box click to discover key
  const handleBoxClick = (index) => {
    setOpenBoxIndex(index)
    if (index === KEY_BOX_INDEX && !keyFound) {
      setKeyFound(true)
      onTransition(INTRO_STATES.KEY_FOUND)
      // Initial position for key near bottom center
      setKeyPos({ x: window.innerWidth / 2, y: window.innerHeight * 0.65 })

      // Smoothly return camera to door in Scene 1 so the door is front & center!
      setTimeout(() => {
        setScrollY(0)
      }, 400)
    }
  }

  // Pointer drag for key
  const handleKeyPointerDown = () => {
    if (!keyFound || insertedRef.current) return
    setKeyDragging(true)
    onTransition(INTRO_STATES.KEY_DRAGGING)
  }

  // Lock click fallback (allows direct click on lock when key is found)
  const handleLockClick = () => {
    if (!keyFound || insertedRef.current) return
    if (lockRef.current) {
      const lockRect = lockRef.current.getBoundingClientRect()
      triggerUnlockAndOpenSequence(lockRect.left + lockRect.width / 2, lockRect.top + lockRect.height / 2)
    }
  }

  // Continuous pointer move tracking whenever key is found
  useEffect(() => {
    if (!keyFound || insertedRef.current) return

    const handlePointerMove = (e) => {
      if (insertedRef.current) return

      let clientX = e.clientX
      let clientY = e.clientY

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
        isTouchRef.current = true
      }

      setKeyPos({ x: clientX, y: clientY })

      // Check proximity to lock center
      if (lockRef.current) {
        const lockRect = lockRef.current.getBoundingClientRect()
        const lockCenter = {
          x: lockRect.left + lockRect.width / 2,
          y: lockRect.top + lockRect.height / 2
        }

        // Generous activation radius for effortless interaction
        const radius = isTouchRef.current ? 110 : 90

        if (isWithinProximity({ x: clientX, y: clientY }, lockCenter, radius)) {
          triggerUnlockAndOpenSequence(lockCenter.x, lockCenter.y)
        }
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('touchmove', handlePointerMove)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('touchmove', handlePointerMove)
    }
  }, [triggerUnlockAndOpenSequence, keyFound])

  const isUnlocked = [
    INTRO_STATES.KEY_INSERTED,
    INTRO_STATES.DOOR_UNLOCKING,
    INTRO_STATES.DOOR_OPENING,
    INTRO_STATES.ENTERING_DARKNESS
  ].includes(currentState)

  const isDoorOpen = [
    INTRO_STATES.DOOR_OPENING,
    INTRO_STATES.ENTERING_DARKNESS
  ].includes(currentState)

  const isZoomingIn = currentState === INTRO_STATES.ENTERING_DARKNESS

  return (
    <div className="door-scene-viewport">
      <div
        className="door-camera-track"
        style={{
          transform: `translateY(-${isUnlocked ? 0 : scrollY}px)`
        }}
      >
        {/* Scene 1: The Large Closed Door */}
        <div className={`door-container ${isZoomingIn ? 'zooming-in' : ''}`}>
          <div className={`door-frame ${isDoorOpen ? 'open' : ''}`}>
            <div className="door-wings-wrapper">
              <div className={`door-wing left ${isDoorOpen ? 'open' : ''}`}>
                <div className="door-wing-texture" />
              </div>
              <div className={`door-wing right ${isDoorOpen ? 'open' : ''}`}>
                <div className="door-wing-texture" />
              </div>
            </div>

            {/* Lock Plate */}
            <div
              ref={lockRef}
              className={`lock-assembly ${isUnlocked ? 'unlocked' : ''}`}
              onClick={handleLockClick}
              style={{ cursor: keyFound && !keyInserted ? 'pointer' : 'default' }}
            >
              <div className="lock-shackle" />
              <div className="lock-plate">
                <div className="keyhole" />
                <div className="lock-glow-ring" />
              </div>
            </div>
          </div>

          {!isUnlocked && (
            <div className="intro-scroll-hint" onClick={() => setScrollY(window.innerHeight)}>
              <span>Scroll to Explore</span>
              <div className="scroll-arrow-anim" />
            </div>
          )}
        </div>

        {/* Scene 2: Chamber of Wooden Boxes */}
        <div className="boxes-chamber">
          <h2 className="chamber-title">
            {keyFound ? 'Bring the key to the lock' : 'Search the boxes for the key'}
          </h2>

          <div className="boxes-grid">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className={`wooden-box ${openBoxIndex === idx ? 'open' : ''}`}
                onClick={() => handleBoxClick(idx)}
                tabIndex={0}
                role="button"
                aria-label={`Inspect Box ${idx + 1}`}
              >
                <div className="box-lid">📦</div>
                <span className="box-label">
                  {openBoxIndex === idx ? (idx === KEY_BOX_INDEX ? 'KEY FOUND!' : 'EMPTY') : 'INSPECT'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Found Key Element */}
      {keyFound && (
        <div
          ref={keyRef}
          className={`draggable-key ${keyDragging ? 'dragging' : ''} ${keyInserted ? 'inserted' : ''}`}
          style={{
            left: `${keyPos.x - 28}px`,
            top: `${keyPos.y - 28}px`,
            pointerEvents: 'none',
            transition: keyInserted ? 'all 0.4s ease-out' : 'none',
            transform: keyInserted ? 'scale(0.85) rotate(90deg)' : undefined
          }}
          onPointerDown={handleKeyPointerDown}
          onTouchStart={handleKeyPointerDown}
          tabIndex={0}
          role="button"
          aria-label="Golden Key - Drag to Lock"
        >
          <svg viewBox="0 0 64 64" width="56" height="56">
            <circle cx="20" cy="20" r="14" fill="none" stroke="#d69a5c" strokeWidth="4" />
            <circle cx="20" cy="20" r="8" fill="none" stroke="#f5ecd8" strokeWidth="2" />
            <path d="M30 20 L58 20 L58 28 L50 28 L50 20 L42 20 L42 26 L36 26 L36 20 Z" fill="#d69a5c" />
          </svg>
        </div>
      )}
    </div>
  )
}
