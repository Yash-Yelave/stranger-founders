import { useEffect, useRef, useState } from 'react'

export function useDoorScrollProgress(enabled = true) {
  const [scrollProgress, setScrollProgress] = useState(0) // 0 (door) -> 1 (archive)
  const targetProgressRef = useRef(0)
  const currentProgressRef = useRef(0)
  const touchStartYRef = useRef(0)

  useEffect(() => {
    if (!enabled) return

    const handleWheel = (e) => {
      e.preventDefault()
      const delta = e.deltaY * 0.0015
      targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current + delta))
    }

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        touchStartYRef.current = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e) => {
      if (e.cancelable) {
        e.preventDefault()
      }
      if (e.touches && e.touches[0]) {
        const dy = touchStartYRef.current - e.touches[0].clientY
        touchStartYRef.current = e.touches[0].clientY
        const delta = dy * 0.0035
        targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current + delta))
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    let animId
    const updateLoop = () => {
      const target = targetProgressRef.current
      const current = currentProgressRef.current
      const next = current + (target - current) * 0.18

      if (Math.abs(next - current) > 0.0001) {
        currentProgressRef.current = next
        setScrollProgress(next)
      }

      animId = requestAnimationFrame(updateLoop)
    }

    animId = requestAnimationFrame(updateLoop)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      cancelAnimationFrame(animId)
    }
  }, [enabled])

  const setProgress = (val) => {
    targetProgressRef.current = Math.max(0, Math.min(1, val))
    currentProgressRef.current = targetProgressRef.current
    setScrollProgress(targetProgressRef.current)
  }

  return { scrollProgress, setProgress, targetProgressRef, currentProgressRef }
}
