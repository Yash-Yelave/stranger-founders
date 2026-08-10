import React, { useRef, useEffect } from 'react'
import { INTRO_STATES } from '../IntroStateMachine.js'

/**
 * Small cursor-attached arrow that continuously rotates to point directly at the campfire location.
 */
export default function CampfireDirectionArrow({ campfirePos, lerpPosRef, currentState, isTorchLit }) {
  const arrowRef = useRef(null)

  useEffect(() => {
    let animId = null

    const updateArrow = () => {
      if (
        arrowRef.current &&
        lerpPosRef &&
        lerpPosRef.current &&
        campfirePos &&
        campfirePos.isReady
      ) {
        const cursorX = lerpPosRef.current.x
        const cursorY = lerpPosRef.current.y
        const campfireX = campfirePos.x
        const campfireY = campfirePos.y

        // Calculate delta vector from cursor torch to campfire
        const dx = campfireX - cursorX
        const dy = campfireY - cursorY
        const distance = Math.hypot(dx, dy)

        // Calculate angle in radians & degrees pointing toward campfire
        const angleRad = Math.atan2(dy, dx)
        const angleDeg = (angleRad * 180) / Math.PI

        // Offset distance (~40px away from cursor torch center along pointing vector)
        const offsetDist = 40
        const arrowX = cursorX + Math.cos(angleRad) * offsetDist
        const arrowY = cursorY + Math.sin(angleRad) * offsetDist

        // Distance proximity fade out (smoothly fades when within 160px of campfire)
        const minDistance = 90
        const maxFadeDistance = 250
        let opacity = 1

        if (distance < minDistance) {
          opacity = 0
        } else if (distance < maxFadeDistance) {
          opacity = (distance - minDistance) / (maxFadeDistance - minDistance)
        }

        // Apply 3D position & rotation to arrow element
        arrowRef.current.style.transform = `translate3d(${arrowX}px, ${arrowY}px, 0px) rotate(${angleDeg}deg)`
        arrowRef.current.style.opacity = opacity.toFixed(2)
      }

      animId = requestAnimationFrame(updateArrow)
    }

    animId = requestAnimationFrame(updateArrow)
    return () => cancelAnimationFrame(animId)
  }, [campfirePos, lerpPosRef])

  // Active during torch exploration before campfire ignites
  const activeStates = [
    INTRO_STATES.TORCH_LIT,
    INTRO_STATES.SEARCHING_FOR_CAMPFIRE
  ]

  const shouldRender =
    activeStates.includes(currentState) &&
    isTorchLit &&
    campfirePos &&
    campfirePos.isReady

  if (!shouldRender) {
    return null
  }

  return (
    <div
      ref={arrowRef}
      className="cursor-campfire-arrow"
      aria-hidden="true"
    >
      {/* Warm amber/gold arrow with elongated tail pointing right by default, rotated via CSS transform */}
      <svg
        width="32"
        height="22"
        viewBox="0 0 34 24"
        fill="none"
        stroke="#d69a5c"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12h29" />
        <path d="M22 5l9 7-9 7" />
      </svg>
    </div>
  )
}
