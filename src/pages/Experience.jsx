import Reveal from '../components/Reveal.jsx'
import CtaBand from '../components/CtaBand.jsx'
import { journey } from '../data/content.js'

export default function Experience() {
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
          <div className="journey">
            <span className="journey-line" aria-hidden="true" />
            {journey.map((s, i) => (
              <Reveal className="jstep in" key={s.t} delay={(i % 3) + 1}>
                <span className="node" aria-hidden="true" />
                <span className="st-idx">Movement {String(i + 1).padStart(2, '0')}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="section-pad-sm" style={{ background: 'var(--forest-925)' }}>
        <div className="container narrow statement" style={{ textAlign: 'center' }}>
          <Reveal><span className="eyebrow center plain">The SF Manifesto</span></Reveal>
          <Reveal delay={1} style={{ marginTop: 28 }}>
            <p>
              We believe every stranger carries an opportunity. That the best conversations
              happen away from stages. That a fire, a forest and four honest founders can do
              what a thousand business cards never will.
            </p>
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
