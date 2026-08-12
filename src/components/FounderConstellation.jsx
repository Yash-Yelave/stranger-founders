import React, { useEffect, useRef, useState } from 'react'

// 16 Creator Founders across 4 Episodes (4 founders per episode)
const CONSTELLATION_DATA = [
  {
    episode: 1,
    epNumber: '01',
    epLabel: 'EPISODE 01',
    centerAngle: -90, // Top / 12 o'clock
    founders: [
      { id: 'f1', name: 'Alex Vance', initials: 'AV', offsetAngle: -22, radialOffset: -4 },
      { id: 'f2', name: 'Maya Chen', initials: 'MC', offsetAngle: -7, radialOffset: 5 },
      { id: 'f3', name: 'Rayan Sterling', initials: 'RS', offsetAngle: 7, radialOffset: -3 },
      { id: 'f4', name: 'Sara Thorne', initials: 'ST', offsetAngle: 22, radialOffset: 6 },
    ],
  },
  {
    episode: 2,
    epNumber: '02',
    epLabel: 'EPISODE 02',
    centerAngle: 0, // Right / 3 o'clock
    founders: [
      { id: 'f5', name: 'Elena Mercer', initials: 'EM', offsetAngle: -22, radialOffset: 4 },
      { id: 'f6', name: 'Kaelen Rivers', initials: 'KR', offsetAngle: -7, radialOffset: -5 },
      { id: 'f7', name: 'Devin Hayes', initials: 'DH', offsetAngle: 7, radialOffset: 3 },
      { id: 'f8', name: 'Jules Moreau', initials: 'JM', offsetAngle: 22, radialOffset: -4 },
    ],
  },
  {
    episode: 3,
    epNumber: '03',
    epLabel: 'EPISODE 03',
    centerAngle: 90, // Bottom / 6 o'clock
    founders: [
      { id: 'f9', name: 'Nadia Sinclair', initials: 'NS', offsetAngle: -22, radialOffset: -3 },
      { id: 'f10', name: 'Tariq Croft', initials: 'TC', offsetAngle: -7, radialOffset: 6 },
      { id: 'f11', name: 'Leo Adler', initials: 'LA', offsetAngle: 7, radialOffset: -4 },
      { id: 'f12', name: 'Zara Frost', initials: 'ZF', offsetAngle: 22, radialOffset: 5 },
    ],
  },
  {
    episode: 4,
    epNumber: '04',
    epLabel: 'EPISODE 04',
    centerAngle: 180, // Left / 9 o'clock
    founders: [
      { id: 'f13', name: 'Harlan Black', initials: 'HB', offsetAngle: -22, radialOffset: 5 },
      { id: 'f14', name: 'Valerie Drake', initials: 'VD', offsetAngle: -7, radialOffset: -4 },
      { id: 'f15', name: 'Cyrus Sol', initials: 'CS', offsetAngle: 7, radialOffset: 4 },
      { id: 'f16', name: 'Orla Wilde', initials: 'OW', offsetAngle: 22, radialOffset: -5 },
    ],
  },
]

// Flatten all 16 founders into a flat array for indexing
const ALL_FOUNDERS = CONSTELLATION_DATA.flatMap((ep, epIdx) =>
  ep.founders.map((f, fIdx) => ({
    ...f,
    epIdx,
    epNumber: ep.epNumber,
    epLabel: ep.epLabel,
    globalIdx: epIdx * 4 + fIdx,
  }))
)

