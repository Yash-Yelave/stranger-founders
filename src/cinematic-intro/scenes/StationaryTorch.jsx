import React, { useRef } from 'react'

export default function StationaryTorch({ torchPosRef }) {
  const containerRef = useRef(null)

  // Pass container rect position back up via ref
  React.useEffect(() => {
    if (containerRef.current && torchPosRef) {
      const rect = containerRef.current.getBoundingClientRect()
      torchPosRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + 20
      }
    }
  }, [torchPosRef])

  return (
    <div className="stationary-torch-wrapper" ref={containerRef}>
      <div className="flame-container">
        {/* Animated Burning Flame Core */}
        <div className="flame-core-animated" />

        {/* Ambient Warm Flame Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-30px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,183,0,0.6) 0%, rgba(255,85,0,0.25) 50%, transparent 80%)',
            pointerEvents: 'none',
            filter: 'blur(12px)'
          }}
        />
      </div>

      {/* Flambeau Wooden Torch Holder */}
      <div className="flambeau-holder">
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            width: '100%',
            height: '8px',
            background: '#d69a5c',
            opacity: 0.7
          }}
        />
      </div>
    </div>
  )
}
