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
      <div className="cursor-flambeau-torch-container">
        {/* Layered Vector Torch Flame & Glow */}
        <div
          className={`flambeau-flame-wrapper ${isIgniting ? 'flame-igniting-grow' : ''}`}
          style={{
            opacity: isLit ? 1 : 0,
            transform: isLit ? (isIgniting ? undefined : 'scale(1)') : 'scale(0.2)',
            transition: isIgniting ? 'none' : 'opacity 0.5s ease-out, transform 0.5s ease-out',
            pointerEvents: 'none'
          }}
        >
          {/* Vector Layered Flame SVG */}
          <svg
            width="24"
            height="50"
            viewBox="0 0 24 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="vector-flame-svg"
          >
            {/* Outer Warm Orange/Amber Flame */}
            <path
              className="torch-flame-outer"
              d="M12 2 C16 12 23 22 23 33 C23 42 18.2 48 12 48 C5.8 48 1 42 1 33 C1 22 8 12 12 2 Z"
              fill="url(#outerFlameGradCursor)"
              style={{ filter: 'drop-shadow(0 0 8px rgba(245, 124, 0, 0.85))' }}
            />
            {/* Mid Golden Warm Flame Layer */}
            <path
              className="torch-flame-mid"
              d="M12 12 C15 19 19.5 26 19.5 34 C19.5 41 16.2 45 12 45 C7.8 45 4.5 41 4.5 34 C4.5 26 9 19 12 12 Z"
              fill="url(#midFlameGradCursor)"
            />
            {/* Core Luminous White/Cream Flame Center */}
            <path
              className="torch-flame-core"
              d="M12 24 C13.8 28 15.5 32 15.5 37 C15.5 41 13.9 43.5 12 43.5 C10.1 43.5 8.5 41 8.5 37 C8.5 32 10.2 28 12 24 Z"
              fill="url(#coreFlameGradCursor)"
            />
            <defs>
              <linearGradient id="outerFlameGradCursor" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#ffab40" />
                <stop offset="35%" stopColor="#ff6d00" />
                <stop offset="100%" stopColor="#dd2c00" />
              </linearGradient>
              <linearGradient id="midFlameGradCursor" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#fff59d" />
                <stop offset="40%" stopColor="#ffc107" />
                <stop offset="100%" stopColor="#ff8f00" />
              </linearGradient>
              <linearGradient id="coreFlameGradCursor" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#fffde7" />
                <stop offset="100%" stopColor="#ffe082" />
              </linearGradient>
            </defs>
          </svg>

          {/* Soft Warm Ambient Glow */}
          <div className="flambeau-soft-glow" />
        </div>

        {/* Vector Mashal Wooden & Brass Torch Body */}
        <div className="cursor-mashal-body">
          <svg
            width="24"
            height="96"
            viewBox="0 0 24 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Torch Flared Cup Head (Top Metal Bowl) */}
            <path
              d="M3 14 L6 28 C6 30 8 32 12 32 C16 32 18 30 18 28 L21 14 Z"
              fill="url(#mashalCupGradCursor)"
              stroke="#d69a5c"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Top Rim Lip */}
            <rect x="2" y="11" width="20" height="3.5" rx="1.5" fill="#d69a5c" />

            {/* Charcoal / Wick inside cup top */}
            <ellipse cx="12" cy="12.5" rx="8" ry="2" fill="#1c130c" stroke="#3d2716" strokeWidth="0.8" />
            <rect
              x="10"
              y="7"
              width="4"
              height="6"
              rx="1.5"
              fill="#2b1b10"
              stroke="#d69a5c"
              strokeWidth="0.5"
              style={{
                opacity: isLit ? 0.3 : 1,
                transition: 'opacity 0.4s ease-out'
              }}
            />

            {/* Metal Collar / Accent Ring */}
            <rect x="7" y="32" width="10" height="4" rx="1" fill="#8c5a2b" stroke="#d69a5c" strokeWidth="0.5" />

            {/* Tapered Wooden Handle Shaft */}
            <path d="M8.5 36 L9 86 C9 87.5 10 88 12 88 C14 88 15 87.5 15 86 L15.5 36 Z" fill="url(#handleWoodGradCursor)" />

            {/* Handle Grip Rings */}
            <rect x="8.2" y="48" width="7.6" height="2" rx="0.5" fill="#d69a5c" opacity="0.85" />
            <rect x="8.4" y="62" width="7.2" height="2" rx="0.5" fill="#d69a5c" opacity="0.85" />
            <rect x="8.6" y="76" width="6.8" height="2" rx="0.5" fill="#d69a5c" opacity="0.85" />

            {/* Metal Pommel Cap */}
            <path d="M9.5 86 L10 92 C10 93 11 94 12 94 C13 94 14 93 14 92 L14.5 86 Z" fill="#8c5a2b" stroke="#d69a5c" strokeWidth="0.5" />

            <defs>
              <linearGradient id="mashalCupGradCursor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8c5a2b" />
                <stop offset="40%" stopColor="#543317" />
                <stop offset="100%" stopColor="#29170a" />
              </linearGradient>
              <linearGradient id="handleWoodGradCursor" x1="0%" y1="0%" x2="100%" y2="0%">
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
