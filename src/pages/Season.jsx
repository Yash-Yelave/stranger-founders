import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import CtaBand from '../components/CtaBand.jsx'
import { episodes, audience } from '../data/content.js'

export default function Season() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Reveal><span className="eyebrow">Season 01 · Creator Founders</span></Reveal>
          <Reveal as="h1" className="display" delay={1}>Creator Founders</Reveal>
          <Reveal as="p" className="lead muted" delay={2}>
            Season 01 gathers creators who have built both an audience and a business — sixteen
            of them, across four episodes, four founders to a fire. Episodes 01 and 02 are
            filmed together on <span className="copper">9 August</span>.
          </Reveal>
          <Reveal className="hero-meta" delay={3} style={{ marginTop: 34 }}>
            <span>16 creator founders</span><span className="dot" />
            <span>4 episodes</span><span className="dot" />
            <span>4 per fire</span>
          </Reveal>
        </div>
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
                    ? <span className="badge"><span className="pulse" /> Filming 9 August</span>
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
          <Reveal className="block-head" style={{ marginBottom: 30 }}>
            <span className="eyebrow">Who’s in the room</span>
            <h2 className="h-md" style={{ marginTop: 18 }}>
              Beyond the creators, the circle draws from every kind of builder.
            </h2>
          </Reveal>
          <Reveal>
            <p className="h-md" style={{ fontFamily: 'var(--serif)', lineHeight: 1.5, color: 'var(--cream-dim)' }}>
              {audience.map((a, i) => (
                <span key={a}>
                  <span style={{ color: 'var(--cream)' }}>{a}</span>
                  {i < audience.length - 1 && <span style={{ color: 'var(--copper)' }}> · </span>}
                </span>
              ))}
            </p>
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
