import React from 'react'

export default function KeyItem({
  isPickedUp = false,
  position = { x: 0, y: 0 },
  rotation = 0,
  onClick,
  style = {}
}) {
  return (
    <div
      className={`sf-door-key-item ${isPickedUp ? 'picked-up' : 'in-box'}`}
      onClick={onClick}
      style={{
        transform: isPickedUp
          ? `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) rotate(${rotation}deg)`
          : undefined,
        ...style
      }}
      role="button"
      tabIndex={0}
      aria-label="Antique Brass Key"
    >
      <svg viewBox="0 0 120 40" className="sf-key-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="brassKeyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5ecd8" />
            <stop offset="30%" stopColor="#d69a5c" />
            <stop offset="70%" stopColor="#8c5828" />
            <stop offset="100%" stopColor="#4a2e12" />
          </linearGradient>

          <filter id="keyGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Key Bow / Handle (SF Geometry) */}
        <g filter="url(#keyGlow)">
          <circle cx="24" cy="20" r="16" fill="none" stroke="url(#brassKeyGrad)" strokeWidth="4" />
          <polygon points="24,10 32,20 24,30 16,20" fill="url(#brassKeyGrad)" opacity="0.6" />
          <circle cx="24" cy="20" r="4" fill="#120c06" />

          {/* Key Shaft / Stem */}
          <rect x="38" y="17" width="65" height="6" rx="2" fill="url(#brassKeyGrad)" />

          {/* Antique Key Bits / Teeth */}
          <rect x="85" y="23" width="6" height="10" fill="url(#brassKeyGrad)" />
          <rect x="95" y="23" width="8" height="13" fill="url(#brassKeyGrad)" />
          <rect x="91" y="23" width="3" height="6" fill="#120c06" />
        </g>
      </svg>
    </div>
  )
}
