import React, { useEffect, useRef, useCallback } from 'react'
import { INTRO_STATES } from '../IntroStateMachine'

export default function TunnelScene({ currentState, onTransition }) {
  const targetProgressRef = useRef(0)
  const currentProgressRef = useRef(0)
  const hasTransitionedRef = useRef(false)
  const touchStartYRef = useRef(0)
  const animFrameIdRef = useRef(null)

  // DOM Direct References for 60FPS Zero-Rerender Hardware Acceleration
  const viewportRef = useRef(null)
  const titleWrapperRef = useRef(null)
  const circleRef = useRef(null)
  const ring0Ref = useRef(null)
  const ring1Ref = useRef(null)
  const ring2Ref = useRef(null)
  const particleGroupRef = useRef(null)

  // Clean One-Time Handoff into pitch black torch scene
  const triggerDarknessHandoff = useCallback(() => {
    if (hasTransitionedRef.current) return
    hasTransitionedRef.current = true

    onTransition(INTRO_STATES.TRANSITIONING_TO_DARKNESS)

    setTimeout(() => {
      onTransition(INTRO_STATES.TORCH_AVAILABLE)
    }, 200)
  }, [onTransition])

  // Scene 1: Initial State & Scroll Reset
  useEffect(() => {
    hasTransitionedRef.current = false
    targetProgressRef.current = 0
    currentProgressRef.current = 0
  }, [onTransition])

  // Background Color Interpolation: Soft Cream (#faf8f5) -> Muted Taupe -> Charcoal -> Pitch Black (#000000)
  const getBackgroundColor = (p) => {
    if (p <= 0.4) return 'rgb(250, 248, 245)' // Pure Cream #faf8f5
    if (p <= 0.72) {
      const ratio = (p - 0.4) / 0.32
      const r = Math.round(250 - ratio * 200)
      const g = Math.round(248 - ratio * 200)
      const b = Math.round(245 - ratio * 200)
      return `rgb(${r}, ${g}, ${b})`
    }
    // 0.72 to 1.0: Deep Shadow to 100% Pitch Black (#000000)
    const ratio = Math.min(1, (p - 0.72) / 0.26)
    const val = Math.round(50 * (1 - ratio))
    return `rgb(${val}, ${val}, ${val})`
  }

  // 60FPS Direct DOM Render Loop (Zero React Re-render Overhead)
  useEffect(() => {
    const renderLoop = () => {
      const target = targetProgressRef.current
      const current = currentProgressRef.current
      // Heavy, luxurious decelerated inertia factor (0.05)
      const next = current + (target - current) * 0.05
      currentProgressRef.current = next

      // 1. Direct Viewport Background Update
      if (viewportRef.current) {
        viewportRef.current.style.backgroundColor = getBackgroundColor(next)
      }

      // 2. Centered Text Scale Growth on Scroll: Readable (1.0) -> 3D Expansion (7.0)
      if (titleWrapperRef.current) {
        const textGrowthP = Math.min(1, next / 0.65)
        const textScale = 1.0 + Math.pow(textGrowthP, 2.1) * 6.0

        // Opacity: Fades gracefully as text scales past viewport bounds (next > 0.45)
        const textOpacity = next > 0.45
          ? Math.max(0, 1 - (next - 0.45) / 0.20)
          : 1

        titleWrapperRef.current.style.transform = `translate(-50%, -50%) scale(${textScale.toFixed(3)})`
        titleWrapperRef.current.style.opacity = textOpacity.toFixed(3)
      }

      // 3. Vector SVG Black Circle Radius Expansion (Appears at 35% progress, expands smoothly to r=750)
      if (circleRef.current) {
        if (next > 0.35) {
          const portalP = (next - 0.35) / 0.62
          const radius = Math.pow(portalP, 2.2) * 750 // Vector SVG radius up to 750px (covers fullscreen diagonally)
          const opacity = Math.min(1, portalP * 3.0)

          circleRef.current.setAttribute('r', radius.toFixed(1))
          circleRef.current.setAttribute('opacity', opacity.toFixed(3))
        } else {
          circleRef.current.setAttribute('r', '0')
          circleRef.current.setAttribute('opacity', '0')
        }
      }

      // 4. 3D Perspective Rings Expansion
      const ringScale0 = 1 + next * 2.8
      const ringScale1 = 1 + next * 3.4
      const ringScale2 = 1 + next * 4.0
      const ringOpacity = Math.max(0, (1 - next * 1.3) * 0.18)

      if (ring0Ref.current) ring0Ref.current.style.transform = `scale(${ringScale0.toFixed(3)})`
      if (ring1Ref.current) ring1Ref.current.style.transform = `scale(${ringScale1.toFixed(3)})`
      if (ring2Ref.current) ring2Ref.current.style.transform = `scale(${ringScale2.toFixed(3)})`

      if (ring0Ref.current) ring0Ref.current.style.opacity = ringOpacity.toFixed(3)
      if (ring1Ref.current) ring1Ref.current.style.opacity = ringOpacity.toFixed(3)
      if (ring2Ref.current) ring2Ref.current.style.opacity = ringOpacity.toFixed(3)

      // 5. Check completion handoff to pitch black torch scene
      if (next >= 0.985 && !hasTransitionedRef.current) {
        triggerDarknessHandoff()
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop)
    }

    animFrameIdRef.current = requestAnimationFrame(renderLoop)
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
    }
  }, [triggerDarknessHandoff])

  // Virtual Scroll Accumulator Listeners (Pinned Viewport)
  useEffect(() => {
    const handleWheel = (e) => {
      if (hasTransitionedRef.current) return
      // Throttled delta accumulator for smooth inertia
      const delta = e.deltaY * 0.00085
      targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current + delta))

      if (targetProgressRef.current > 0.04 && currentState !== INTRO_STATES.TUNNEL_SCROLLING && !hasTransitionedRef.current) {
        onTransition(INTRO_STATES.TUNNEL_SCROLLING)
      }
    }

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e) => {
      if (hasTransitionedRef.current || !e.touches || e.touches.length === 0) return
      const currentY = e.touches[0].clientY
      const deltaY = touchStartYRef.current - currentY
      touchStartYRef.current = currentY

      if (e.cancelable) {
        e.preventDefault()
      }
      const delta = deltaY * 0.0018
      targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current + delta))

      if (targetProgressRef.current > 0.04 && currentState !== INTRO_STATES.TUNNEL_SCROLLING && !hasTransitionedRef.current) {
        onTransition(INTRO_STATES.TUNNEL_SCROLLING)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [currentState, onTransition])

  return (
    <div
      ref={viewportRef}
      className="tunnel-scene-viewport"
      style={{
        backgroundColor: '#faf8f5'
      }}
    >
      {/* 3D Perspective Stage */}
      <div className="tunnel-3d-stage">
        {/* 3D Z-Layered Corridor Rings */}
        <div ref={ring0Ref} className="tunnel-corridor-ring r0" />
        <div ref={ring1Ref} className="tunnel-corridor-ring r1" />
        <div ref={ring2Ref} className="tunnel-corridor-ring r2" />

        {/* Ambient Particles */}
        <div ref={particleGroupRef} className="tunnel-particles-layer">
          <div className="tunnel-particle particle-1" />
          <div className="tunnel-particle particle-2" />
          <div className="tunnel-particle particle-3" />
        </div>

        {/* Centered Text: "A stranger… or a story waiting to begin?" (Grows in-place from Small -> Very Large) */}
        <div
          ref={titleWrapperRef}
          className="stranger-title-wrapper"
          style={{
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 1
          }}
        >
          <h1 className="stranger-title-text">A stranger… or a story waiting to begin?</h1>
          <div className="scroll-pulse-hint">
            <div className="scroll-pulse-arrow" />
          </div>
        </div>

        {/* Vector SVG Anti-Aliased Smooth Feathered Black Circle */}
        <svg
          className="tunnel-svg-layer"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="vectorBlackPortalGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="1" />
              <stop offset="85%" stopColor="#000000" stopOpacity="1" />
              <stop offset="95%" stopColor="#000000" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle
            ref={circleRef}
            cx="500"
            cy="500"
            r="0"
            fill="url(#vectorBlackPortalGrad)"
            opacity="0"
          />
        </svg>
      </div>
    </div>
  )
}
