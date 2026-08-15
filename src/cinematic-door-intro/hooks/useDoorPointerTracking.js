import { useEffect, useRef } from 'react'

export function useDoorPointerTracking(lerpFactor = 0.14) {
  const pointerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const lerpPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const velocityRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handlePointerMove = (e) => {
      pointerPosRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        pointerPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    let animId
    const updateLerp = () => {
      const target = pointerPosRef.current
      const current = lerpPosRef.current

      const dx = target.x - current.x
      const dy = target.y - current.y

      velocityRef.current = { x: dx, y: dy }

      lerpPosRef.current = {
        x: current.x + dx * lerpFactor,
        y: current.y + dy * lerpFactor
      }

      animId = requestAnimationFrame(updateLerp)
    }

    animId = requestAnimationFrame(updateLerp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('touchmove', handleTouchMove)
      cancelAnimationFrame(animId)
    }
  }, [lerpFactor])

  return { pointerPosRef, lerpPosRef, velocityRef }
}
