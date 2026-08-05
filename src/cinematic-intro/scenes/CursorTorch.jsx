import React from 'react'

export default function CursorTorch({ lerpPosRef, velocityRef, isLit, isTouch }) {
  const torchRef = React.useRef(null)

  React.useEffect(() => {
    let animId = null

    const updatePosition = () => {
      if (torchRef.current && lerpPosRef.current) {
        const x = lerpPosRef.current.x
        const y = lerpPosRef.current.y
        const angle = velocityRef.current ? velocityRef.current.angle : 0

        // Position torch relative to cursor (offsetting slightly down & right on desktop)
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
      {/* Active Flame Top (Only when lit) */}
      {isLit && (
        <div className="flame-container" style={{ top: '-48px', left: '8px' }}>
          <div className="flame-core-animated" />
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245,236,216,0.6) 0%, rgba(214,154,92,0.3) 50%, transparent 80%)',
              pointerEvents: 'none',
              filter: 'blur(12px)'
            }}
          />
        </div>
      )}

      {/* Unlit Tip (Only when NOT lit) */}
      {!isLit && (
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            left: '3px',
            width: '10px',
            height: '14px',
            background: '#2b1b10',
            borderRadius: '4px 4px 0 0',
            border: '1px solid rgba(214,154,92,0.2)'
          }}
        />
      )}

      {/* Flambeau Wooden Shaft */}
      <div className="cursor-flambeau-torch" />
    </div>
  )
}
