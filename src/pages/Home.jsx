import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import CtaBand from '../components/CtaBand.jsx'
import Faq from '../components/Faq.jsx'
import { trades, audience, episodes, founderFaqs, partnerFaqs } from '../data/content.js'

export default function Home() {
  return (
    <>
      {/* ===================== HERO ===================== */}
      <header className="hero">
        <div className="hero-bg">
          <img src="/img/campfire.png" alt="Four Stranger Founders chairs around a fire at sunset in the mountains" />
        </div>
        <div className="hero-veil" aria-hidden="true" />

        <svg className="hero-stamp" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="94" fill="none" stroke="var(--cream)" strokeWidth="2" opacity="0.7" />
          <circle cx="100" cy="100" r="82" fill="none" stroke="var(--cream)" strokeWidth="1" opacity="0.4" />
          <path id="arcTop" d="M 30 100 A 70 70 0 0 1 170 100" fill="none" />
          <path id="arcBot" d="M 170 100 A 70 70 0 0 1 30 100" fill="none" />
          <text fill="var(--cream)" fontSize="15" letterSpacing="3" fontWeight="600">
            <textPath href="#arcTop" startOffset="8%">YOU&apos;VE  BEEN</textPath>
          </text>
          <text fill="var(--cream)" fontSize="15" letterSpacing="3" fontWeight="600">
            <textPath href="#arcBot" startOffset="12%">INVITED</textPath>
          </text>
          <path d="M100 78 l7 16 -5 0 5 12 -5 0 5 12 -14 0 5 -12 -5 0 5 -12 -5 0 z" fill="var(--cream)" opacity="0.85" />
        </svg>

        <div className="container hero-inner">
          <Reveal><span className="eyebrow plain">Season 01 · Creator Founders</span></Reveal>
          <Reveal as="h1" className="display" delay={1}>
            Meet Strangers.<br />Build Legacies.
          </Reveal>
          <Reveal as="p" className="lead" delay={2}>
            An invite-only founder experience. Four creators who have never met gather
            around a fire in the wild — no stage, no audience, no pitching. They arrive as
            strangers and leave as Stranger Founders.
          </Reveal>
          <Reveal className="hero-actions" delay={3}>
            <Link to="/apply" className="btn btn-primary">Request an Invitation <span className="arw">→</span></Link>
            <Link to="/partners" className="btn btn-ghost">Become a Partner</Link>
          </Reveal>
          <Reveal className="hero-meta" delay={4}>
            <span>Invite-only</span><span className="dot" />
            <span>4 founders per fire</span><span className="dot" />
            <span>Nature venues · India</span><span className="dot" />
            <span>Powered by FinanceBox</span>
          </Reveal>
        </div>

        <div className="scroll-cue"><span>Scroll</span><span className="line" /></div>
      </header>

      {/* ===================== WHY IT EXISTS ===================== */}
      <section className="section-pad" id="why">
        <div className="container">
          <div className="two-col">
            <div>
              <Reveal><span className="eyebrow">The Story</span></Reveal>
              <Reveal as="h2" className="h-xl" delay={1} style={{ marginTop: 22 }}>
                Why Stranger Founders exists
              </Reveal>
            </div>
            <div className="statement">
              <Reveal delay={1}>
                <p>
                  Most events introduce you to <span className="strike">people</span>.
                </p>
                <p>
                  We introduce you to the <span className="em">version of yourself</span> you
                  haven’t met yet.
                </p>
                <p style={{ marginTop: '1.1em' }} className="lead muted">
                  So we trade conference halls for forests, speeches for conversations, and
                  business cards for relationships. Founders arrive as strangers. They leave
                  as Stranger Founders.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== WHAT IS IT ===================== */}
      <section className="section-pad-sm" style={{ background: 'var(--forest-925)' }}>
        <div className="container">
          <Reveal className="block-head">
            <span className="eyebrow">What it is</span>
            <h2 className="h-lg" style={{ marginTop: 20 }}>
              Four founders. One fire. One night that rewrites their network.
            </h2>
          </Reveal>

          <div className="def-list" style={{ marginTop: 44 }}>
            {[
              ['No audience', 'There is no crowd to perform for — only the three others at the fire.'],
              ['No stage', 'Nobody speaks down to the room. Everyone sits at the same height.'],
              ['No pitching', 'Leave the deck at home. This is about the founder, not the funding round.'],
              ['Only this', 'Conversations, challenges, collaboration and genuine friendship — captured, never scripted.'],
            ].map(([h, p], i) => (
              <Reveal className="def-row" key={h} delay={(i % 3) + 1}>
                <h3>{h}</h3>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== QUOTE ===================== */}
      <section className="section-pad">
        <div className="container narrow" style={{ textAlign: 'center' }}>
          <Reveal>
            <p className="kicker-quote">
              “Participants arrive as strangers.<br />They leave as
              <span className="copper"> Stranger Founders.</span>”
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===================== WHY DIFFERENT (trade list) ===================== */}
      <section className="section-pad-sm" style={{ background: 'var(--forest-925)' }}>
        <div className="container">
          <div className="two-col top">
            <div>
              <Reveal><span className="eyebrow">Why we’re different</span></Reveal>
              <Reveal as="h2" className="h-lg" delay={1} style={{ marginTop: 20 }}>
                We traded the familiar for the real.
              </Reveal>
              <Reveal as="p" className="lead muted" delay={2} style={{ marginTop: 20, maxWidth: '42ch' }}>
                Every choice is a deliberate trade — away from the formats that make founders
                feel like an audience, toward the ones that make them feel known.
              </Reveal>
            </div>
            <div>
              <div className="trade">
                {trades.map(([from, to], i) => (
                  <Reveal className="trade-row" key={from} delay={(i % 3) + 1}>
                    <span className="from">{from}</span>
                    <span className="arw">→</span>
                    <span className="to">{to}</span>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== THE GUIDE ===================== */}
      <section className="section-pad" id="guide">
        <div className="container">
          <div className="guide-grid">
            <Reveal className="guide-photo">
              <span className="frame-ix">The Guide</span>
              <img src="/img/ram.png" alt="Ram Prayaga, the guide of Stranger Founders" />
            </Reveal>
            <div>
              <Reveal><span className="eyebrow">Not a host — a guide</span></Reveal>
              <Reveal as="h2" className="h-xl" delay={1} style={{ margin: '18px 0 8px' }}>
                Ram Prayaga
              </Reveal>
              <Reveal as="p" className="copper" delay={1} style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.2rem' }}>
                Celebrity Finance Advisor
              </Reveal>
              <Reveal className="guide-cred" delay={2}>
                <span className="cred-chip">Chartered Accountant</span>
                <span className="cred-chip">Gold Medalist</span>
                <span className="cred-chip">Founder — FinanceBox</span>
                <span className="cred-chip">Founder — PropertyBox</span>
              </Reveal>
              <Reveal as="p" className="lead muted" delay={2} style={{ maxWidth: '48ch' }}>
                Ram doesn’t stand at the front of a room. He sits at the fire — guiding the
                conversations, drawing out the stories, and turning candid founder talk into
                practical business and financial insight the others actually use.
              </Reveal>
              <Reveal delay={3} style={{ marginTop: 26 }}>
                <p className="kicker-quote" style={{ fontSize: '1.4rem' }}>
                  “He isn’t the host. He’s the guide who brings strangers together.”
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== EXPERIENCE TEASER ===================== */}
      <section className="section-pad-sm" style={{ background: 'var(--forest-925)' }}>
        <div className="container">
          <div className="two-col top">
            <div>
              <Reveal><span className="eyebrow">The Experience</span></Reveal>
              <Reveal as="h2" className="h-lg" delay={1} style={{ marginTop: 20 }}>
                From a single invitation to a lifelong circle.
              </Reveal>
              <Reveal as="p" className="lead muted" delay={2} style={{ marginTop: 20, maxWidth: '44ch' }}>
                Every gathering follows the same arc — invitation, arrival, first fire,
                challenges, real conversations, campfire stories, collaborations, and the
                circle that keeps meeting after.
              </Reveal>
              <Reveal delay={3} style={{ marginTop: 30 }}>
                <Link to="/experience" className="text-link">Walk the full journey <span className="arw">→</span></Link>
              </Reveal>
            </div>
            <Reveal delay={2}>
              <ol className="teaser-arc">
                {['The Invitation','The Arrival','First Fire','Founder Challenges','The Conversations','Campfire Stories','Collaborations','The Circle'].map((s, i) => (
                  <li key={s} style={{
                    display: 'flex', gap: 16, alignItems: 'baseline',
                    padding: '13px 0', borderBottom: '1px solid var(--forest-line-soft)'
                  }}>
                    <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--copper)', fontSize: 13, width: 26 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem' }}>{s}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================== SEASON 01 ===================== */}
      <section className="section-pad" id="season">
        <div className="container">
          <div className="two-col top">
            <div>
              <Reveal><span className="eyebrow">Season 01 · Creator Founders</span></Reveal>
              <Reveal as="h2" className="h-lg" delay={1} style={{ marginTop: 20 }}>
                Four episodes. Four founders. One fire.
              </Reveal>
              <Reveal as="p" className="lead muted" delay={2} style={{ marginTop: 20, maxWidth: '44ch' }}>
                Season 01 gathers creator founders who have built both an audience and a
                business. Sixteen founders across four fires — Episode 01 films on{' '}
                <span className="copper">9 August</span>.
              </Reveal>
              <Reveal delay={3} style={{ marginTop: 28 }}>
                <Link to="/season-01" className="text-link">Explore Season 01 <span className="arw">→</span></Link>
              </Reveal>
            </div>
            <div>
              <div className="ep-list">
                {episodes.map((e) => (
                  <Reveal className={`ep-row ${e.status === 'filming' ? 'live' : ''}`} key={e.n}>
                    <span className="ep-num">{e.n}</span>
                    <div>
                      <h3>{e.title}</h3>
                      {e.status === 'filming'
                        ? <span className="badge"><span className="pulse" /> Filming 9 August</span>
                        : <span className="badge soon">Coming this season</span>}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== WHO IS THIS FOR ===================== */}
      <section className="section-pad">
        <div className="container">
          <Reveal className="block-head" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Who’s in the room</span>
            <h2 className="h-lg" style={{ marginTop: 20 }}>Built for people who build.</h2>
          </Reveal>
          <div className="who-grid">
            {audience.map((a, i) => (
              <Reveal className="who-cell" key={a} delay={(i % 3) + 1}>
                <span className="tick">✓</span><span>{a}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== COMMUNITY ===================== */}
      <section className="section-pad-sm" style={{ background: 'var(--forest-925)' }}>
        <div className="container">
          <Reveal className="block-head" style={{ marginBottom: 44 }}>
            <span className="eyebrow">The Community</span>
            <h2 className="h-xl" style={{ marginTop: 20 }}>The Stranger Founders Circle</h2>
          </Reveal>
          <div className="trio">
            {[
              ['Belonging', 'A circle where founders are finally understood — not networked, known.'],
              ['Legacy', 'Relationships built to outlast the season, and the businesses that follow.'],
              ['Movement', 'India’s most aspirational founder community — one invitation at a time.'],
            ].map(([h, p], i) => (
              <Reveal className="trio-item" key={h} delay={i + 1}>
                <h3>{h}</h3><p>{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 52, textAlign: 'center' }}>
            <p className="kicker-quote" style={{ fontSize: '1.35rem' }}>
              Every founder should dream of receiving an invitation.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===================== BRAND PARTNERSHIP ===================== */}
      <section className="section-pad" id="partner-teaser">
        <div className="container">
          <div className="two-col top">
            <div>
              <Reveal><span className="eyebrow">For Brands</span></Reveal>
              <Reveal as="h2" className="h-lg" delay={1} style={{ marginTop: 20 }}>
                Why partner with Stranger Founders?
              </Reveal>
              <Reveal as="p" className="lead muted" delay={2} style={{ marginTop: 20, maxWidth: '44ch' }}>
                Your brand isn't sponsoring another event. You're becoming part of a
                founder movement — woven into the story, the content and the community
                that keeps meeting long after the season.
              </Reveal>
              <Reveal delay={3} style={{ marginTop: 30 }}>
                <Link to="/partners" className="btn btn-ghost">Become a Partner <span className="arw">→</span></Link>
              </Reveal>
            </div>
            <div className="benefits" style={{ gridTemplateColumns: '1fr', gap: 0 }}>
              {[
                ['Founder Audience', 'Direct presence with vetted founders and creators — not a hall of cold contacts.'],
                ['Creator Reach', 'Amplification across the combined audiences of every creator in the season.'],
                ['Authentic Content', 'Weeks of trailers, clips and BTS your brand is genuinely woven into.'],
                ['Premium Positioning', 'A cinematic, editorial world your brand sits inside — never a banner on a wall.'],
                ['Long-term Visibility', 'The SF Circle keeps meeting. Partners stay part of a community, not a single date.'],
              ].map(([t, d], i) => (
                <Reveal className="benefit" key={t} delay={(i % 3) + 1}>
                  <span className="b-num">{String(i + 1).padStart(2, '0')}</span>
                  <div><h4>{t}</h4><p>{d}</p></div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FAQs ===================== */}
      <section className="section-pad-sm" style={{ background: 'var(--forest-925)' }} id="faq">
        <div className="container">
          <Reveal className="block-head" style={{ marginBottom: 48 }}>
            <span className="eyebrow">Questions</span>
            <h2 className="h-lg" style={{ marginTop: 20 }}>Everything you need to know.</h2>
          </Reveal>
          <div className="two-col top" style={{ alignItems: 'flex-start', gap: 60 }}>
            <div>
              <Reveal>
                <h3 style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.35rem', color: 'var(--copper)', marginBottom: 28 }}>For Founders</h3>
              </Reveal>
              <Faq items={founderFaqs} />
              <Reveal style={{ marginTop: 28 }}>
                <Link to="/apply" className="text-link">Request an invitation <span className="arw">→</span></Link>
              </Reveal>
            </div>
            <div>
              <Reveal>
                <h3 style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.35rem', color: 'var(--copper)', marginBottom: 28 }}>For Partners</h3>
              </Reveal>
              <Faq items={partnerFaqs} />
              <Reveal style={{ marginTop: 28 }}>
                <Link to="/partners" className="text-link">Partner with us <span className="arw">→</span></Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <CtaBand />
    </>
  )
}
