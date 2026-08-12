import React, { useRef } from 'react'
import { INTRO_STATES } from '../IntroStateMachine'

export default function StationaryTorch({ torchPosRef, currentState }) {
  const containerRef = useRef(null)
  const isIgniting = currentState === INTRO_STATES.TORCH_IGNITION

  // Pass container rect position back up via ref for ignition calculations
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
      <div className="vector-flambeau-holder">
        {/* Animated Vector Flame Core */}
        <div className="flame-container">
          <div className={`vector-flame-wrapper ${isIgniting ? 'flame-stretching' : ''}`}>
            <svg
              width="28"
              height="58"
              viewBox="0 0 24 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="vector-flame-svg"
            >
              {/* Outer Warm Amber/Orange Flame */}
              <path
                d="M12 2 C16 12 23 22 23 33 C23 42 18.2 48 12 48 C5.8 48 1 42 1 33 C1 22 8 12 12 2 Z"
                fill="url(#outerFlameGradStat)"
                style={{ filter: 'drop-shadow(0 0 8px rgba(245, 124, 0, 0.8))' }}
              />
              {/* Mid Golden Warm Flame Layer */}
              <path
                d="M12 12 C15 19 19.5 26 19.5 34 C19.5 41 16.2 45 12 45 C7.8 45 4.5 41 4.5 34 C4.5 26 9 19 12 12 Z"
                fill="url(#midFlameGradStat)"
              />
              {/* Core Luminous White/Cream Flame Center */}
              <path
                d="M12 24 C13.8 28 15.5 32 15.5 37 C15.5 41 13.9 43.5 12 43.5 C10.1 43.5 8.5 41 8.5 37 C8.5 32 10.2 28 12 24 Z"
                fill="url(#coreFlameGradStat)"
              />
              <defs>
                <linearGradient id="outerFlameGradStat" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#ffab40" />
                  <stop offset="35%" stopColor="#ff6d00" />
                  <stop offset="100%" stopColor="#dd2c00" />
                </linearGradient>
                <linearGradient id="midFlameGradStat" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#fff59d" />
                  <stop offset="40%" stopColor="#ffc107" />
                  <stop offset="100%" stopColor="#ff8f00" />
                </linearGradient>
                <linearGradient id="coreFlameGradStat" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#fffde7" />
                  <stop offset="100%" stopColor="#ffe082" />
                </linearGradient>
              </defs>
            </svg>
          </div>

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
              top: '-25px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,183,0,0.55) 0%, rgba(255,85,0,0.2) 50%, transparent 80%)',
              pointerEvents: 'none',
              filter: 'blur(12px)'
            }}
          />
        </div>

        {/* Vector Mashal Wooden & Brass Torch Body */}
        <div className="vector-mashal-body">
          <svg
            width="28"
            height="110"
            viewBox="0 0 24 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Torch Flared Cup Head (Top Metal Bowl) */}
            <path
              d="M3 14 L6 28 C6 30 8 32 12 32 C16 32 18 30 18 28 L21 14 Z"
              fill="url(#mashalCupGradStat)"
              stroke="#d69a5c"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Top Rim Lip */}
            <rect x="2" y="11" width="20" height="3.5" rx="1.5" fill="#d69a5c" />

            {/* Charcoal / Coals inside cup top */}
            <ellipse cx="12" cy="12.5" rx="8" ry="2" fill="#1c130c" stroke="#3d2716" strokeWidth="0.8" />

            {/* Metal Collar / Accent Ring */}
            <rect x="7" y="32" width="10" height="4" rx="1" fill="#8c5a2b" stroke="#d69a5c" strokeWidth="0.5" />

            {/* Tapered Wooden Handle Shaft */}
            <path d="M8.5 36 L9 86 C9 87.5 10 88 12 88 C14 88 15 87.5 15 86 L15.5 36 Z" fill="url(#handleWoodGradStat)" />

            {/* Handle Grip Rings */}
            <rect x="8.2" y="48" width="7.6" height="2" rx="0.5" fill="#d69a5c" opacity="0.85" />
            <rect x="8.4" y="62" width="7.2" height="2" rx="0.5" fill="#d69a5c" opacity="0.85" />
            <rect x="8.6" y="76" width="6.8" height="2" rx="0.5" fill="#d69a5c" opacity="0.85" />

            {/* Metal Pommel Cap */}
            <path d="M9.5 86 L10 92 C10 93 11 94 12 94 C13 94 14 93 14 92 L14.5 86 Z" fill="#8c5a2b" stroke="#d69a5c" strokeWidth="0.5" />

            <defs>
              <linearGradient id="mashalCupGradStat" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8c5a2b" />
                <stop offset="40%" stopColor="#543317" />
                <stop offset="100%" stopColor="#29170a" />
              </linearGradient>
              <linearGradient id="handleWoodGradStat" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5c381e" />
                <stop offset="50%" stopColor="#3d2311" />
                <stop offset="100%" stopColor="#241308" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  )
}
