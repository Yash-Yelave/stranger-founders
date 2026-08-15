import React from 'react'
import LockMechanism from './LockMechanism.jsx'

export default function InitialDoorScene({
  doorState = 'IDLE', // IDLE, UNLOCKING, UNLOCKED, DOOR_OPENING, DOOR_OPEN, ENTERING_DOOR
  lockState = 'IDLE',
  proximityProgress = 0,
  lockRef,
  scrollProgress = 0,
  cameraZoom = 1
}) {
  const isDoorOpening = ['UNLOCKING', 'UNLOCKED', 'DOOR_OPENING', 'DOOR_OPEN', 'ENTERING_DOOR', 'HANDOFF'].includes(doorState)
  const isEntering = ['ENTERING_DOOR', 'HANDOFF'].includes(doorState)

  return (
    <div
      className={`sf-door-scene-viewport ${isDoorOpening ? 'is-opening' : ''} ${isEntering ? 'is-entering' : ''}`}
      style={{
        transform: `translate3d(0, ${-scrollProgress * 40}vh, 0) scale(${cameraZoom})`,
        opacity: Math.max(0, 1 - scrollProgress * 0.8)
      }}
    >
      {/* Background Architectural Lighting & Shadow Haze */}
      <div className="sf-door-environment">
        <div className="sf-door-light-beam" />
        <div className="sf-door-floor-reflection" />
      </div>

      {/* 3D Architectural Door Frame Assembly */}
      <div className="sf-door-frame-assembly">
        {/* Dark Environment Beyond Doorway */}
        <div className="sf-doorway-interior-light" />

        {/* Outer Heavy Molded Architectural Frame */}
        <div className="sf-door-outer-frame">
          {/* Left Door Leaf */}
          <div className={`sf-door-leaf leaf-left ${isDoorOpening ? 'open' : ''}`}>
            <div className="sf-door-wood-grain" />
            <div className="sf-door-panel panel-top" />
            <div className="sf-door-panel panel-middle">
              <div className="sf-door-motif">
                <svg viewBox="0 0 40 40" className="sf-motif-svg">
                  <circle cx="20" cy="20" r="14" fill="none" stroke="rgba(214,154,92,0.4)" strokeWidth="1" />
                  <polygon points="20,10 27,20 20,30 13,20" fill="rgba(214,154,92,0.2)" />
                </svg>
              </div>
            </div>
            <div className="sf-door-panel panel-bottom" />
            <div className="sf-door-edge-shadow" />
          </div>

          {/* Right Door Leaf (Houses Mechanical Lock) */}
          <div className={`sf-door-leaf leaf-right ${isDoorOpening ? 'open' : ''}`}>
            <div className="sf-door-wood-grain" />
            <div className="sf-door-panel panel-top" />
            <div className="sf-door-panel panel-middle">
              {/* Integrated Antique Mechanical Lock */}
              <LockMechanism
                lockState={lockState}
                proximityProgress={proximityProgress}
                lockRef={lockRef}
              />
            </div>
            <div className="sf-door-panel panel-bottom" />
            <div className="sf-door-edge-shadow" />
          </div>
        </div>
      </div>

      {/* Subtle Prompts */}
      {scrollProgress < 0.2 && (doorState === 'IDLE' || doorState === 'DOOR_IDLE') && (
        <div className="sf-door-scroll-hint">
          <span>Scroll to explore</span>
          <div className="sf-scroll-arrow" />
        </div>
      )}

      {['KEY_PICKED', 'RETURNING_TO_DOOR', 'KEY_APPROACHING_LOCK'].includes(doorState) && (
        <div className="sf-door-scroll-hint sf-key-lock-hint">
          <span>Move Key to Door Lock</span>
        </div>
      )}
    </div>
  )
}
