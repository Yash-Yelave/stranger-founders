import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import KeyItem from './KeyItem.jsx'
import { DOOR_INTRO_CONFIG } from '../doorIntroConfig'

export default function CarriedKeyPortal({
  isPickedUp,
  currentState,
  initialPos = { x: 0, y: 0 },
  lockRef,
  scrollProgress = 0,
  onSnapAndUnlock
}) {
  const containerRef = useRef(null)
  const targetPosRef = useRef({ x: initialPos.x || window.innerWidth / 2, y: initialPos.y || window.innerHeight / 2 })
  const currentPosRef = useRef({ x: initialPos.x || window.innerWidth / 2, y: initialPos.y || window.innerHeight / 2 })
  const isSnappingRef = useRef(false)
  const stateRef = useRef(currentState)
  stateRef.current = currentState

  // Set initial position on grab
  useEffect(() => {
    if (initialPos.x && initialPos.y) {
      targetPosRef.current = { x: initialPos.x, y: initialPos.y }
      currentPosRef.current = { x: initialPos.x, y: initialPos.y }
    }
  }, [initialPos.x, initialPos.y])

  useEffect(() => {
    if (!isPickedUp) {
      isSnappingRef.current = false
      return
    }

    // 1. One persistent pointer tracking callback for the entire drag lifecycle
    const updateTargetPos = (clientX, clientY) => {
      if (isSnappingRef.current) return
      targetPosRef.current = { x: clientX, y: clientY }
    }

    const handlePointerMove = (e) => {
      updateTargetPos(e.clientX, e.clientY)
    }

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        updateTargetPos(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { capture: true, passive: true })
    window.addEventListener('pointerdown', handlePointerMove, { capture: true, passive: true })
    window.addEventListener('mousemove', handlePointerMove, { capture: true, passive: true })
    window.addEventListener('touchmove', handleTouchMove, { capture: true, passive: true })
    window.addEventListener('touchstart', handleTouchMove, { capture: true, passive: true })

    document.addEventListener('pointermove', handlePointerMove, { capture: true, passive: true })
    document.addEventListener('touchmove', handleTouchMove, { capture: true, passive: true })

    // 2. Single unbroken requestAnimationFrame loop (smoothing = 0.42)
    let animId
    const smoothing = 0.42

    const updateLoop = () => {
      if (!isSnappingRef.current) {
        const target = targetPosRef.current
        const current = currentPosRef.current

        const dx = target.x - current.x
        const dy = target.y - current.y

        current.x += dx * smoothing
        current.y += dy * smoothing

        // Update DOM transform directly with ZERO React re-renders per frame
        if (containerRef.current) {
          containerRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%) rotate(0deg)`
        }

        // Check proximity to lock plate in pure viewport coordinates
        if (
          lockRef &&
          lockRef.current &&
          stateRef.current === 'KEY_APPROACHING_LOCK' &&
          scrollProgress < 0.05
        ) {
          const rect = lockRef.current.getBoundingClientRect()
          const lockCenterX = rect.left + rect.width / 2
          const lockCenterY = rect.top + rect.height / 2

          const dist = Math.hypot(current.x - lockCenterX, current.y - lockCenterY)
          const snapRadius =
            typeof window !== 'undefined' && window.innerWidth <= 768
              ? DOOR_INTRO_CONFIG.LOCK_MOBILE_ACTIVATION_RADIUS
              : DOOR_INTRO_CONFIG.LOCK_ACTIVATION_RADIUS

          if (dist <= snapRadius) {
            // One-way snap guard: permanently disable pointer tracking
            isSnappingRef.current = true

            // Trigger smooth lock snapping animation callback
            if (onSnapAndUnlock) {
              onSnapAndUnlock(lockCenterX, lockCenterY, containerRef.current)
            }
            return
          }
        }
      }

      animId = requestAnimationFrame(updateLoop)
    }

    animId = requestAnimationFrame(updateLoop)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove, { capture: true })
      window.removeEventListener('pointerdown', handlePointerMove, { capture: true })
      window.removeEventListener('mousemove', handlePointerMove, { capture: true })
      window.removeEventListener('touchmove', handleTouchMove, { capture: true })
      window.removeEventListener('touchstart', handleTouchMove, { capture: true })

      document.removeEventListener('pointermove', handlePointerMove, { capture: true })
      document.removeEventListener('touchmove', handleTouchMove, { capture: true })
      cancelAnimationFrame(animId)
    }
  }, [isPickedUp, lockRef, scrollProgress, onSnapAndUnlock])

  if (!isPickedUp) return null

  return createPortal(
    <div
      ref={containerRef}
      className="sf-door-key-item picked-up"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 9999999,
        pointerEvents: 'none',
        userSelect: 'none',
        WebkitUserDrag: 'none',
        transition: 'none',
        transform: `translate3d(${currentPosRef.current.x}px, ${currentPosRef.current.y}px, 0) translate(-50%, -50%) rotate(0deg)`
      }}
      draggable={false}
    >
      <KeyItem isPickedUp={false} />
    </div>,
    document.body
  )
}
