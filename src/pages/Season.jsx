import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import CtaBand from '../components/CtaBand.jsx'
import FounderConstellation from '../components/FounderConstellation.jsx'
import { episodes, audience } from '../data/content.js'

/* ── Animated stat number ─────────────────────────────────────── */
function AnimatedStat({ target, label, suffix = '', onMouseEnter, onMouseLeave }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1400
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1)
          // ease-out cubic
          const ease = 1 - Math.pow(1 - p, 3)
          setCount(Math.round(ease * target))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return (
    <div
      className="s1-stat"
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="s1-stat-num">{count}{suffix}</span>
      <span className="s1-stat-label">{label}</span>
    </div>
  )
}

/* ── Countdown to 30 August 2025 ────────────────────────────────── */
function Countdown() {
  const target = new Date('2025-08-30T06:00:00+05:30').getTime()
  const [diff, setDiff] = useState(target - Date.now())

  useEffect(() => {
    const id = setInterval(() => setDiff(target - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])

  if (diff <= 0) return (
    <div className="s1-countdown">
      <span className="s1-countdown-live">LIVE — Filming Now</span>
    </div>
  )

  const days = Math.floor(diff / 86400000)
  const hrs  = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div className="s1-countdown">
      <span className="s1-countdown-label">Episodes 01 &amp; 02 film in</span>
      <div className="s1-countdown-digits">
        <span className="s1-cd-unit"><b>{days}</b><small>d</small></span>
        <span className="s1-cd-sep">:</span>
        <span className="s1-cd-unit"><b>{pad(hrs)}</b><small>h</small></span>
        <span className="s1-cd-sep">:</span>
        <span className="s1-cd-unit"><b>{pad(mins)}</b><small>m</small></span>
        <span className="s1-cd-sep">:</span>
        <span className="s1-cd-unit"><b>{pad(secs)}</b><small>s</small></span>
      </div>
    </div>
  )
}

/* ── Floating embers ────────────────────────────────────────────── */
const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${(i * 41 + 11) % 94}%`,
  size: `${(i % 3) * 1.5 + 2}px`,
  delay: `${(i % 7) * 0.65}s`,
  duration: `${4 + (i % 4) * 1.2}s`,
}))

export default function Season() {
  const [hoveredStat, setHoveredStat] = useState(null)

  return (
    <>
      {/* ── SEASON HERO ─────────────────────────────────────────── */}
      <section className="s1-hero">
        {/* Floating ember particles */}
        <div className="s1-embers" aria-hidden="true">
          {EMBERS.map(e => (
            <span key={e.id} className="s1-ember" style={{
              left: e.left,
              width: e.size,
              height: e.size,
              animationDelay: e.delay,
              animationDuration: e.duration,
            }} />
          ))}
        </div>

        {/* Top arc ornament */}
        <div className="s1-arc-ornament" aria-hidden="true">
          <svg viewBox="0 0 800 80" preserveAspectRatio="xMidYMid meet">
            <path d="M 0 80 Q 400 0 800 80" fill="none" stroke="rgba(214,154,92,0.18)" strokeWidth="1" />
            <path d="M 40 80 Q 400 12 760 80" fill="none" stroke="rgba(214,154,92,0.10)" strokeWidth="1" />
          </svg>
        </div>

        <div className="container">
          <div className="s1-hero-inner">
            {/* Left: text */}
            <div className="s1-hero-text">
              <Reveal>
                <span className="eyebrow">Season 01 · Creator Founders</span>
              </Reveal>

              <Reveal as="h1" className="s1-hero-title" delay={1}>
                Creator<br />Founders
              </Reveal>

              <Reveal as="p" className="s1-hero-lead" delay={2}>
                Season 01 gathers creators who have built both an audience and a business —
                sixteen of them, across four episodes, four founders to a fire.
              </Reveal>

              <Reveal delay={3}>
                <Countdown />
              </Reveal>

              <Reveal className="s1-hero-actions" delay={4}>
                <Link to="/apply" className="btn btn-primary">Request a Seat <span className="arw">→</span></Link>
                <Link to="#episodes" className="text-link" style={{ fontSize: 13 }}>See episodes</Link>
              </Reveal>
            </div>

            {/* Right: animated interactive constellation */}
            <div className="s1-hero-visual">
              {/* Interactive Founder Constellation Graphic */}
              <FounderConstellation activeStat={hoveredStat} />

              {/* 3 animated stats around the ring */}
              <div className="s1-stats-orbit">
                <AnimatedStat
                  target={16}
                  label="Creator Founders"
                  onMouseEnter={() => setHoveredStat('founders')}
                  onMouseLeave={() => setHoveredStat(null)}
                />
                <AnimatedStat
                  target={4}
                  label="Episodes"
                  onMouseEnter={() => setHoveredStat('episodes')}
                  onMouseLeave={() => setHoveredStat(null)}
                />
                <AnimatedStat
                  target={4}
                  label="Per Episode"
                  onMouseEnter={() => setHoveredStat('per_episode')}
                  onMouseLeave={() => setHoveredStat(null)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="s1-hero-fade" aria-hidden="true" />
      </section>


      {/* Episodes */}
      <section className="section-pad-sm">
        <div className="container">
          <Reveal className="block-head" style={{ marginBottom: 20 }}>
            <span className="eyebrow">The Episodes</span>
            <h2 className="h-lg" style={{ marginTop: 20 }}>
              Four episodes. Four founders. One fire to gather around.
            </h2>
          </Reveal>
          <div className="ep-list">
            {episodes.map((e) => (
              <Reveal className={`ep-row ${e.status === 'filming' ? 'live' : ''}`} key={e.n}>
                <span className="ep-num">{e.n}</span>
                <div>
                  <h3>{e.title}</h3>
                  <p>{e.d}</p>
                  {e.status === 'filming'
                    ? <span className="badge"><span className="pulse" /> Filming {e.date || '30 August'}</span>
                    : <span className="badge soon">Coming this season</span>}
                </div>
                <div className="ep-cta">
                  {e.status === 'filming' &&
                    <Link to="/apply" className="text-link" style={{ fontSize: 13 }}>Nominate <span className="arw">→</span></Link>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The four seats */}
      <section className="section-pad-sm" style={{ background: 'var(--forest-925)' }}>
        <div className="container">
          <Reveal className="block-head" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Episode 01</span>
            <h2 className="h-lg" style={{ marginTop: 20 }}>Four seats. Filling now.</h2>
            <p className="lead muted" style={{ marginTop: 18, maxWidth: '52ch' }}>
              Creator founders are curated and confirmed ahead of the shoot. Names are revealed
              as each fire is set.
            </p>
          </Reveal>
          <div className="seats">
            {[1, 2, 3, 4].map((n) => (
              <Reveal className="seat" key={n} delay={(n - 1) % 3 + 1}>
                <span className="seat-mark">SF</span>
                <div>
                  <span className="seat-label">To be revealed</span>
                  <span className="seat-sub">Creator Founder · 50K–500K</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who's in the room */}
      <section className="section-pad-sm">
        <div className="container">
          <Reveal className="block-head" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Who's in the room</span>
            <h2 className="h-md" style={{ marginTop: 18 }}>
              Beyond the creators, the circle draws from every kind of builder.
            </h2>
          </Reveal>
          <Reveal>
            <div className="who-grid">
              {audience.map((a) => (
                <div className="who-cell" key={a}>
                  <span className="tick">✦</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        eyebrow="Season 01 begins soon"
        title={<>See you around<br />the fire.</>}
        sub="Want a seat, or know a creator who belongs at one? Apply or nominate below."
      />
    </>
  )
}
