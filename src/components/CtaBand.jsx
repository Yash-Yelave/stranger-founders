import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Seal from './Seal.jsx'
import Reveal from './Reveal.jsx'

function EmberSparksCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationFrameId
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    window.addEventListener('resize', handleResize)

    // Generate 35 subtle ember spark particles
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 0.7 + 0.3,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.2,
      maxOpacity: Math.random() * 0.6 + 0.3,
      fadeSpeed: Math.random() * 0.008 + 0.003,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.03 + 0.01,
      color: Math.random() > 0.35 ? '#d69a5c' : '#f5ecd8'
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach((p) => {
        p.y -= p.speedY
        p.wobble += p.wobbleSpeed
        p.x += Math.sin(p.wobble) * p.speedX

        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
          p.opacity = 0
        }

        if (p.y > height * 0.8) {
          p.opacity = Math.min(p.opacity + p.fadeSpeed, p.maxOpacity)
        } else if (p.y < height * 0.25) {
          p.opacity = Math.max(p.opacity - p.fadeSpeed, 0)
        }

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.shadowColor = '#d69a5c'
        ctx.shadowBlur = p.size * 3
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="ember-sparks-canvas" aria-hidden="true" />
}

export default function CtaBand({
  eyebrow = 'The Invitation',
  title = <>Meet Strangers.<br />Build Legacies.</>,
  sub = 'Only invited founders join the circle. If the fire is calling, tell us who you are.',
  showSeal = true,
}) {
  return (
    <section className="cta-band section-pad">
      <div className="cta-flame-aura" aria-hidden="true" />
      <EmberSparksCanvas />
      <div className="container narrow" style={{ textAlign: 'center' }}>
        <Reveal>
          {showSeal && <div className="seal"><Seal size={120} /></div>}
          <span className="eyebrow center plain">{eyebrow}</span>
          <h2 className="display" style={{ margin: '22px 0 20px' }}>{title}</h2>
          <p className="lead muted narrow">{sub}</p>
          <div className="cta-actions">
            <Link to="/apply" className="btn btn-primary">Request an Invitation <span className="arw">→</span></Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