export default function FounderConstellation({ activeStat }) {
  const containerRef = useRef(null)
  const animFrameRef = useRef(null)

  // High-frequency animation state stored in ref (no React re-renders on mouse movement)
  const stateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    isHovered: false,
    hoveredEpIdx: null,
    hoveredFounderIdx: null,
    expandedEpIdx: null,
    parallaxX: 0,
    parallaxY: 0,
    tiltRotation: 0,
    ambientAngle: 0,
    innerAngle: 0,
    breathePhase: 0,
    entranceTime: 0, // Initial entrance timer (0 -> 1.8s)
    centerPauseTime: 0, // Timer tracking cursor pause at center
    burstFactor: 1, // Contract/expand burst scale (1 -> 0.45 -> 1)
    burstState: 'idle', // 'idle' | 'contracting' | 'expanding'
    // Per-node animated displacements for 16 nodes
    nodeOffsets: ALL_FOUNDERS.map(() => ({ x: 0, y: 0, scale: 1, opacity: 0 })),
    trailPoints: [], // Recent cursor positions in SVG space
  })

  // React state for UI triggers (active episode / hovered founder)
  const [activeEpisode, setActiveEpisode] = useState(null)
  const [expandedEpisode, setExpandedEpisode] = useState(null)
  const [hoveredFounder, setHoveredFounder] = useState(null)

  // Direct DOM Refs for high performance
  const svgGroupRef = useRef(null)
  const outerRingRef = useRef(null)
  const innerRingRef = useRef(null)
  const glowCircleRef = useRef(null)
  const nodeRefs = useRef([])
  const founderLabelRefs = useRef([])
  const epLabelRefs = useRef([])
  const epLineGroupRefs = useRef([])
  const cursorTrailPathRef = useRef(null)

  useEffect(() => {
    let lastTime = performance.now()
    const startTime = performance.now()

    const animate = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      const s = stateRef.current
      s.entranceTime = Math.min((now - startTime) / 1000, 2.0)

      // 1. Ambient Motions
      s.ambientAngle = (s.ambientAngle + 6 * delta) % 360 // Outer orbit rotation
      s.innerAngle = (s.innerAngle - 12 * delta) % 360   // Inner orbit rotation
      s.breathePhase = (s.breathePhase + 1.2 * delta) % (Math.PI * 2)

      // 2. Center Pause Magnetic Burst Check
      const distFromCenter = Math.hypot(s.mouseX, s.mouseY)
      if (s.isHovered && distFromCenter < 0.25) {
        s.centerPauseTime += delta
        if (s.centerPauseTime > 0.8 && s.burstState === 'idle') {
          s.burstState = 'contracting'
        }
      } else {
        s.centerPauseTime = 0
      }

      // Handle Burst Animation Logic
      if (s.burstState === 'contracting') {
        s.burstFactor -= delta * 1.8
        if (s.burstFactor <= 0.42) {
          s.burstFactor = 0.42
          s.burstState = 'expanding'
        }
      } else if (s.burstState === 'expanding') {
        s.burstFactor += delta * 1.5
        if (s.burstFactor >= 1.0) {
          s.burstFactor = 1.0
          s.burstState = 'idle'
        }
      }

      // 3. Parallax & Tilt Lerp
      const targetPxX = s.isHovered ? s.mouseX * 4.5 : 0
      const targetPxY = s.isHovered ? s.mouseY * 4.5 : 0
      const targetTilt = s.isHovered ? s.mouseX * 2.8 : 0

      s.parallaxX += (targetPxX - s.parallaxX) * 0.08
      s.parallaxY += (targetPxY - s.parallaxY) * 0.08
      s.tiltRotation += (targetTilt - s.tiltRotation) * 0.08

      // Apply transform to SVG Container Group
      if (svgGroupRef.current) {
        svgGroupRef.current.style.transform = `translate3d(${s.parallaxX.toFixed(2)}px, ${s.parallaxY.toFixed(2)}px, 0px) rotate(${s.tiltRotation.toFixed(2)}deg)`
      }

      // Rotate Ambient Rings
      if (outerRingRef.current) {
        outerRingRef.current.setAttribute('transform', `rotate(${s.ambientAngle.toFixed(2)} 150 150)`)
      }
      if (innerRingRef.current) {
        innerRingRef.current.setAttribute('transform', `rotate(${s.innerAngle.toFixed(2)} 150 150)`)
      }

      // Breathe Glow
      if (glowCircleRef.current) {
        const breathe = Math.sin(s.breathePhase) * 0.08
        const baseOpacity = s.isHovered ? 0.46 : 0.32
        const targetRadius = s.isHovered ? 56 : 48
        glowCircleRef.current.setAttribute('r', (targetRadius + breathe * 5).toFixed(1))
        glowCircleRef.current.style.opacity = (baseOpacity + breathe * 0.06).toPrecision(3)
      }

      // 4. Update Trail Points
      if (s.isHovered) {
        const curSvgX = 150 + s.mouseX * 125
        const curSvgY = 150 + s.mouseY * 125
        s.trailPoints.push({ x: curSvgX, y: curSvgY, time: now })
      }
      s.trailPoints = s.trailPoints.filter((pt) => now - pt.time < 500)

      if (cursorTrailPathRef.current) {
        if (s.trailPoints.length > 1) {
          const pathD = s.trailPoints.reduce(
            (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`,
            ''
          )
          cursorTrailPathRef.current.setAttribute('d', pathD)
          cursorTrailPathRef.current.style.opacity = '0.35'
        } else {
          cursorTrailPathRef.current.style.opacity = '0'
        }
      }

      // 5. Update 16 Founder Nodes 60FPS Animation
      ALL_FOUNDERS.forEach((f, i) => {
        const nodeEl = nodeRefs.current[i]
        if (!nodeEl) return

        // Initial Entrance Fade-in Stagger
        const entranceProgress = Math.max(0, Math.min(1, (s.entranceTime - i * 0.08) / 0.4))

        // Compute Base Position on Orbit (Radius = 105px)
        const epData = CONSTELLATION_DATA[f.epIdx]

        // Check if Stat Synchronization is Active
        let statClusterShift = 0
        if (activeStat === 'episodes') {
          // Push clusters further apart
          statClusterShift = 14
        }

        const baseR = 105 + f.radialOffset + statClusterShift
        const baseAngleDeg = epData.centerAngle + f.offsetAngle
        const baseAngleRad = (baseAngleDeg * Math.PI) / 180

        let baseX = 150 + baseR * Math.cos(baseAngleRad)
        let baseY = 150 + baseR * Math.sin(baseAngleRad)

        // Apply Central Burst Contracting Scale
        if (s.burstFactor !== 1) {
          baseX = 150 + (baseX - 150) * s.burstFactor
          baseY = 150 + (baseY - 150) * s.burstFactor
        }

        // Magnetic Cursor Pull
        let magX = 0
        let magY = 0
        if (s.isHovered) {
          const curSvgX = 150 + s.mouseX * 125
          const curSvgY = 150 + s.mouseY * 125
          const distToCursor = Math.hypot(curSvgX - baseX, curSvgY - baseY)

          if (distToCursor < 80) {
            const pullForce = (1 - distToCursor / 80) * 8.5
            magX = (curSvgX - baseX) * 0.12 * pullForce
            magY = (curSvgY - baseY) * 0.12 * pullForce
          }
        }

        // Ep Cluster Hover & Expanded State Shifts
        const isEpActive = s.hoveredEpIdx === f.epIdx || s.expandedEpIdx === f.epIdx
        const isStatFoundersActive = activeStat === 'founders'
        const isStatPerEpActive = activeStat === 'per_episode' && f.epIdx === 0

        let nodeScale = 1.0
        let nodeAlpha = 0.55 + entranceProgress * 0.45

        if (isEpActive || isStatFoundersActive || isStatPerEpActive) {
          nodeScale = 1.35
          nodeAlpha = 1.0
        } else if (s.hoveredEpIdx !== null && !isEpActive) {
          nodeAlpha = 0.25
        }

        if (s.hoveredFounderIdx === i) {
          nodeScale = 1.65
          nodeAlpha = 1.0
        }

        // Lerp Offsets
        const targetX = magX
        const targetY = magY
        const off = s.nodeOffsets[i]
        off.x += (targetX - off.x) * 0.12
        off.y += (targetY - off.y) * 0.12

        const finalX = baseX + off.x
        const finalY = baseY + off.y

        nodeEl.setAttribute('cx', finalX.toFixed(1))
        nodeEl.setAttribute('cy', finalY.toFixed(1))
        nodeEl.setAttribute('r', (3.5 * nodeScale * entranceProgress).toFixed(1))
        nodeEl.style.opacity = (nodeAlpha * entranceProgress).toFixed(2)

        const isHighlighted = isEpActive || isStatFoundersActive || isStatPerEpActive || s.hoveredFounderIdx === i
        nodeEl.setAttribute('fill', isHighlighted ? '#d69a5c' : 'rgba(214,154,92,0.65)')
        nodeEl.style.filter = isHighlighted
          ? 'drop-shadow(0 0 6px #d69a5c) drop-shadow(0 0 12px rgba(214,154,92,0.5))'
          : 'none'
      })

      // 6. Update Episode Group Labels & Connecting Lines
      CONSTELLATION_DATA.forEach((ep, epIdx) => {
        const isEpActive = s.hoveredEpIdx === epIdx || s.expandedEpIdx === epIdx || (activeStat === 'per_episode' && epIdx === 0)
        const lineGroup = epLineGroupRefs.current[epIdx]
        if (lineGroup) {
          lineGroup.style.opacity = isEpActive ? '0.75' : '0.12'
        }

        const labelEl = epLabelRefs.current[epIdx]
        if (labelEl) {
          labelEl.style.opacity = isEpActive ? '1' : '0'
          labelEl.style.transform = isEpActive ? 'translateY(0px)' : 'translateY(4px)'
        }
      })

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [activeStat])

  // Pointer Move Handler
  const handlePointerMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)))
    const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)))

    stateRef.current.mouseX = normX
    stateRef.current.mouseY = normY
    stateRef.current.isHovered = true

    const curSvgX = 150 + normX * 125
    const curSvgY = 150 + normY * 125

    // 1. Check proximity to 16 individual founder nodes
    let closestFounder = null
    let minFounderDist = 28 // 28px hit radius

    ALL_FOUNDERS.forEach((f, idx) => {
      const epData = CONSTELLATION_DATA[f.epIdx]
      const baseR = 105 + f.radialOffset
      const baseAngleRad = ((epData.centerAngle + f.offsetAngle) * Math.PI) / 180
      const nodeX = 150 + baseR * Math.cos(baseAngleRad)
      const nodeY = 150 + baseR * Math.sin(baseAngleRad)

      const dist = Math.hypot(curSvgX - nodeX, curSvgY - nodeY)
      if (dist < minFounderDist) {
        minFounderDist = dist
        closestFounder = idx
      }
    })

    // 2. Check proximity to 4 Episode Clusters
    let closestEp = null
    let minEpDist = 55 // 55px cluster radius

    CONSTELLATION_DATA.forEach((ep, epIdx) => {
      const rad = (ep.centerAngle * Math.PI) / 180
      const epX = 150 + 105 * Math.cos(rad)
      const epY = 150 + 105 * Math.sin(rad)
      const dist = Math.hypot(curSvgX - epX, curSvgY - epY)

      if (dist < minEpDist) {
        minEpDist = dist
        closestEp = epIdx
      }
    })

    if (stateRef.current.hoveredEpIdx !== closestEp) {
      stateRef.current.hoveredEpIdx = closestEp
      setActiveEpisode(closestEp)
    }

    if (stateRef.current.hoveredFounderIdx !== closestFounder) {
      stateRef.current.hoveredFounderIdx = closestFounder
      setHoveredFounder(closestFounder !== null ? ALL_FOUNDERS[closestFounder] : null)
    }
  }

  const handlePointerLeave = () => {
    stateRef.current.isHovered = false
    stateRef.current.mouseX = 0
    stateRef.current.mouseY = 0
    stateRef.current.hoveredEpIdx = null
    stateRef.current.hoveredFounderIdx = null
    setActiveEpisode(null)
    setHoveredFounder(null)
  }

  // Click/Tap Handler for Expanding an Episode Cluster
  const handleClusterClick = (epIdx, e) => {
    e.stopPropagation()
    const nextExpanded = expandedEpisode === epIdx ? null : epIdx
    stateRef.current.expandedEpIdx = nextExpanded
    setExpandedEpisode(nextExpanded)
  }

  const handleContainerClick = () => {
    if (expandedEpisode !== null) {
      stateRef.current.expandedEpIdx = null
      setExpandedEpisode(null)
    }
  }

  return (
    <div
      className="s1-founder-constellation"
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleContainerClick}
    >
      <svg className="s1-constellation-svg" viewBox="0 0 300 300">
        <defs>
          <radialGradient id="constellationGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d69a5c" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#8a5527" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0c1710" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g ref={svgGroupRef} style={{ transformOrigin: '150px 150px', transition: 'transform 0.1s linear' }}>
          {/* Background Structural Orbits */}
          <circle cx="150" cy="150" r="132" fill="none" stroke="rgba(214,154,92,0.08)" strokeWidth="1" />
          <circle cx="150" cy="150" r="118" fill="none" stroke="rgba(214,154,92,0.06)" strokeWidth="1" />

          {/* Inner Counter-Rotating Dashed Orbit */}
          <circle
            ref={innerRingRef}
            cx="150"
            cy="150"
            r="92"
            fill="none"
            stroke="rgba(214,154,92,0.14)"
            strokeWidth="1"
            strokeDasharray="4 10"
          />

          {/* Outer Rotating Dashed Primary Orbit */}
          <circle
            ref={outerRingRef}
            cx="150"
            cy="150"
            r="105"
            fill="none"
            stroke="rgba(214,154,92,0.28)"
            strokeWidth="1.5"
            strokeDasharray="8 14"
          />

          {/* Center Breathing Ambient Glow */}
          <circle
            ref={glowCircleRef}
            cx="150"
            cy="150"
            r="48"
            fill="url(#constellationGlow)"
          />

          {/* Transient Cursor Trail Lines */}
          <path
            ref={cursorTrailPathRef}
            fill="none"
            stroke="#d69a5c"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            style={{ opacity: 0, transition: 'opacity 0.2s ease-out' }}
          />

          {/* Episode Cluster Intra-Connecting Polygon Lines */}
          {CONSTELLATION_DATA.map((ep, epIdx) => {
            const epFounders = ALL_FOUNDERS.filter((f) => f.epIdx === epIdx)
            // Generate interconnecting lines between 4 founders in cluster
            const linePaths = []
            for (let a = 0; a < epFounders.length; a++) {
              for (let b = a + 1; b < epFounders.length; b++) {
                const fA = epFounders[a]
                const fB = epFounders[b]
                const radA = ((ep.centerAngle + fA.offsetAngle) * Math.PI) / 180
                const radB = ((ep.centerAngle + fB.offsetAngle) * Math.PI) / 180
                const rA = 105 + fA.radialOffset
                const rB = 105 + fB.radialOffset
                const x1 = 150 + rA * Math.cos(radA)
                const y1 = 150 + rA * Math.sin(radA)
                const x2 = 150 + rB * Math.cos(radB)
                const y2 = 150 + rB * Math.sin(radB)

                linePaths.push(`M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`)
              }
            }

            return (
              <g
                key={`ep-lines-${epIdx}`}
                ref={(el) => (epLineGroupRefs.current[epIdx] = el)}
                style={{ opacity: 0.12, transition: 'opacity 0.3s ease-out' }}
              >
                {linePaths.map((dStr, lIdx) => (
                  <path key={lIdx} d={dStr} stroke="#d69a5c" strokeWidth="1" fill="none" />
                ))}
              </g>
            )
          })}

          {/* 16 Creator Founder Nodes */}
          {ALL_FOUNDERS.map((f, i) => (
            <circle
              key={`founder-node-${i}`}
              ref={(el) => (nodeRefs.current[i] = el)}
              cx="150"
              cy="150"
              r="3.5"
              fill="rgba(214,154,92,0.65)"
              style={{
                cursor: 'pointer',
                transition: 'fill 0.25s ease-out, opacity 0.25s ease-out',
              }}
            />
          ))}

          {/* Episode Cluster Labels (e.g. EPISODE 01, EPISODE 02) */}
          {CONSTELLATION_DATA.map((ep, epIdx) => {
            const rad = (ep.centerAngle * Math.PI) / 180
            const labelX = 150 + 136 * Math.cos(rad)
            const labelY = 150 + 136 * Math.sin(rad) + (ep.centerAngle === 90 ? 8 : ep.centerAngle === -90 ? -4 : 3)

            return (
              <g
                key={`ep-label-${epIdx}`}
                ref={(el) => (epLabelRefs.current[epIdx] = el)}
                onClick={(e) => handleClusterClick(epIdx, e)}
                style={{
                  opacity: 0,
                  transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
                  cursor: 'pointer',
                }}
              >
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="Manrope, sans-serif"
                  fontSize="8"
                  fontWeight="800"
                  fill="#d69a5c"
                  letterSpacing="2.8"
                  style={{ filter: 'drop-shadow(0 1px 5px rgba(0,0,0,0.95))' }}
                >
                  {ep.epLabel}
                </text>
              </g>
            )
          })}

          {/* Expanded Episode Founder Markers (Revealed when Episode Cluster is Clicked) */}
          {expandedEpisode !== null && (
            <g style={{ animation: 'fadeIn 0.3s ease-out' }}>
              {CONSTELLATION_DATA[expandedEpisode].founders.map((founder, idx) => {
                const ep = CONSTELLATION_DATA[expandedEpisode]
                const epRad = (ep.centerAngle * Math.PI) / 180
                const epCenterX = 150 + 105 * Math.cos(epRad)
                const epCenterY = 150 + 105 * Math.sin(epRad)

                // 4 expanded positions around the cluster center
                const expAngles = [-90, 0, 90, 180]
                const expRad = (expAngles[idx] * Math.PI) / 180
                const fX = epCenterX + 32 * Math.cos(expRad)
                const fY = epCenterY + 32 * Math.sin(expRad)

                return (
                  <g key={`expanded-founder-${founder.id}`} style={{ transition: 'all 0.3s ease-out' }}>
                    {/* Radial Connecting Line from Cluster Center */}
                    <line
                      x1={epCenterX}
                      y1={epCenterY}
                      x2={fX}
                      y2={fY}
                      stroke="#d69a5c"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                      opacity="0.6"
                    />

                    {/* Founder Circular Badge */}
                    <circle
                      cx={fX}
                      cy={fY}
                      r="12"
                      fill="#12251a"
                      stroke="#d69a5c"
                      strokeWidth="1.2"
                      style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9)) drop-shadow(0 0 10px rgba(214,154,92,0.4))' }}
                    />
                    <text
                      x={fX}
                      y={fY + 0.5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontFamily="Manrope, sans-serif"
                      fontSize="7"
                      fontWeight="800"
                      fill="#f5ecd8"
                      letterSpacing="1"
                    >
                      {founder.initials}
                    </text>

                    {/* Founder Name Label */}
                    <text
                      x={fX}
                      y={fY + 18}
                      textAnchor="middle"
                      fontFamily="Manrope, sans-serif"
                      fontSize="6.5"
                      fontWeight="700"
                      fill="#d69a5c"
                      letterSpacing="0.8"
                      style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.9))' }}
                    >
                      {founder.name}
                    </text>
                  </g>
                )
              })}
            </g>
          )}

          {/* Hovered Founder Individual Name Tooltip (Minimal) */}
          {hoveredFounder !== null && expandedEpisode === null && (
            <g style={{ transition: 'all 0.2s ease-out', pointerEvents: 'none' }}>
              {(() => {
                const f = hoveredFounder
                const epData = CONSTELLATION_DATA[f.epIdx]
                const baseR = 105 + f.radialOffset
                const baseAngleRad = ((epData.centerAngle + f.offsetAngle) * Math.PI) / 180
                const tipX = 150 + (baseR + 18) * Math.cos(baseAngleRad)
                const tipY = 150 + (baseR + 18) * Math.sin(baseAngleRad)

                return (
                  <text
                    x={tipX}
                    y={tipY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="Manrope, sans-serif"
                    fontSize="7.5"
                    fontWeight="800"
                    fill="#f5ecd8"
                    letterSpacing="1"
                    style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.95))' }}
                  >
                    {f.name}
                  </text>
                )
              })()}
            </g>
          )}

          {/* Center Monogram / Reaction Text Group */}
          {/* Default Center Text (SF / SEASON 01) */}
          <g style={{ opacity: activeEpisode === null && expandedEpisode === null ? 1 : 0, transition: 'opacity 0.35s ease' }}>
            <text
              x="150"
              y="145"
              textAnchor="middle"
              fontFamily="Fraunces, Georgia, serif"
              fontSize="15"
              fill="rgba(245,236,216,0.85)"
              letterSpacing="4"
            >
              SF
            </text>
            <text
              x="150"
              y="162"
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

          {/* Active Episode Reaction Text (01 / EPISODE, 02 / EPISODE, etc.) */}
          <g style={{ opacity: activeEpisode !== null || expandedEpisode !== null ? 1 : 0, transition: 'opacity 0.35s ease' }}>
            <text
              x="150"
              y="145"
              textAnchor="middle"
              fontFamily="Fraunces, Georgia, serif"
              fontSize="16"
              fontWeight="700"
              fill="#d69a5c"
              letterSpacing="3"
              style={{ filter: 'drop-shadow(0 0 6px rgba(214,154,92,0.5))' }}
            >
              {expandedEpisode !== null
                ? CONSTELLATION_DATA[expandedEpisode].epNumber
                : activeEpisode !== null
                ? CONSTELLATION_DATA[activeEpisode].epNumber
                : '01'}
            </text>
            <text
              x="150"
              y="162"
              textAnchor="middle"
              fontFamily="Manrope, sans-serif"
              fontSize="8"
              fill="rgba(245,236,216,0.9)"
              letterSpacing="3"
              fontWeight="800"
            >
              EPISODE
            </text>
          </g>
        </g>
      </svg>
    </div>
  )
}
