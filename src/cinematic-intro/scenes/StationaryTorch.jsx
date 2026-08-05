import React, { useRef } from 'react'
import { INTRO_STATES } from '../IntroStateMachine'

export default function StationaryTorch({ torchPosRef, currentState }) {
  const containerRef = useRef(null)
  const isIgniting = currentState === INTRO_STATES.TORCH_IGNITION

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
    <div className={`stationary-torch-wrapper ${isIgniting ? 'igniting-stretch' : ''}`} ref={containerRef}>
      <div className="flame-container">
        {/* Animated Burning Flame Core */}
        <div className={`flame-core-animated ${isIgniting ? 'flame-stretching' : ''}`} />

        {/* Transfer Sparks during Ignition */}
        {isIgniting && (
          <>
            <div className="torch-spark-particle spark-1" />
            <div className="torch-spark-particle spark-2" />
            <div className="torch-spark-particle spark-3" />
          </>
        )}

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
