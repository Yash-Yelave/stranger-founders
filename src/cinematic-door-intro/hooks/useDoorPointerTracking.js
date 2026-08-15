import { useEffect, useRef } from 'react'

export function useDoorPointerTracking(lerpFactor = 0.75) {
  const pointerPosRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 })
  const lerpPosRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 })
  const velocityRef = useRef({ x: 0, y: 0 })

  const setPointerPos = (x, y) => {
    pointerPosRef.current = { x, y }
    lerpPosRef.current = { x, y }
  }

  useEffect(() => {
    const updatePos = (x, y) => {
      pointerPosRef.current = { x, y }
    }

    const handlePointerMove = (e) => {
      updatePos(e.clientX, e.clientY)
    }

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        updatePos(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    // Attach capture-phase listeners to window and document for full-screen tracking
    window.addEventListener('pointermove', handlePointerMove, { capture: true, passive: true })
    window.addEventListener('pointerdown', handlePointerMove, { capture: true, passive: true })
    window.addEventListener('mousemove', handlePointerMove, { capture: true, passive: true })
    window.addEventListener('touchmove', handleTouchMove, { capture: true, passive: true })
    window.addEventListener('touchstart', handleTouchMove, { capture: true, passive: true })

    document.addEventListener('pointermove', handlePointerMove, { capture: true, passive: true })
    document.addEventListener('touchmove', handleTouchMove, { capture: true, passive: true })

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
      window.removeEventListener('pointermove', handlePointerMove, { capture: true })
      window.removeEventListener('pointerdown', handlePointerMove, { capture: true })
      window.removeEventListener('mousemove', handlePointerMove, { capture: true })
      window.removeEventListener('touchmove', handleTouchMove, { capture: true })
      window.removeEventListener('touchstart', handleTouchMove, { capture: true })

      document.removeEventListener('pointermove', handlePointerMove, { capture: true })
      document.removeEventListener('touchmove', handleTouchMove, { capture: true })
      cancelAnimationFrame(animId)
    }
  }, [lerpFactor])

  return { pointerPosRef, lerpPosRef, velocityRef, setPointerPos }
}
