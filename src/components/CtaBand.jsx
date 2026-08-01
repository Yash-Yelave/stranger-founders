import { Link } from 'react-router-dom'
import Seal from './Seal.jsx'
import Reveal from './Reveal.jsx'

export default function CtaBand({
  eyebrow = 'The Invitation',
  title = <>Meet Strangers.<br />Build Legacies.</>,
  sub = 'Only invited founders join the circle. If the fire is calling, tell us who you are.',
  showSeal = true,
}) {
  return (
    <section className="cta-band section-pad">
      <div className="cta-glow" aria-hidden="true" />
      <div className="container narrow" style={{ textAlign: 'center' }}>
        <Reveal>
          {showSeal && <div className="seal"><Seal size={120} /></div>}
          <span className="eyebrow center plain">{eyebrow}</span>
          <h2 className="display" style={{ margin: '22px 0 20px' }}>{title}</h2>
          <p className="lead muted narrow">{sub}</p>
          <div className="cta-actions">
            <Link to="/apply" className="btn btn-primary">Request an Invitation <span className="arw">→</span></Link>
            <Link to="/partners" className="btn btn-ghost">Become a Partner</Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
