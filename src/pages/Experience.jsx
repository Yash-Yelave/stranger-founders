import { useRef, useEffect, useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import CtaBand from '../components/CtaBand.jsx'
import { journey } from '../data/content.js'

function ManifestoQuote() {
  const quoteRef = useRef(null)
  const coordsRef = useRef({ x: 0, y: 0 })
  const radiusRef = useRef(0)
  const targetRadiusRef = useRef(0)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const el = quoteRef.current
    if (!el) return

    const update = () => {
      // Lerp radius
      radiusRef.current += (targetRadiusRef.current - radiusRef.current) * 0.08
      
      // Update element styles
      el.style.setProperty('--tx', `${coordsRef.current.x}px`)
      el.style.setProperty('--ty', `${coordsRef.current.y}px`)
      el.style.setProperty('--torch-r', `${radiusRef.current}px`)
      
      // Calculate drop-shadow filter based on current radius ratio
      const glowIntensity = radiusRef.current / 350
      el.style.filter = `drop-shadow(0 0 ${glowIntensity * 20}px rgba(214, 154, 92, ${glowIntensity * 0.7})) drop-shadow(0 0 ${glowIntensity * 40}px rgba(245, 236, 216, ${glowIntensity * 0.45}))`

      animationFrameRef.current = requestAnimationFrame(update)
    }

    animationFrameRef.current = requestAnimationFrame(update)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const handleMouseMove = (e) => {
    const el = quoteRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    coordsRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
    targetRadiusRef.current = 350
  }

  const handleMouseLeave = () => {
    targetRadiusRef.current = 0
  }

  return (
    <p 
      ref={quoteRef}
      className="manifesto-quote"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      "We believe every stranger carries an opportunity. That the best conversations happen away from stages. That a fire, a forest and four honest founders can do what a thousand business cards never will."
    </p>
  )
}

export default function Experience() {
  const journeyRef = useRef(null)
  const stepsRef = useRef([])
  const [activeSteps, setActiveSteps] = useState([])
  const [lineStyles, setLineStyles] = useState({ top: 12, height: 0, bgHeight: 0 })

  const targetProgressRef = useRef(0)
  const currentProgressRef = useRef(0)
  const animFrameRef = useRef(null)

  useEffect(() => {
    const update = () => {
      const diff = targetProgressRef.current - currentProgressRef.current
      currentProgressRef.current += diff * 0.08

      const firstEl = stepsRef.current[0]
      const lastEl = stepsRef.current[stepsRef.current.length - 1]
      if (firstEl && lastEl) {
        const y1 = firstEl.offsetTop + 12
        const y2 = lastEl.offsetTop + 12
        const currentHeight = currentProgressRef.current * (y2 - y1)
        setLineStyles({
          top: y1,
          height: currentHeight,
          bgHeight: y2 - y1
        })
      }

      animFrameRef.current = requestAnimationFrame(update)
    }
    animFrameRef.current = requestAnimationFrame(update)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const firstEl = stepsRef.current[0]
      const lastEl = stepsRef.current[stepsRef.current.length - 1]
      if (!firstEl || !lastEl) return

      const windowHeight = window.innerHeight
      const rectFirst = firstEl.getBoundingClientRect()
      const rectLast = lastEl.getBoundingClientRect()

      const triggerY = windowHeight * 0.65

      const totalDist = rectLast.top - rectFirst.top
      const currentDist = triggerY - rectFirst.top

      let targetProgress = 0
      if (totalDist > 0) {
        targetProgress = Math.min(Math.max(currentDist / totalDist, 0), 1)
      }
      targetProgressRef.current = targetProgress

      // Determine active steps dynamically based on position
      const newActive = journey.map((_, idx) => {
        const stepEl = stepsRef.current[idx]
        if (!stepEl) return false
        const stepRect = stepEl.getBoundingClientRect()
        return stepRect.top < triggerY
      })
      setActiveSteps(newActive)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    const timer = setTimeout(handleScroll, 100)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Reveal><span className="eyebrow">The Experience</span></Reveal>
          <Reveal as="h1" className="display" delay={1}>
            One arc, walked<br />by four strangers.
          </Reveal>
          <Reveal as="p" className="lead muted" delay={2}>
            Nothing here is a session or a slot. Every gathering moves through the same eight
            moments — a deliberate journey from a single invitation to a circle that keeps
            meeting long after the fire goes out.
          </Reveal>
        </div>
      </section>

      {/* Image band */}
      <div className="image-band">
        <img src="/img/poster.png" alt="Stranger Founders Season 01 — the fire in the mountains" style={{ objectPosition: 'center 34%' }} />
        <div className="band-veil" aria-hidden="true" />
        <div className="band-cap container">
          <span className="script" style={{ fontSize: '2rem' }}>You’ve been invited.</span>
        </div>
      </div>

      {/* Journey */}
      <section className="section-pad">
        <div className="container narrow">
          <div className="journey" ref={journeyRef}>
            <span className="journey-line-bg" style={{ top: `${lineStyles.top}px`, height: `${lineStyles.bgHeight}px` }} aria-hidden="true" />
            <span className="journey-line-fill" style={{ top: `${lineStyles.top}px`, height: `${lineStyles.height}px` }} aria-hidden="true" />
            {journey.map((s, i) => (
              <div
                ref={el => stepsRef.current[i] = el}
                className={`jstep ${activeSteps[i] ? 'active' : ''}`}
                key={s.t}
              >
                <span className="node" aria-hidden="true" />
                <span className="st-idx">Movement {String(i + 1).padStart(2, '0')}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="manifesto-section">
        <div className="container manifesto-layout">
          <Reveal className="manifesto-left">
            <span className="eyebrow">The SF</span>
            <span className="eyebrow">Manifesto</span>
          </Reveal>
          <Reveal delay={1} className="manifesto-right">
            <ManifestoQuote />
          </Reveal>
        </div>
      </section>

      {/* What's captured */}
      <section className="section-pad">
        <div className="container">
          <Reveal className="block-head" style={{ marginBottom: 44 }}>
            <span className="eyebrow">What lives on</span>
            <h2 className="h-lg" style={{ marginTop: 20 }}>Real moments, never scripted.</h2>
          </Reveal>
          <div className="pillars">
            {[
              ['I', 'The Full Experience', 'The complete episode — the arc of one gathering, start to finish.'],
              ['II', 'Trailers & Clips', 'The trailer and short films that carry the season across feeds.'],
              ['III', 'Behind the Fire', 'BTS, collaboration posts and quote films from the founders themselves.'],
            ].map(([n, h, p]) => (
              <Reveal className="pillar" key={h}>
                <span className="num">{n}</span>
                <h3>{h}</h3>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Your seat at the fire"
        title={<>The next fire is<br />already being lit.</>}
        sub="Four seats. Curated founders only. Tell us who you are and why you belong at the fire."
      />
    </>
  )
}
