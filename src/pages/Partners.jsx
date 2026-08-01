import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import Faq from '../components/Faq.jsx'
import { tiers, benefits, partnerFaqs } from '../data/content.js'

export default function Partners() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Reveal><span className="eyebrow">Partnerships</span></Reveal>
          <Reveal as="h1" className="display" delay={1}>
            Don’t sponsor an event.<br />Join a movement.
          </Reveal>
          <Reveal as="p" className="lead muted" delay={2}>
            Stranger Founders isn’t another logo on a banner. Partners become part of a
            cinematic world founders genuinely want to be inside — woven into the story, the
            content and the community that keeps meeting long after the season.
          </Reveal>
          <Reveal className="hero-actions" delay={3}>
            <Link to="/apply?type=partner" className="btn btn-primary">Become a Partner <span className="arw">→</span></Link>
          </Reveal>
        </div>
      </section>

      {/* Why partner / benefits */}
      <section className="section-pad-sm" style={{ background: 'var(--forest-925)' }}>
        <div className="container">
          <div className="two-col top">
            <div>
              <Reveal><span className="eyebrow">Why partner</span></Reveal>
              <Reveal as="h2" className="h-lg" delay={1} style={{ marginTop: 20 }}>
                Your brand, inside the story.
              </Reveal>
              <Reveal as="p" className="lead muted" delay={2} style={{ marginTop: 20, maxWidth: '40ch' }}>
                We work with a small number of brands that genuinely belong in a founder’s
                world — and give each of them real presence, not a placement.
              </Reveal>
            </div>
            <div className="benefits">
              {benefits.map((b, i) => (
                <Reveal className="benefit" key={b.t} delay={(i % 3) + 1}>
                  <span className="b-num">{String(i + 1).padStart(2, '0')}</span>
                  <div><h4>{b.t}</h4><p>{b.d}</p></div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="section-pad-sm">
        <div className="container">
          <Reveal className="block-head" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Ways to partner</span>
            <h2 className="h-lg" style={{ marginTop: 20 }}>Find your seat at the fire.</h2>
          </Reveal>
          <div className="tiers">
            {tiers.map((t) => (
              <Reveal className="tier" key={t.n}>
                <span className="t-ix">Partner {t.n}</span>
                <h3>{t.t}</h3>
                <p>{t.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Partner FAQ */}
      <section className="section-pad-sm" style={{ background: 'var(--forest-925)' }}>
        <div className="container narrow">
          <Reveal className="block-head" style={{ marginBottom: 20 }}>
            <span className="eyebrow">Partner questions</span>
            <h2 className="h-md" style={{ marginTop: 18 }}>Before you reach out</h2>
          </Reveal>
          <Faq items={partnerFaqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band section-pad">
        <div className="cta-glow" aria-hidden="true" />
        <div className="container narrow" style={{ textAlign: 'center' }}>
          <Reveal>
            <span className="eyebrow center plain">Let’s build the season together</span>
            <h2 className="display" style={{ margin: '22px 0 20px' }}>Become a Partner</h2>
            <p className="lead muted narrow">
              Tell us about your brand and the team will follow up with the season deck and the
              formats open to you.
            </p>
            <div className="cta-actions">
              <Link to="/apply?type=partner" className="btn btn-primary">Start the Conversation <span className="arw">→</span></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
