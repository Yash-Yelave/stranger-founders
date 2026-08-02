import { useEffect } from 'react'

/**
 * Mounts once and wires up all interactive behaviour for the site:
 * nav scroll state, scroll progress bar, hero parallax, back-to-top,
 * mobile menu, scroll-reveal, cursor glow, magnetic buttons,
 * guide portrait tilt, hero ember trail.
 *
 * Renders nothing itself — attaches behaviour to elements matched by
 * id / className already in the DOM.
 */
export default function SiteEffects() {
  useEffect(() => {
    const progressBar = document.getElementById('scrollProgress')
    const backToTop   = document.getElementById('backToTop')
    const ridgeFar    = document.querySelector('.ridge-far')
    const ridgeMid    = document.querySelector('.ridge-mid')
    const docEl       = document.documentElement

    // ---------- combined scroll handler ----------
    function onScroll() {
      const y   = window.scrollY
      const max = docEl.scrollHeight - window.innerHeight
      if (progressBar) progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%'
      if (backToTop)   backToTop.classList.toggle('show', y > 700)

      // hero SVG parallax
      if (y < window.innerHeight) {
        if (ridgeFar) ridgeFar.style.transform = `translateY(${y * 0.12}px)`
        if (ridgeMid) ridgeMid.style.transform = `translateY(${y * 0.22}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    if (backToTop) {
      backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))
    }

    // ---------- fine-pointer-only interactions (skip on touch) ----------
    const hasFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches
    let cleanupFine = () => {}

    if (hasFinePointer) {
      const glow = document.getElementById('cursorGlow')
      let gx = 0, gy = 0, tx = 0, ty = 0, rafId = null

      function handleMouseMove(e) { tx = e.clientX; ty = e.clientY; if (glow) glow.classList.add('active') }
      function handleMouseLeaveDoc() { if (glow) glow.classList.remove('active') }
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
      document.addEventListener('mouseleave', handleMouseLeaveDoc)

      function easeCursor() {
        gx += (tx - gx) * 0.18
        gy += (ty - gy) * 0.18
        if (glow) glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%,-50%)`
        rafId = requestAnimationFrame(easeCursor)
      }
      easeCursor()

      const hoverTargets = 'a, button, .seat, .who-cell, .tier, input, select, textarea'
      function handleMouseOver(e) { if (e.target.closest(hoverTargets)) glow && glow.classList.add('hover-target') }
      function handleMouseOut(e)  { if (e.target.closest(hoverTargets)) glow && glow.classList.remove('hover-target') }
      document.addEventListener('mouseover', handleMouseOver)
      document.addEventListener('mouseout',  handleMouseOut)

      // magnetic buttons
      const btnHandlers = Array.from(document.querySelectorAll('.btn')).map((btn) => {
        function move(e) {
          const r  = btn.getBoundingClientRect()
          const mx = e.clientX - (r.left + r.width  / 2)
          const my = e.clientY - (r.top  + r.height / 2)
          btn.style.transform = `translate(${mx * 0.22}px, ${my * 0.28}px)`
        }
        function leave() { btn.style.transform = '' }
        btn.addEventListener('mousemove',  move)
        btn.addEventListener('mouseleave', leave)
        return { btn, move, leave }
      })

      // guide portrait tilt
      const guidePhoto = document.querySelector('.guide-photo')
      function guideMove(e) {
        const r  = guidePhoto.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width  - 0.5
        const py = (e.clientY - r.top)  / r.height - 0.5
        guidePhoto.style.transform = `perspective(700px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) scale(1.02)`
      }
      function guideLeave() { guidePhoto.style.transform = '' }
      if (guidePhoto) {
        guidePhoto.addEventListener('mousemove',  guideMove)
        guidePhoto.addEventListener('mouseleave', guideLeave)
      }

      // ember trail inside hero
      const heroEl = document.querySelector('.hero')
      let lastEmber = 0
      function emberMove(e) {
        const now = Date.now()
        if (now - lastEmber < 70) return
        lastEmber = now
        const ember = document.createElement('span')
        ember.className = 'ember-trail'
        const size = 2 + Math.random() * 3
        ember.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX}px;top:${e.clientY}px;opacity:0.7`
        document.body.appendChild(ember)
        const drift = (Math.random() - 0.5) * 40
        ember.animate(
          [
            { transform: 'translate(0,0)',                                           opacity: 0.75 },
            { transform: `translate(${drift}px,-${40 + Math.random() * 30}px)`,     opacity: 0    },
          ],
          { duration: 900 + Math.random() * 400, easing: 'ease-out' }
        ).onfinish = () => ember.remove()
      }
      if (heroEl) heroEl.addEventListener('mousemove', emberMove, { passive: true })

      cleanupFine = () => {
        window.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseleave', handleMouseLeaveDoc)
        document.removeEventListener('mouseover',  handleMouseOver)
        document.removeEventListener('mouseout',   handleMouseOut)
        btnHandlers.forEach(({ btn, move, leave }) => {
          btn.removeEventListener('mousemove',  move)
          btn.removeEventListener('mouseleave', leave)
        })
        if (guidePhoto) {
          guidePhoto.removeEventListener('mousemove',  guideMove)
          guidePhoto.removeEventListener('mouseleave', guideLeave)
        }
        if (heroEl) heroEl.removeEventListener('mousemove', emberMove)
        if (rafId) cancelAnimationFrame(rafId)
      }
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      cleanupFine()
    }
  }, [])

  return null
}
