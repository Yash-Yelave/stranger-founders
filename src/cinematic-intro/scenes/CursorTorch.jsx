import React from 'react'

export default function CursorTorch({ lerpPosRef, velocityRef, isLit, isIgniting, isTouch }) {
  const torchRef = React.useRef(null)

  React.useEffect(() => {
    let animId = null

    const updatePosition = () => {
      if (torchRef.current && lerpPosRef.current) {
        const x = lerpPosRef.current.x
        const y = lerpPosRef.current.y
        const angle = velocityRef.current ? velocityRef.current.angle : 0

        const offsetX = isTouch ? 0 : 8
        const offsetY = isTouch ? 0 : 10

        torchRef.current.style.transform = `translate3d(${x + offsetX}px, ${y + offsetY}px, 0px) rotate(${angle}deg)`
      }

      animId = requestAnimationFrame(updatePosition)
    }

    animId = requestAnimationFrame(updatePosition)
    return () => cancelAnimationFrame(animId)
  }, [isTouch, lerpPosRef, velocityRef])

  return (
    <div className="cursor-flambeau-follower" ref={torchRef}>
      {/* Handheld Flambeau Torch Structure */}
      <div className="cursor-flambeau-torch">
        {/* Brass Torch Cup Head */}
        <div className="flambeau-cup-head">
          {/* Unlit Charcoal Wick (Visible when unlit) */}
          <div
            className="flambeau-unlit-wick"
            style={{
              opacity: isLit ? 0 : 1,
              transition: 'opacity 0.4s ease-out'
            }}
          />

          {/* Natural Controlled Flame & Glow (Smoothly scales & fades, no unmounting) */}
          <div
            className={`flambeau-flame-wrapper ${isIgniting ? 'flame-igniting-grow' : ''}`}
            style={{
              opacity: isLit ? 1 : 0,
              transform: isLit ? (isIgniting ? undefined : 'scale(1)') : 'scale(0.2)',
              transition: isIgniting ? 'none' : 'opacity 0.5s ease-out, transform 0.5s ease-out',
              pointerEvents: 'none'
            }}
          >
            {/* Controlled Smaller Flame Core */}
            <div className="flambeau-flame-core" />

            {/* Soft Warm Ambient Glow (Non-overpowering) */}
            <div className="flambeau-soft-glow" />
          </div>
        </div>
      </div>
    </div>
  )
}
