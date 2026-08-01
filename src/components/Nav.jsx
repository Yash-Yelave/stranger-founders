import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'

const links = [
  { to: '/experience', label: 'The Experience' },
  { to: '/season-01', label: 'Season 01' },
  { to: '/partners', label: 'Partners' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header className={`nav ${scrolled || open ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <Logo />
          <nav className="nav-links">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="nav-cta">
            <Link to="/apply" className="btn btn-primary">Request an Invitation</Link>
            <button className={`nav-burger ${open ? 'open' : ''}`} aria-label="Menu"
                    aria-expanded={open} onClick={() => setOpen(v => !v)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to}
            className={({ isActive }) => (isActive ? 'active' : '')}>
            {l.label}
          </NavLink>
        ))}
        <NavLink to="/apply">Apply</NavLink>
        <Link to="/apply" className="btn btn-primary mm-cta">Request an Invitation</Link>
      </div>
    </>
  )
}
