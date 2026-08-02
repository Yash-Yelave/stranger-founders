import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import CtaBand from '../components/CtaBand.jsx'
import Faq from '../components/Faq.jsx'
import { episodes, journey } from '../data/content.js'

/* Five most essential questions for a home-page visitor */
const homeFaqs = [
  { q: 'How do I get in?', a: 'By invitation or application. Curated founders are invited directly; others apply and are individually reviewed before an invitation is extended. There is no open sign-up.' },
  { q: 'Is this a networking event?', a: "No. It's an immersive founder experience — no stage, no pitching, no business cards. Only four people, one fire, and real conversations that go somewhere." },
  { q: 'How many founders per gathering?', a: "Four. Small by design — it's the only number where genuine relationships actually form, not just exchanges of details." },
  { q: 'Where does it happen?', a: 'At nature venues across India — forests, farms and mountains, away from stages and noise. Exact locations are shared with confirmed founders only.' },
  { q: 'Can my brand partner with Stranger Founders?', a: 'Yes — selectively. We work only with brands genuinely aligned with founders and creator communities. Start a conversation on the Partners page.' },
]


export default function Home() {
  return (
    <>
      {/* ===================== HERO ===================== */}
      <header className="hero" id="top">
        <div className="hero-scene" aria-hidden="true">
          <svg viewBox="0 0 1600 1100" preserveAspectRatio="xMidYMax slice">
            <defs>
              <linearGradient id="skyHero" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#0b1610"/>
                <stop offset="68%"  stopColor="#122a1c"/>
                <stop offset="88%"  stopColor="#5c3f22"/>
                <stop offset="100%" stopColor="#0b1610"/>
              </linearGradient>
              <radialGradient id="glowHero" cx="50%" cy="97%" r="26%">
                <stop offset="0%"   stopColor="#d69a5c" stopOpacity="0.75"/>
                <stop offset="55%"  stopColor="#8a5527" stopOpacity="0.28"/>
                <stop offset="100%" stopColor="#8a5527" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <rect width="1600" height="1100" fill="url(#skyHero)"/>
            <g opacity="0.65">
              <circle cx="140"  cy="90"  r="1.4" fill="#f5ecd8"/><circle cx="320"  cy="140" r="1"   fill="#f5ecd8"/>
              <circle cx="480"  cy="70"  r="1.3" fill="#f5ecd8"/><circle cx="650"  cy="130" r="1"   fill="#f5ecd8"/>
              <circle cx="820"  cy="60"  r="1.2" fill="#f5ecd8"/><circle cx="980"  cy="140" r="1"   fill="#f5ecd8"/>
              <circle cx="1140" cy="80"  r="1.4" fill="#f5ecd8"/><circle cx="1300" cy="150" r="1"   fill="#f5ecd8"/>
              <circle cx="1460" cy="90"  r="1.2" fill="#f5ecd8"/><circle cx="60"   cy="220" r="1"   fill="#f5ecd8"/>
              <circle cx="200"  cy="180" r="0.9" fill="#f5ecd8"/><circle cx="760"  cy="110" r="1.1" fill="#f5ecd8"/>
              <circle cx="1050" cy="55"  r="1"   fill="#f5ecd8"/><circle cx="1380" cy="200" r="0.8" fill="#f5ecd8"/>
            </g>
            {/* Big ambient glow — fully inside viewBox now */}
            <ellipse cx="800" cy="1060" rx="320" ry="90" fill="url(#glowHero)"/>
            <polygon className="ridge-far"
              points="0,900 120,875 220,895 340,865 450,890 570,860 690,885 810,858 930,888 1050,862 1170,890 1290,865 1410,892 1530,870 1600,888 1600,1100 0,1100"
              fill="#8a5527" opacity="0.25"/>
            <polygon className="ridge-mid"
              points="0,930 130,908 240,925 360,900 470,922 590,895 700,920 820,898 940,924 1060,902 1180,926 1300,905 1420,928 1540,910 1600,922 1600,1100 0,1100"
              fill="#4a3420" opacity="0.5"/>
            {/* Jagged treeline — extended to 1100 bottom */}
            <path d="M0,962 L55,942 L80,962 L125,932 L160,962 L200,938 L235,962 L280,928 L315,962 L360,940 L395,962 L440,922 L475,962 L520,936 L555,962 L600,924 L635,962 L675,938 L710,962 L755,918 L790,962 L835,936 L870,962 L915,924 L950,962 L995,938 L1030,962 L1075,924 L1110,962 L1155,938 L1190,962 L1235,920 L1270,962 L1315,936 L1350,962 L1395,924 L1430,962 L1475,938 L1510,962 L1555,928 L1600,962 L1600,1100 L0,1100 Z"
              fill="#0b1610"/>
            {/* Fire base glow — pushed down for breathing room */}
            <ellipse cx="800" cy="1034" rx="46"  ry="15" fill="#d69a5c" opacity="0.9"/>
            <ellipse cx="800" cy="1034" rx="140" ry="46" fill="#8a5527" opacity="0.22"/>
            {/* Flame */}
            <path className="flame"
              d="M800 982 C 785 1006, 789 1022, 800 1030 C 811 1022, 815 1004, 800 982 Z"
              fill="#f5ecd8" opacity="0.94"/>
            {/* Embers */}
            <circle className="ember ember-1" cx="789" cy="994" r="1.6" fill="#d69a5c"/>
            <circle className="ember ember-2" cx="808" cy="988" r="1.3" fill="#f5ecd8"/>
            <circle className="ember ember-3" cx="796" cy="1000" r="1.4" fill="#d69a5c"/>
            <circle className="ember ember-4" cx="813" cy="996" r="1.2" fill="#f5ecd8"/>
          </svg>
        </div>

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

        <div className="hero-content">
          <Reveal><span className="eyebrow hero-eyebrow">A Founder Experience, Not A Conference</span></Reveal>
          <Reveal as="h1" className="hero-title" delay={1}>STRANGER<br />FOUNDERS</Reveal>
          <Reveal className="hero-tagline script" delay={2}>Meet Strangers. Build Legacies.</Reveal>
          <Reveal className="hero-actions" delay={3}>
            <Link to="/apply"    className="btn btn-primary">Request an Invitation <span className="arw">→</span></Link>
            <Link to="/partners" className="btn btn-ghost">Become a Partner</Link>
          </Reveal>
          <div className="scroll-cue"><span>Scroll</span><span className="line" /></div>
        </div>
      </header>


      {/* ===================== COMPARED TO USUAL FORMATS ===================== */}
      <section className="compared-section">
        <div className="container">
          <Reveal>
            <p className="compared-eyebrow">COMPARED TO THE USUAL FORMATS</p>
          </Reveal>
          <Reveal className="compared-grid" delay={1}>
            {[
              { icon: 'podcast',     label: 'Podcast' },
              { icon: 'conference',  label: 'Conference' },
              { icon: 'networking', label: 'Networking Event' },
              { icon: 'retreat',     label: 'Retreat' },
            ].map(({ icon, label }) => (
              <div className="compared-card" key={label}>
                <div className="compared-icon">
                  {icon === 'podcast'     && <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="22" r="10" stroke="currentColor" strokeWidth="3"/><path d="M20 22c0 6.627 5.373 12 12 12s12-5.373 12-12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><line x1="32" y1="34" x2="32" y2="46" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><line x1="24" y1="46" x2="40" y2="46" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><circle cx="32" cy="22" r="4" fill="currentColor"/></svg>}
                  {icon === 'conference' && <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="10" width="24" height="4" rx="1" fill="currentColor"/><rect x="18" y="14" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="3"/><path d="M32 34 L24 50 M32 34 L40 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><line x1="20" y1="50" x2="44" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><circle cx="32" cy="8" r="4" fill="currentColor"/></svg>}
                  {icon === 'networking'&& <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="3"/><ellipse cx="32" cy="32" rx="8" ry="18" stroke="currentColor" strokeWidth="2"/><line x1="14" y1="32" x2="50" y2="32" stroke="currentColor" strokeWidth="2"/><line x1="16" y1="22" x2="48" y2="22" stroke="currentColor" strokeWidth="2"/><line x1="16" y1="42" x2="48" y2="42" stroke="currentColor" strokeWidth="2"/></svg>}
                  {icon === 'retreat'   && <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="18" r="6" fill="currentColor" opacity="0.8"/><circle cx="42" cy="18" r="6" fill="currentColor" opacity="0.8"/><circle cx="32" cy="12" r="6" fill="currentColor"/><path d="M10 48 C10 36 22 30 32 30 C42 30 54 36 54 48" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M28 10 L32 6 L36 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span className="compared-label">{label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===================== THE STORY ===================== */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <Reveal className="story-copy">
              <span className="story-eyebrow"><span className="story-eyebrow-line" />THE STORY</span>
              <h2 className="story-title">Why Stranger Founders exists</h2>
              <p className="story-unlike">
                Unlike conferences.<br />
                Unlike networking events.<br />
                Unlike podcasts.
              </p>
              <p className="story-body">
                We bring strangers together in forests, farms, mountains and
                nature — away from stages, away from noise, away from business cards.
              </p>
              <p className="story-body">
                Founders participate in challenges. Share stories. Discuss
                business. Learn from each other. Build lifelong relationships.
                Everything is filmed cinematically.
              </p>
              <p className="story-quote">
                "Participants arrive as strangers. They leave as Stranger Founders."
              </p>
            </Reveal>
            <Reveal className="story-visual" delay={1}>
              <div className="story-visual-inner">
                <svg viewBox="0 0 480 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
                  <defs>
                    <linearGradient id="storyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d2218"/>
                      <stop offset="100%" stopColor="#0b1610"/>
                    </linearGradient>
                  </defs>
                  <rect width="480" height="400" fill="url(#storyGrad)"/>
                  <polygon points="0,280 40,250 70,270 110,235 150,265 190,230 230,260 270,228 310,258 350,225 390,255 430,240 480,258 480,400 0,400" fill="#1a3828" opacity="0.7"/>
                  <polygon points="0,310 50,285 90,305 130,272 175,300 215,268 255,295 295,265 335,292 375,260 415,288 455,270 480,282 480,400 0,400" fill="#142e20" opacity="0.9"/>
                  <polygon points="0,340 60,315 100,338 145,308 185,335 225,305 265,332 305,302 345,330 385,300 425,328 465,310 480,322 480,400 0,400" fill="#0b1e14"/>
                  <ellipse cx="240" cy="395" rx="60" ry="18" fill="#d69a5c" opacity="0.35"/>
                  <path d="M240 355 C232 368 234 378 240 382 C246 378 248 367 240 355Z" fill="#f5ecd8" opacity="0.8"/>
                </svg>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================== WHY DIFFERENT ===================== */}
      <section className="diff-section">
        <div className="container diff-inner">
          <Reveal>
            <p className="diff-eyebrow"><span className="diff-eyebrow-line" />WHY DIFFERENT</p>
            <h2 className="diff-title">We traded the familiar for the real</h2>
          </Reveal>
          <Reveal delay={1}>
            <div className="diff-rows">
              {[
                ['Conference Rooms', 'Forests'],
                ['Networking',       'Experiences'],
                ['Speeches',         'Conversations'],
                ['Business Cards',   'Relationships'],
                ['Audiences',        'Communities'],
              ].map(([from, to]) => (
                <div className="diff-row" key={from}>
                  <span className="diff-from">{from}</span>
                  <span className="diff-arrow">→</span>
                  <span className="diff-to">{to}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={2}>
            <p className="diff-footer-label">COMPARED TO THE USUAL FORMATS</p>
          </Reveal>
        </div>
      </section>

      {/* ===================== THE FORMAT (4 rules) — hidden =====================
      <section className="format-section" style={{ background: 'var(--forest-925)' }}>
        <div className="container">
          <Reveal className="format-head">
            <span className="eyebrow">The Rules of the Fire</span>
            <h2 className="h-lg" style={{ marginTop: 18 }}>Nothing like anything you've been to.</h2>
          </Reveal>
          <div className="format-grid-home">
            {[
              { num: '01', h: 'No Audience',  p: 'Only the three others at the fire.' },
              { num: '02', h: 'No Stage',     p: 'Everyone sits at the same height.' },
              { num: '03', h: 'No Pitching',  p: 'Leave the deck at home.' },
              { num: '04', h: 'Only This',    p: 'Real conversations. Captured. Never scripted.' },
            ].map(({ num, h, p }, i) => (
              <Reveal className="format-card-home" key={h} delay={(i % 3) + 1}>
                <span className="fc-num">{num}</span>
                <h3 className="fc-head">{h}</h3>
                <p className="fc-body">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* ===================== THE JOURNEY ARC ===================== */}
      <section className="journey-section" id="experience">
        <div className="container">
          <Reveal className="journey-head">
            <span className="eyebrow">One Night. Six Chapters.</span>
            <h2 className="h-lg" style={{ marginTop: 18 }}>
              The arc of an invitation.
            </h2>
            <p className="lead muted" style={{ marginTop: 14, maxWidth: '50ch' }}>
              From the quiet moment a founder receives their invitation, to the circle
              that meets long after the fire goes out.
            </p>
          </Reveal>

          <div className="arc-grid">
            {journey.map(({ t, d }, i) => (
              <Reveal className="arc-step" key={t} delay={(i % 3) + 1}>
                <span className="arc-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="arc-title">{t}</h3>
                <p className="arc-desc">{d}</p>
              </Reveal>
            ))}
          </div>

          <Reveal style={{ marginTop: 44 }} delay={2}>
            <Link to="/experience" className="text-link">Walk the full journey <span className="arw">→</span></Link>
          </Reveal>
        </div>
      </section>

      {/* ===================== THE GUIDE ===================== */}
      <section className="section-pad" id="guide" style={{ background: 'var(--forest-925)' }}>
        <div className="container">
          <div className="guide-grid">
            <Reveal className="guide-photo">
              <span className="frame-ix">The Guide</span>
              <img src="/img/ram.png" alt="Ram Prayaga, the guide of Stranger Founders" />
            </Reveal>
            <div>
              <Reveal><span className="eyebrow">Not a host — a guide</span></Reveal>
              <Reveal as="h2" className="h-xl" delay={1} style={{ margin: '16px 0 6px' }}>Ram Prayaga</Reveal>
              <Reveal as="p" className="copper" delay={1} style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.15rem' }}>
                Celebrity Finance Advisor · CA · Gold Medalist
              </Reveal>
              <Reveal as="p" className="lead muted" delay={2} style={{ maxWidth: '44ch', marginTop: 22 }}>
                Ram doesn't stand at the front of a room. He sits at the fire — drawing out the
                stories, and turning candid founder talk into insight the others actually use.
              </Reveal>
              <Reveal delay={3} style={{ marginTop: 28 }}>
                <blockquote className="guide-quote">
                  "He isn't the host.<br/>He's the guide who brings strangers together."
                </blockquote>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PULL QUOTE ===================== */}
      <section className="pull-quote-section">
        <div className="container narrow">
          <Reveal>
            <p className="pull-quote">
              "Every founder should dream<br />of receiving an invitation."
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===================== SEASON 01 ===================== */}
      <section className="season-section" id="season" style={{ background: 'var(--forest-925)' }}>
        <div className="container">
          <div className="season-inner">
            <Reveal className="season-copy">
              <span className="eyebrow">Now Happening</span>
              <h2 className="h-lg" style={{ marginTop: 18 }}>
                Season 01<br />
                <em style={{ fontWeight: 400, color: 'var(--copper-light)' }}>Creator Founders</em>
              </h2>
              <p className="lead muted" style={{ marginTop: 16, maxWidth: '38ch' }}>
                16 founders. 4 fires. Episode 01 films on{' '}
                <span className="copper">9 August</span>.
              </p>
              <div style={{ marginTop: 28, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link to="/apply"     className="btn btn-primary">Request an Invitation <span className="arw">→</span></Link>
                <Link to="/season-01" className="btn btn-ghost">Explore Season 01</Link>
              </div>
            </Reveal>
            <div className="season-eps">
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
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="faq-section" id="faq">
        <div className="container">
          <Reveal className="faq-home-head">
            <span className="eyebrow">Questions</span>
            <h2 className="h-lg" style={{ marginTop: 18 }}>Everything you need to know.</h2>
          </Reveal>
          <div className="faq-home-grid">
            <Reveal delay={1}>
              <Faq items={homeFaqs} />
            </Reveal>
            <Reveal className="faq-aside" delay={2}>
              <div className="faq-cta-card">
                <p className="faq-aside-label">Still have questions?</p>
                <p className="faq-aside-sub">
                  We'd rather talk than send another FAQ. Tell us about yourself
                  and we'll follow up personally.
                </p>
                <Link to="/apply" className="btn btn-primary" style={{ marginTop: 26 }}>
                  Request an Invitation <span className="arw">→</span>
                </Link>
                <Link to="/partners" className="text-link" style={{ marginTop: 18 }}>
                  Partner enquiries <span className="arw">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <CtaBand />
    </>
  )
}
