import { useEffect, useRef } from 'react'

export function useDoorPointerTracking(smoothing = 0.42) {
  const pointerPosRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  })
  const currentPosRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  })
  const isTrackingEnabledRef = useRef(true)

  const setInstantPosition = (x, y) => {
    pointerPosRef.current = { x, y }
    currentPosRef.current = { x, y }
  }

  const setTrackingEnabled = (enabled) => {
    isTrackingEnabledRef.current = enabled
  }

  useEffect(() => {
    const updatePos = (x, y) => {
      if (!isTrackingEnabledRef.current) return
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

    window.addEventListener('pointermove', handlePointerMove, { capture: true, passive: true })
    window.addEventListener('pointerdown', handlePointerMove, { capture: true, passive: true })
    window.addEventListener('mousemove', handlePointerMove, { capture: true, passive: true })
    window.addEventListener('touchmove', handleTouchMove, { capture: true, passive: true })
    window.addEventListener('touchstart', handleTouchMove, { capture: true, passive: true })

    document.addEventListener('pointermove', handlePointerMove, { capture: true, passive: true })
    document.addEventListener('touchmove', handleTouchMove, { capture: true, passive: true })

    let animId
    const updateLoop = () => {
      if (isTrackingEnabledRef.current) {
        const target = pointerPosRef.current
        const current = currentPosRef.current

        const dx = target.x - current.x
        const dy = target.y - current.y

        currentPosRef.current = {
          x: current.x + dx * smoothing,
          y: current.y + dy * smoothing
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
  }, [smoothing])

  return {
    pointerPosRef,
    currentPosRef,
    lerpPosRef: currentPosRef,
    setInstantPosition,
    setTrackingEnabled
  }
}
