import React, { useEffect, useRef, useState } from 'react'

const EPISODES = [
  { id: 0, num: '01', title: 'FIRE 01', subtitle: 'EPISODE 01', deg: -90 }, // Top (12 o'clock)
  { id: 1, num: '02', title: 'FIRE 02', subtitle: 'EPISODE 02', deg: 0 },   // Right (3 o'clock)
  { id: 2, num: '03', title: 'FIRE 03', subtitle: 'EPISODE 03', deg: 90 },  // Bottom (6 o'clock)
  { id: 3, num: '04', title: 'FIRE 04', subtitle: 'EPISODE 04', deg: 180 }, // Left (9 o'clock)
]

export default function InteractiveFounderOrbit() {
  const containerRef = useRef(null)
  const animFrameRef = useRef(null)

  // High-frequency refs for 60fps rendering without React re-renders
  const stateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    isHovered: false,
    hoveredNode: null,
    parallaxX: 0,
    parallaxY: 0,
    tiltRotation: 0,
    ambientAngle: 0,
    innerAngle: 0,
    breathePhase: 0,
    lineProgress: [0, 0, 0, 0],
    founderProgress: [0, 0, 0, 0],
  })

  // React state for active node (infrequent update on node hover change)
  const [activeNode, setActiveNode] = useState(null)
  const touchTimerRef = useRef(null)

  // DOM Refs for direct 60fps manipulation
  const svgGroupRef = useRef(null)
  const outerDashedRingRef = useRef(null)
  const innerDashedRingRef = useRef(null)
  const glowCircleRef = useRef(null)
  const nodeRefs = useRef([])
  const lineRefs = useRef([])
  const labelRefs = useRef([])
  const founderGroupRefs = useRef([])

  useEffect(() => {
    let lastTime = performance.now()

    const animate = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      const s = stateRef.current

      // 1. Ambient Rotations
      s.ambientAngle = (s.ambientAngle + 8 * delta) % 360 // Outer slow rotation
      s.innerAngle = (s.innerAngle - 14 * delta) % 360   // Inner counter rotation
      s.breathePhase = (s.breathePhase + 1.2 * delta) % (Math.PI * 2)

      // 2. Parallax & Tilt Lerp
      const targetPxX = s.isHovered ? s.mouseX * 3.5 : 0
      const targetPxY = s.isHovered ? s.mouseY * 3.5 : 0
      const targetTilt = s.isHovered ? (s.mouseX * 2.5) : 0

      s.parallaxX += (targetPxX - s.parallaxX) * 0.08
      s.parallaxY += (targetPxY - s.parallaxY) * 0.08
      s.tiltRotation += (targetTilt - s.tiltRotation) * 0.08

      // Apply transform to SVG Group
      if (svgGroupRef.current) {
        svgGroupRef.current.style.transform = `translate3d(${s.parallaxX.toFixed(2)}px, ${s.parallaxY.toFixed(2)}px, 0px) rotate(${s.tiltRotation.toFixed(2)}deg)`
      }

      // Rotate Outer & Inner Dashed Circles
      if (outerDashedRingRef.current) {
        outerDashedRingRef.current.setAttribute('transform', `rotate(${s.ambientAngle.toFixed(2)} 130 130)`)
      }
      if (innerDashedRingRef.current) {
        innerDashedRingRef.current.setAttribute('transform', `rotate(${s.innerAngle.toFixed(2)} 130 130)`)
      }

      // Breathe Center Glow
      if (glowCircleRef.current) {
        const breathe = Math.sin(s.breathePhase) * 0.08
        const baseOpacity = s.isHovered ? 0.45 : 0.32
        const targetRadius = s.isHovered ? 54 : 48
        glowCircleRef.current.setAttribute('r', (targetRadius + breathe * 4).toFixed(1))
        glowCircleRef.current.style.opacity = (baseOpacity + breathe * 0.06).toPrecision(3)
      }

      // 3. Node Animations (Line growth, founder dots, scale)
      EPISODES.forEach((ep, i) => {
        const isActive = s.hoveredNode === i
        const targetLine = isActive ? 1 : 0
        const targetFounder = isActive ? 1 : 0

        s.lineProgress[i] += (targetLine - s.lineProgress[i]) * 0.12
        s.founderProgress[i] += (targetFounder - s.founderProgress[i]) * 0.12

        // Connection Line updates
        const lineEl = lineRefs.current[i]
        if (lineEl) {
          const prog = s.lineProgress[i]
          lineEl.style.opacity = (prog * 0.65).toFixed(2)
          lineEl.setAttribute('stroke-dashoffset', ((1 - prog) * 75).toFixed(1))
        }

        // Node circle scale & glow
        const nodeEl = nodeRefs.current[i]
        if (nodeEl) {
          const scale = isActive ? 1.4 : (i === 0 && s.hoveredNode === null ? 1.15 : 1)
          nodeEl.setAttribute('r', (4 * scale).toFixed(1))
          nodeEl.setAttribute('fill', isActive || (i === 0 && s.hoveredNode === null) ? '#d69a5c' : 'rgba(214,154,92,0.35)')
          nodeEl.style.filter = isActive
            ? 'drop-shadow(0 0 8px #d69a5c) drop-shadow(0 0 14px rgba(214,154,92,0.6))'
            : (i === 0 && s.hoveredNode === null ? 'drop-shadow(0 0 4px #d69a5c)' : 'none')
        }

        // Founder 4-dots group
        const founderGroup = founderGroupRefs.current[i]
        if (founderGroup) {
          const prog = s.founderProgress[i]
          founderGroup.style.opacity = prog.toFixed(2)
          founderGroup.style.transform = `scale(${(0.6 + prog * 0.4).toFixed(2)})`
        }

        // Node label
        const labelEl = labelRefs.current[i]
        if (labelEl) {
          const prog = s.lineProgress[i]
          labelEl.style.opacity = prog.toFixed(2)
          labelEl.style.transform = `translateY(${((1 - prog) * -4).toFixed(1)}px)`
        }
      })

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  // Pointer Move Handler
  const handlePointerMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Normalized coordinates (-1 to +1)
    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)))
    const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)))

    stateRef.current.mouseX = normX
    stateRef.current.mouseY = normY
    stateRef.current.isHovered = true

    // Check proximity to 4 nodes in SVG space (center at 130, 130, radius 95)
    const svgX = 130 + normX * 110
    const svgY = 130 + normY * 110

    let closestNode = null
    let minDist = 45 // Proximity threshold in pixels

    EPISODES.forEach((ep) => {
      const rad = (ep.deg * Math.PI) / 180
      const nodeX = 130 + 95 * Math.cos(rad)
      const nodeY = 130 + 95 * Math.sin(rad)
      const dist = Math.hypot(svgX - nodeX, svgY - nodeY)

      if (dist < minDist) {
        minDist = dist
        closestNode = ep.id
      }
    })

    if (stateRef.current.hoveredNode !== closestNode) {
      stateRef.current.hoveredNode = closestNode
      setActiveNode(closestNode)
    }
  }

  const handlePointerLeave = () => {
    stateRef.current.isHovered = false
    stateRef.current.mouseX = 0
    stateRef.current.mouseY = 0
    stateRef.current.hoveredNode = null
    setActiveNode(null)
  }

  // Touch Handler for Mobile/Tablet
  const handleNodeTouch = (id) => {
    stateRef.current.hoveredNode = id
    setActiveNode(id)

    if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
    touchTimerRef.current = setTimeout(() => {
      stateRef.current.hoveredNode = null
      setActiveNode(null)
    }, 2500)
  }

  return (
    <div
      className="s1-fire-ring-interactive"
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <svg className="s1-ring-svg" viewBox="0 0 260 260">
        <defs>
          <radialGradient id="fireGlowInteractive" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d69a5c" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#8a5527" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0c1710" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g ref={svgGroupRef} style={{ transformOrigin: '130px 130px', transition: 'transform 0.1s linear' }}>
          {/* Outer Static Background Arcs */}
          <circle cx="130" cy="130" r="115" fill="none" stroke="rgba(214,154,92,0.08)" strokeWidth="1" />
          <circle cx="130" cy="130" r="102" fill="none" stroke="rgba(214,154,92,0.06)" strokeWidth="1" />

          {/* Inner Counter-Rotating Dashed Orbit */}
          <circle
            ref={innerDashedRingRef}
            cx="130"
            cy="130"
            r="82"
            fill="none"
            stroke="rgba(214,154,92,0.12)"
            strokeWidth="1"
            strokeDasharray="4 10"
          />

          {/* Outer Slow-Rotating Primary Dashed Orbit */}
          <circle
            ref={outerDashedRingRef}
            cx="130"
            cy="130"
            r="95"
            fill="none"
            stroke="rgba(214,154,92,0.28)"
            strokeWidth="1.5"
            strokeDasharray="8 14"
          />

          {/* Center Breathing Glow */}
          <circle
            ref={glowCircleRef}
            cx="130"
            cy="130"
            r="48"
            fill="url(#fireGlowInteractive)"
          />

          {/* Smooth Radial Connection Lines (Node -> Center) */}
          {EPISODES.map((ep, i) => {
            const rad = (ep.deg * Math.PI) / 180
            const x1 = 130 + 95 * Math.cos(rad)
            const y1 = 130 + 95 * Math.sin(rad)
            const x2 = 130 + 35 * Math.cos(rad)
            const y2 = 130 + 35 * Math.sin(rad)

            return (
              <line
                key={`line-${i}`}
                ref={(el) => (lineRefs.current[i] = el)}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#d69a5c"
                strokeWidth="1.2"
                strokeDasharray="75"
                strokeDashoffset="75"
                style={{ opacity: 0, transition: 'opacity 0.2s ease-out' }}
              />
            )
          })}

          {/* 4 Episode / Fire Nodes */}
          {EPISODES.map((ep, i) => {
            const rad = (ep.deg * Math.PI) / 180
            const cx = 130 + 95 * Math.cos(rad)
            const cy = 130 + 95 * Math.sin(rad)

            // 4 tiny founder dots around each fire node
            const founderOffsets = [
              { dx: -9, dy: -9 },
              { dx: 9, dy: -9 },
              { dx: -9, dy: 9 },
              { dx: 9, dy: 9 },
            ]

            // Label positioning
            const labelX = 130 + 122 * Math.cos(rad)
            const labelY = 130 + 122 * Math.sin(rad) + (ep.deg === 90 ? 8 : ep.deg === -90 ? -4 : 3)

            return (
              <g key={`node-group-${i}`} onClick={() => handleNodeTouch(i)}>
                {/* Invisible larger hit target for touch/hover */}
                <circle cx={cx} cy={cy} r="22" fill="transparent" style={{ cursor: 'pointer' }} />

                {/* 4 Founder Dots around Fire */}
                <g
                  ref={(el) => (founderGroupRefs.current[i] = el)}
                  style={{
                    transformOrigin: `${cx}px ${cy}px`,
                    opacity: 0,
                    transition: 'opacity 0.25s ease-out',
                  }}
                >
                  {founderOffsets.map((dot, dIdx) => (
                    <circle
                      key={dIdx}
                      cx={cx + dot.dx}
                      cy={cy + dot.dy}
                      r="1.8"
                      fill="#f5ecd8"
                      opacity="0.85"
                      style={{ filter: 'drop-shadow(0 0 3px #d69a5c)' }}
                    />
                  ))}
                </g>

                {/* Main Episode Fire Node Circle */}
                <circle
                  ref={(el) => (nodeRefs.current[i] = el)}
                  cx={cx}
                  cy={cy}
                  r="4"
                  fill={i === 0 ? '#d69a5c' : 'rgba(214,154,92,0.35)'}
                  style={{ transition: 'r 0.25s ease-out, fill 0.25s ease-out' }}
                />

                {/* Minimal Node Label (e.g. FIRE 01) */}
                <g
                  ref={(el) => (labelRefs.current[i] = el)}
                  style={{
                    opacity: 0,
                    transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
                    pointerEvents: 'none',
                  }}
                >
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="Manrope, sans-serif"
                    fontSize="7.5"
                    fontWeight="800"
                    fill="#d69a5c"
                    letterSpacing="2.5"
                    style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.9))' }}
                  >
                    {ep.title}
                  </text>
                </g>
              </g>
            )
          })}

          {/* Center Monogram / Reaction Text Group */}
          {/* Default Center Text (SF / SEASON 01) */}
          <g style={{ opacity: activeNode === null ? 1 : 0, transition: 'opacity 0.35s ease' }}>
            <text
              x="130"
              y="126"
              textAnchor="middle"
              fontFamily="Fraunces, Georgia, serif"
              fontSize="14"
              fill="rgba(245,236,216,0.85)"
              letterSpacing="4"
            >
              SF
            </text>
            <text
              x="130"
              y="142"
              textAnchor="middle"
              fontFamily="Manrope, sans-serif"
              fontSize="8.5"
              fill="rgba(214,154,92,0.75)"
              letterSpacing="3"
              fontWeight="700"
            >
              SEASON 01
            </text>
          </g>

          {/* Active Node Reaction Text (01 / FIRE, 02 / FIRE, etc.) */}
          <g style={{ opacity: activeNode !== null ? 1 : 0, transition: 'opacity 0.35s ease' }}>
            <text
              x="130"
              y="126"
              textAnchor="middle"
              fontFamily="Fraunces, Georgia, serif"
              fontSize="15"
              fontWeight="700"
              fill="#d69a5c"
              letterSpacing="3"
              style={{ filter: 'drop-shadow(0 0 6px rgba(214,154,92,0.5))' }}
            >
              {activeNode !== null ? EPISODES[activeNode].num : '01'}
            </text>
            <text
              x="130"
              y="142"
              textAnchor="middle"
              fontFamily="Manrope, sans-serif"
              fontSize="8"
              fill="rgba(245,236,216,0.9)"
              letterSpacing="3"
              fontWeight="800"
            >
              FIRE
            </text>
          </g>
        </g>
      </svg>
    </div>
  )
}
