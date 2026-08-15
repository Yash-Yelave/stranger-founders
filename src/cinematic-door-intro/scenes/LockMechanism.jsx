import React from 'react'

export default function LockMechanism({
  lockState = 'IDLE', // IDLE, APPROACHING, INSERTED, UNLOCKING, UNLOCKED
  proximityProgress = 0,
  lockRef
}) {
  return (
    <div
      ref={lockRef}
      className={`sf-door-lock-wrapper lock-state-${lockState.toLowerCase()}`}
      style={{
        boxShadow: proximityProgress > 0
          ? `0 0 ${proximityProgress * 30}px rgba(214, 154, 92, ${proximityProgress * 0.6})`
          : undefined
      }}
    >
      <svg viewBox="0 0 100 140" className="sf-lock-svg">
        <defs>
          <linearGradient id="brassLockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5ecd8" />
            <stop offset="25%" stopColor="#d69a5c" />
            <stop offset="60%" stopColor="#8c5828" />
            <stop offset="100%" stopColor="#2e1d0c" />
          </linearGradient>

          <radialGradient id="keyholeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245, 236, 216, 0.9)" />
            <stop offset="60%" stopColor="rgba(214, 154, 92, 0.4)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>
        </defs>

        {/* Outer Lock Escutcheon Plate (Aged Brass Hex/Arch) */}
        <path
          d="M 15 25 Q 50 5 85 25 L 85 115 Q 50 135 15 115 Z"
          fill="url(#brassLockGrad)"
          stroke="rgba(245, 236, 216, 0.3)"
          strokeWidth="1.5"
        />

        {/* Decorative Engraving & Rivets */}
        <circle cx="26" cy="24" r="2.5" fill="#1b1208" stroke="#8c5828" strokeWidth="0.8" />
        <circle cx="74" cy="24" r="2.5" fill="#1b1208" stroke="#8c5828" strokeWidth="0.8" />
        <circle cx="26" cy="116" r="2.5" fill="#1b1208" stroke="#8c5828" strokeWidth="0.8" />
        <circle cx="74" cy="116" r="2.5" fill="#1b1208" stroke="#8c5828" strokeWidth="0.8" />

        {/* Inner Keyhole Bevel */}
        <circle cx="50" cy="60" r="18" fill="#120c06" stroke="rgba(214, 154, 92, 0.5)" strokeWidth="1" />

        {/* Proximity Light Catch Glow */}
        {proximityProgress > 0 && (
          <circle cx="50" cy="60" r={18 + proximityProgress * 8} fill="url(#keyholeGlow)" opacity={proximityProgress} />
        )}

        {/* Keyhole Slot */}
        <g className="sf-keyhole-shape">
          <circle cx="50" cy="56" r="6" fill="#050302" />
          <polygon points="46,56 54,56 57,80 43,80" fill="#050302" />
        </g>
      </svg>
    </div>
  )
}
