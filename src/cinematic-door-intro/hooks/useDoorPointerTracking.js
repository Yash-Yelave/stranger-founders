import { useEffect, useRef } from 'react'

export function useDoorPointerTracking(lerpFactor = 0.55) {
  const pointerPosRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 })
  const lerpPosRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 })
  const velocityRef = useRef({ x: 0, y: 0 })

  const setPointerPos = (x, y) => {
    pointerPosRef.current = { x, y }
    lerpPosRef.current = { x, y }
  }

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
    window.addEventListener('pointerdown', handlePointerMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', handleTouchMove, { passive: true })

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
      window.removeEventListener('pointerdown', handlePointerMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchMove)
      cancelAnimationFrame(animId)
    }
  }, [lerpFactor])

  return { pointerPosRef, lerpPosRef, velocityRef, setPointerPos }
}
