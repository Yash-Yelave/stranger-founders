import { useEffect, useRef, useState } from 'react'
import { INTRO_CONFIG } from '../introConfig'

/**
 * High-performance pointer / touch tracking hook with Lerp smoothing & rotation velocity
 */
export function usePointerTracking(enabled = true) {
  const pointerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const lerpPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const velocityRef = useRef({ x: 0, y: 0, angle: 0 })
  const [isTouch, setIsTouch] = useState(false)
  const animFrameRef = useRef(null)

  useEffect(() => {
    if (!enabled) return

    const handlePointerMove = (e) => {
      let clientX = e.clientX
      let clientY = e.clientY

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
        setIsTouch(true)
      } else {
        setIsTouch(false)
      }

      pointerPosRef.current = { x: clientX, y: clientY }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('touchmove', handlePointerMove, { passive: true })

    const animateLerp = () => {
      const targetX = pointerPosRef.current.x
      const targetY = pointerPosRef.current.y
      const currentX = lerpPosRef.current.x
      const currentY = lerpPosRef.current.y

      const factor = INTRO_CONFIG.POINTER_SMOOTHING_FACTOR
      const dx = (targetX - currentX) * factor
      const dy = (targetY - currentY) * factor

      const newX = currentX + dx
      const newY = currentY + dy

      lerpPosRef.current = { x: newX, y: newY }
      
      // Calculate rotation tilt angle based on horizontal movement
      const angle = Math.max(-25, Math.min(25, dx * 1.8))
      velocityRef.current = { x: dx, y: dy, angle }

      animFrameRef.current = requestAnimationFrame(animateLerp)
    }

    animFrameRef.current = requestAnimationFrame(animateLerp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('touchmove', handlePointerMove)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [enabled])

  return { pointerPosRef, lerpPosRef, velocityRef, isTouch }
}
