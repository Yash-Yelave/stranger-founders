import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import Faq from '../components/Faq.jsx'
import Seal from '../components/Seal.jsx'
import { founderFaqs } from '../data/content.js'

export default function Apply() {
  const [params] = useSearchParams()
  const initial = params.get('type') === 'partner' ? 'partner' : 'founder'
  const [mode, setMode] = useState(initial)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // No backend wired yet — capture intent and confirm. Hook to email / CRM on launch.
    setSent(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <section className="page-hero">
        <div className="container narrow">
          <Reveal><span className="eyebrow">You’ve been invited to apply</span></Reveal>
          <Reveal as="h1" className="display" delay={1}>
            {mode === 'partner' ? 'Partner with us.' : 'Request an invitation.'}
          </Reveal>
          <Reveal as="p" className="lead muted" delay={2}>
            {mode === 'partner'
              ? 'Tell us about your brand. We work with a small number of aligned partners each season and will follow up personally.'
              : 'Every founder in the room is curated. Tell us who you are — if it’s a fit, an invitation follows. You can also nominate a founder who belongs at the fire.'}
          </Reveal>

          {!sent && (
            <Reveal className="apply-toggle" delay={3} style={{ display: 'flex', gap: 10, marginTop: 30 }}>
              <button className={`btn ${mode === 'founder' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setMode('founder')} type="button">I’m a founder</button>
              <button className={`btn ${mode === 'partner' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setMode('partner')} type="button">I’m a brand</button>
            </Reveal>
          )}
        </div>
      </section>

      <section className="section-pad-sm" style={{ paddingTop: 8 }}>
        <div className="container narrow">
          {sent ? (
            <Reveal className="form-success">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                <Seal size={104} />
              </div>
              <h3>Your request is in.</h3>
              <p className="lead muted" style={{ maxWidth: '46ch', margin: '0 auto' }}>
                {mode === 'partner'
                  ? 'Thank you — the team will reach out with the season deck and available formats.'
                  : 'Thank you. Every request is read by the team. If there’s a seat with your name on it, you’ll hear from us.'}
              </p>
              <p className="script" style={{ fontSize: '1.6rem', marginTop: 22 }}>See you with the next strangers.</p>
            </Reveal>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="name">Full name</label>
                  <input id="name" name="name" required placeholder="Your name" />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required placeholder="you@company.com" />
                </div>

                {mode === 'founder' ? (
                  <>
                    <div className="field">
                      <label htmlFor="company">Company / handle</label>
                      <input id="company" name="company" placeholder="What you build / @handle" />
                    </div>
                    <div className="field">
                      <label htmlFor="role">You are</label>
                      <select id="role" name="role" defaultValue="">
                        <option value="" disabled>Select one</option>
                        <option>Creator Founder</option>
                        <option>Startup Founder</option>
                        <option>Business Owner</option>
                        <option>Investor</option>
                        <option>Brand / Community Leader</option>
                        <option>Nominating someone else</option>
                      </select>
                    </div>
                    <div className="field full">
                      <label htmlFor="story">Why the fire? (or who are you nominating?)</label>
                      <textarea id="story" name="story" placeholder="Tell us your story, what you’re building, or the founder you want to nominate." />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="field">
                      <label htmlFor="brand">Brand</label>
                      <input id="brand" name="brand" required placeholder="Brand name" />
                    </div>
                    <div className="field">
                      <label htmlFor="ptype">Partnership interest</label>
                      <select id="ptype" name="ptype" defaultValue="">
                        <option value="" disabled>Select one</option>
                        <option>Experience Partner</option>
                        <option>Venue Partner</option>
                        <option>Gifting Partner</option>
                        <option>Production Partner</option>
                        <option>Knowledge Partner</option>
                        <option>Media Partner</option>
                        <option>Not sure yet</option>
                      </select>
                    </div>
                    <div className="field full">
                      <label htmlFor="goals">What are you hoping to build?</label>
                      <textarea id="goals" name="goals" placeholder="Tell us about your brand and what a partnership would look like for you." />
                    </div>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 26, flexWrap: 'wrap' }}>
                <button type="submit" className="btn btn-primary">
                  {mode === 'partner' ? 'Send partnership request' : 'Send my request'} <span className="arw">→</span>
                </button>
                <p className="form-note">Invite-only. We read every message and reply personally.</p>
              </div>
            </form>
          )}
        </div>
      </section>

      {mode === 'founder' && !sent && (
        <section className="section-pad-sm" style={{ background: 'var(--forest-925)' }}>
          <div className="container narrow">
            <Reveal className="block-head" style={{ marginBottom: 20 }}>
              <span className="eyebrow">Founder questions</span>
              <h2 className="h-md" style={{ marginTop: 18 }}>Before you apply</h2>
            </Reveal>
            <Faq items={founderFaqs} />
          </div>
        </section>
      )}
    </>
  )
}
