import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import CtaBand from '../components/CtaBand.jsx'
import Faq from '../components/Faq.jsx'
import { episodes, journey } from '../data/content.js'
import { TbUsers, TbMountain, TbMessages, TbWalk, TbMicrophone, TbBuildingSkyscraper, TbUsersGroup, TbTent } from 'react-icons/tb'
import { PiHandshakeThin } from 'react-icons/pi'
import { GiPartyPopper } from 'react-icons/gi'

/* Five most essential questions for a home-page visitor */
const homeFaqs = [
  { q: 'How do I get in?', a: 'By invitation or application. Curated founders are invited directly; others apply and are individually reviewed before an invitation is extended. There is no open sign-up.' },
  { q: 'Is this a networking event?', a: "No. It's an immersive founder experience — no stage, no pitching, no business cards. Only four people, one fire, and real conversations that go somewhere." },
  { q: 'How many founders per gathering?', a: "Four. Small by design — it's the only number where genuine relationships actually form, not just exchanges of details." },
  { q: 'Where does it happen?', a: 'At nature venues across India — forests, farms and mountains, away from stages and noise. Exact locations are shared with confirmed founders only.' },
  { q: 'Can my brand partner with Stranger Founders?', a: 'Yes — selectively. We work only with brands genuinely aligned with founders and creator communities. Start a conversation on the Partners page.' },
]




function PullQuote() {
  const quoteRef = useRef(null)
  const coordsRef = useRef({ x: 0, y: 0 })
  const radiusRef = useRef(0)
  const targetRadiusRef = useRef(0)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const el = quoteRef.current
    if (!el) return

    const update = () => {
      // Lerp radius
      radiusRef.current += (targetRadiusRef.current - radiusRef.current) * 0.08
      
      // Update element styles
      el.style.setProperty('--tx', `${coordsRef.current.x}px`)
      el.style.setProperty('--ty', `${coordsRef.current.y}px`)
      el.style.setProperty('--torch-r', `${radiusRef.current}px`)
      
      // Calculate drop-shadow filter based on current radius ratio
      const glowIntensity = radiusRef.current / 350
      el.style.filter = `drop-shadow(0 0 ${glowIntensity * 25}px rgba(214, 154, 92, ${glowIntensity * 0.75})) drop-shadow(0 0 ${glowIntensity * 45}px rgba(245, 236, 216, ${glowIntensity * 0.45}))`

      animationFrameRef.current = requestAnimationFrame(update)
    }

    animationFrameRef.current = requestAnimationFrame(update)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const handleMouseMove = (e) => {
    const el = quoteRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    coordsRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
    targetRadiusRef.current = 350
  }

  const handleMouseLeave = () => {
    targetRadiusRef.current = 0
  }

  return (
    <p 
      ref={quoteRef}
      className="pull-quote"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      "Every founder should dream<br />of receiving an invitation."
    </p>
  )
}

function GuidePhoto3D() {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const rotateX = (-y / rect.height) * 18
    const rotateY = (x / rect.width) * 18
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    
    const bg = card.querySelector('.guide-layer-bg img')
    const fg = card.querySelector('.guide-layer-subject img')
    if (bg) bg.style.transform = `scale(1.14) translate(${-x * 0.04}px, ${-y * 0.04}px)`
    if (fg) fg.style.transform = `scale(1.06) translate(${x * 0.06}px, ${y * 0.06 - 6}px)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    const bg = card.querySelector('.guide-layer-bg img')
    const fg = card.querySelector('.guide-layer-subject img')
    if (bg) bg.style.transform = `scale(1.08) translate(0, 0)`
    if (fg) fg.style.transform = `scale(1) translate(0, 0)`
  }

  return (
    <Reveal className="guide-photo-3d-wrapper">
      <div 
        ref={cardRef} 
        className="guide-card-3d"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <span className="guide-badge">THE GUIDE</span>
        {/* Layer 1: Grey Sand Wave Texture Background */}
        <div className="guide-layer guide-layer-bg">
          <img src="/img/ram-sand-texture.jpg" alt="" />
        </div>
        <div className="guide-vignette" aria-hidden="true" />
        {/* Layer 2: Dead-Centered Subject Cutout in 3D Space */}
        <div className="guide-layer guide-layer-subject">
          <img src="/img/ram-subject-deadcenter.png" alt="" />
        </div>
      </div>
    </Reveal>
  )
}

const mediaItems = [
  {
    category: 'The Fire',
    title: 'Fireside Reflections',
    id: 'JJQFoYgRv-Q'
  },
  {
    category: 'Vibe',
    title: 'Stranger Founders Gather',
    id: 'L58JITDOQt0'
  },
  {
    category: 'Legacies',
    title: 'Building Legacies',
    id: '2js5CVDKB4k'
  },
  {
    category: 'Invitation',
    title: 'Receiving The Call',
    id: 'Bz_aFjN4vTY'
  },
  {
    category: 'Creator',
    title: 'Creator Founders Season',
    id: 'TM79p5MplyI'
  },
  {
    category: 'Moments',
    title: 'Uncovering the Truth',
    id: 'uQoGH_mH6G4'
  },
  {
    category: 'Walks',
    title: 'The Forest Walk',
    id: 'AwxRgXAqqec'
  },
  {
    category: 'Fireside',
    title: 'Late Night Talk',
    id: '4GERWTg2VWw'
  }
]

function MediaCard({ item, onPlay }) {
  const [loadVideo, setLoadVideo] = useState(false)
  const timerRef = useRef(null)

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setLoadVideo(true)
    }, 300)
  }

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setLoadVideo(false)
  }

  const thumbUrl = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`
  const embedUrl = `https://www.youtube.com/embed/${item.id}?autoplay=1&mute=1&loop=1&playlist=${item.id}&controls=0&modestbranding=1&rel=0&iv_load_policy=3`

  return (
    <div 
      className="media-card" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      onClick={() => onPlay(item.id)}
    >
      <div className="media-thumb-wrapper">
        {loadVideo ? (
          <iframe
            className="media-hover-video"
            src={embedUrl}
            title={item.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        ) : (
          <img src={thumbUrl} alt={item.title} className="media-thumb" />
        )}
        <div className="media-overlay">
          <button className="play-button-circle" aria-label="Play video">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="media-card-body">
        <span className="media-category">{item.category}</span>
        <h3 className="media-card-title">{item.title}</h3>
      </div>
    </div>
  )
}

function MediaShowcase() {
  const [activeVideo, setActiveVideo] = useState(null)

  return (
    <section className="section-pad media-section" id="media">
      <div className="container">
        <div className="media-header">
          <Reveal>
            <span className="eyebrow">MOMENTS & HIGHLIGHTS</span>
            <h2 className="h-lg" style={{ marginTop: 12 }}>Media Showcase</h2>
            <p className="lead muted" style={{ marginTop: 16, maxWidth: '52ch' }}>
              Highlights, stories, and moments from our global summits and challenges.
            </p>
          </Reveal>
        </div>
      </div>

      <Reveal delay={1}>
        <div className="media-carousel-wrapper">
          <div className="media-carousel-track">
            {[...mediaItems, ...mediaItems].map((item, idx) => (
              <MediaCard key={idx} item={item} onPlay={setActiveVideo} />
            ))}
          </div>
        </div>
      </Reveal>

      {activeVideo && (
        <div className="lightbox-modal" onClick={() => setActiveVideo(null)}>
          <div className="lightbox-content vertical" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setActiveVideo(null)}>&times;</button>
            <div className="lightbox-iframe-wrapper vertical">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&controls=1&modestbranding=1&rel=0`}
                title="Video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default function Home() {
  return (
    <>
      {/* ===================== HERO ===================== */}
      <header className="hero" id="top">
        <div className="hero-scene" aria-hidden="true">
          <svg viewBox="0 0 1600 1100" preserveAspectRatio="xMidYMax slice">
            <defs>
              <linearGradient id="skyHero" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0b1610" />
                <stop offset="68%" stopColor="#122a1c" />
                <stop offset="88%" stopColor="#5c3f22" />
                <stop offset="100%" stopColor="#0b1610" />
              </linearGradient>
              <radialGradient id="glowHero" cx="50%" cy="97%" r="26%">
                <stop offset="0%" stopColor="#d69a5c" stopOpacity="0.75" />
                <stop offset="55%" stopColor="#8a5527" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#8a5527" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="1600" height="1100" fill="url(#skyHero)" />
            <g opacity="0.65">
              <circle cx="140" cy="90" r="1.4" fill="#f5ecd8" /><circle cx="320" cy="140" r="1" fill="#f5ecd8" />
              <circle cx="480" cy="70" r="1.3" fill="#f5ecd8" /><circle cx="650" cy="130" r="1" fill="#f5ecd8" />
              <circle cx="820" cy="60" r="1.2" fill="#f5ecd8" /><circle cx="980" cy="140" r="1" fill="#f5ecd8" />
              <circle cx="1140" cy="80" r="1.4" fill="#f5ecd8" /><circle cx="1300" cy="150" r="1" fill="#f5ecd8" />
              <circle cx="1460" cy="90" r="1.2" fill="#f5ecd8" /><circle cx="60" cy="220" r="1" fill="#f5ecd8" />
              <circle cx="200" cy="180" r="0.9" fill="#f5ecd8" /><circle cx="760" cy="110" r="1.1" fill="#f5ecd8" />
              <circle cx="1050" cy="55" r="1" fill="#f5ecd8" /><circle cx="1380" cy="200" r="0.8" fill="#f5ecd8" />
            </g>
            {/* Big ambient glow — fully inside viewBox now */}
            <ellipse cx="800" cy="1060" rx="320" ry="90" fill="url(#glowHero)" />
            <polygon className="ridge-far"
              points="0,900 120,875 220,895 340,865 450,890 570,860 690,885 810,858 930,888 1050,862 1170,890 1290,865 1410,892 1530,870 1600,888 1600,1100 0,1100"
              fill="#8a5527" opacity="0.25" />
            <polygon className="ridge-mid"
              points="0,930 130,908 240,925 360,900 470,922 590,895 700,920 820,898 940,924 1060,902 1180,926 1300,905 1420,928 1540,910 1600,922 1600,1100 0,1100"
              fill="#4a3420" opacity="0.5" />
            {/* Jagged treeline — extended to 1100 bottom */}
            <path d="M0,962 L55,942 L80,962 L125,932 L160,962 L200,938 L235,962 L280,928 L315,962 L360,940 L395,962 L440,922 L475,962 L520,936 L555,962 L600,924 L635,962 L675,938 L710,962 L755,918 L790,962 L835,936 L870,962 L915,924 L950,962 L995,938 L1030,962 L1075,924 L1110,962 L1155,938 L1190,962 L1235,920 L1270,962 L1315,936 L1350,962 L1395,924 L1430,962 L1475,938 L1510,962 L1555,928 L1600,962 L1600,1100 L0,1100 Z"
              fill="#0b1610" />
            {/* Campfire Group on ground level */}
            <g transform="translate(0, 10)">
              {/* Campfire Base Glow */}
              <ellipse cx="800" cy="1038" rx="160" ry="46" fill="#8a5527" opacity="0.3" />
              <ellipse cx="800" cy="1038" rx="65" ry="18" fill="#d69a5c" opacity="0.8" />
              <ellipse cx="800" cy="1038" rx="35" ry="10" fill="#f5ecd8" opacity="0.45" />

              {/* Campfire Pit Stones */}
              <circle cx="742" cy="1040" r="7" fill="#1c2d20" />
              <circle cx="756" cy="1046" r="8" fill="#253a2a" />
              <circle cx="844" cy="1046" r="8" fill="#253a2a" />
              <circle cx="858" cy="1040" r="7" fill="#1c2d20" />

              {/* Crossed Campfire Wooden Logs */}
              <line x1="748" y1="1048" x2="852" y2="1024" stroke="#2b1a0d" strokeWidth="12" strokeLinecap="round" />
              <line x1="752" y1="1047" x2="848" y2="1025" stroke="#4a301a" strokeWidth="6" strokeLinecap="round" />
              <line x1="852" y1="1048" x2="748" y2="1024" stroke="#24150a" strokeWidth="12" strokeLinecap="round" />
              <line x1="848" y1="1047" x2="752" y2="1025" stroke="#422915" strokeWidth="6" strokeLinecap="round" />
              <line x1="765" y1="1038" x2="835" y2="1038" stroke="#362010" strokeWidth="10" strokeLinecap="round" />
              <line x1="768" y1="1038" x2="832" y2="1038" stroke="#5a381c" strokeWidth="4" strokeLinecap="round" />

              {/* Rising Smoke Wisps */}
              <g opacity="0.6">
                <path className="smoke-wisp smoke-1" d="M790 960 Q770 900 795 830 T780 730" fill="none" stroke="#d69a5c" strokeWidth="24" strokeLinecap="round" />
                <path className="smoke-wisp smoke-2" d="M810 955 Q830 895 805 825 T815 720" fill="none" stroke="#f5ecd8" strokeWidth="20" strokeLinecap="round" />
                <path className="smoke-wisp smoke-3" d="M800 965 Q780 905 810 840 T790 740" fill="none" stroke="#cdbe9c" strokeWidth="18" strokeLinecap="round" />
              </g>

              {/* Layered Flickering Campfire Flames */}
              <path className="flame-outer"
                d="M800 935 C 760 978, 764 1028, 800 1036 C 836 1028, 840 978, 800 935 Z"
                fill="#b3703a" opacity="0.88" />
              <path className="flame-mid-2"
                d="M790 950 C 765 985, 770 1026, 796 1034 C 825 1026, 825 985, 790 950 Z"
                fill="#c98246" opacity="0.9" />
              <path className="flame-mid"
                d="M800 952 C 772 985, 775 1026, 800 1034 C 825 1026, 828 985, 800 952 Z"
                fill="#d69a5c" opacity="0.95" />
              <path className="flame-inner"
                d="M800 974 C 784 998, 786 1024, 800 1030 C 814 1024, 816 998, 800 974 Z"
                fill="#f5ecd8" opacity="0.98" />
              <path className="flame-core"
                d="M800 994 C 790 1008, 791 1022, 800 1026 C 809 1022, 810 1008, 800 994 Z"
                fill="#ffffff" opacity="0.95" />

              {/* Fire Sparks & Floating Embers */}
              <circle className="fire-spark spark-1" cx="790" cy="955" r="2.2" fill="#f5ecd8" />
              <circle className="fire-spark spark-2" cx="812" cy="948" r="1.8" fill="#d69a5c" />
              <circle className="fire-spark spark-3" cx="798" cy="936" r="2.0" fill="#f5ecd8" />
              <circle className="fire-spark spark-4" cx="818" cy="962" r="1.5" fill="#d69a5c" />
              <circle className="fire-spark spark-5" cx="784" cy="968" r="1.6" fill="#f5ecd8" />
            </g>
          </svg>
        </div>

        {/* Ambient hero sparkles */}
        <div className="hero-sparkles-container" aria-hidden="true">
          {Array.from({ length: 30 }).map((_, i) => (
            <span
              key={i}
              className="hero-ambient-sparkle"
              style={{
                left: `${(i * 31 + 7) % 96}%`,
                bottom: `${(i * 17 + 10) % 85}%`,
                width: `${(i % 3) * 2 + 3}px`,
                height: `${(i % 3) * 2 + 3}px`,
                animationDuration: `${3.5 + (i % 5) * 1.8}s`,
                animationDelay: `${(i % 7) * 0.6}s`
              }}
            />
          ))}
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
            <Link to="/apply" className="btn btn-primary">Request an Invitation <span className="arw">→</span></Link>
            <Link to="/partners" className="btn btn-ghost">Become a Partner</Link>
          </Reveal>
          <div className="scroll-cue"><span>Scroll</span><span className="line" /></div>
        </div>
      </header>

      {/* ===================== FEATURE STRIP (5 Pillars) ===================== */}
      <section className="feature-strip-section">
        <div className="strip-torn-edge" aria-hidden="true">
          <svg viewBox="0 0 1440 24" preserveAspectRatio="none">
            <path d="M0,24 L0,8 Q30,18 60,6 T120,16 T180,5 T240,18 T300,7 T360,17 T420,4 T480,16 T540,6 T600,18 T660,8 T720,17 T780,5 T840,16 T900,6 T960,18 T1020,7 T1080,17 T1140,5 T1200,16 T1260,7 T1320,18 T1380,6 T1440,15 L1440,24 Z" fill="var(--forest-950)" />
          </svg>
        </div>
        <div className="container">
          <Reveal className="feature-strip-grid">
            {[
              {
                icon: <TbUsers size={42} strokeWidth={1.2} />,
                t1: 'MEET',
                t2: 'STRANGERS'
              },
              {
                icon: <TbMountain size={42} strokeWidth={1.2} />,
                t1: 'STEP OUT OF',
                t2: 'YOUR COMFORT ZONE'
              },
              {
                icon: <TbMessages size={42} strokeWidth={1.2} />,
                t1: 'SHARE STORIES &',
                t2: 'BUSINESS INSIGHTS'
              },
              {
                icon: <TbWalk size={42} strokeWidth={1.2} />,
                t1: 'FUN ACTIVITIES &',
                t2: 'LEARNING'
              },
              {
                icon: <PiHandshakeThin size={46} />,
                t1: 'BUILD CONNECTIONS.',
                t2: 'CREATE LEGACIES.'
              }
            ].map((item, idx) => (
              <div className="feature-strip-item" key={idx}>
                <div className="feature-strip-icon">{item.icon}</div>
                <p className="feature-strip-text">
                  {item.t1}<br />{item.t2}
                </p>
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
              <span className="story-eyebrow">THE STORY</span>
              <h2 className="story-title">Why Stranger Founders exists</h2>
              <div className="story-unlike">
                <span>Unlike conferences.</span>
                <span>Unlike networking events.</span>
                <span>Unlike podcasts.</span>
              </div>
              <p className="story-body">
                We bring strangers together in forests, farms, mountains and
                nature — away from stages, away from noise, away from business cards.
              </p>
              <p className="story-body">
                Founders participate in challenges. Share stories. Discuss
                business. Learn from each other. Build lifelong relationships.
                Everything is filmed cinematically.
              </p>
              <blockquote className="story-quote">
                "Participants arrive as strangers. They leave as Stranger Founders."
              </blockquote>
            </Reveal>
            <Reveal className="story-visual" delay={1}>
              <img src="/STORY.png" alt="Why Stranger Founders Exists" className="story-img" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================== WHY DIFFERENT ===================== */}
      <section className="diff-section">
        <div className="container diff-inner">
          <Reveal>
            <p className="diff-eyebrow">WHY DIFFERENT</p>
            <h2 className="diff-title">We traded the familiar for the real</h2>
          </Reveal>
          <Reveal delay={1}>
            <div className="diff-card-stack">
              {[
                ['Conference Rooms', 'Forests'],
                ['Networking', 'Experiences'],
                ['Speeches', 'Conversations'],
                ['Business Cards', 'Relationships'],
                ['Audiences', 'Communities'],
              ].map(([from, to]) => (
                <div className="diff-card" key={from}>
                  <div className="diff-card-left">
                    <span className="diff-from-badge">{from}</span>
                  </div>
                  <div className="diff-card-center">
                    <span className="diff-arrow-badge">→</span>
                  </div>
                  <div className="diff-card-right">
                    <span className="diff-to-badge">
                      <span className="diff-live-dot" aria-hidden="true" />
                      {to}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={2}>
            <p className="diff-footer-label">COMPARED TO THE USUAL FORMATS</p>
            <div className="compared-pills-grid">
              {[
                { label: 'Podcast', icon: <TbMicrophone size={18} strokeWidth={1.5} /> },
                { label: 'Conference', icon: <TbBuildingSkyscraper size={18} strokeWidth={1.5} /> },
                { label: 'Networking Event', icon: <TbUsersGroup size={18} strokeWidth={1.5} /> },
                { label: 'Retreat', icon: <TbTent size={18} strokeWidth={1.5} /> }
              ].map(({ icon, label }) => (
                <div className="compared-pill-item" key={label}>
                  <div className="compared-pill-icon">{icon}</div>
                  <span className="compared-pill-label">{label}</span>
                </div>
              ))}
            </div>
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
            <span className="eyebrow">An Immersive Journey. Six Chapters.</span>
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
            <GuidePhoto3D />
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
                  "He isn't the host.<br />He's the guide who brings strangers together."
                </blockquote>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PULL QUOTE ===================== */}
      <section className="pull-quote-section">
        <div className="container">
          <Reveal>
            <PullQuote />
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
                <Link to="/apply" className="btn btn-primary">Request an Invitation <span className="arw">→</span></Link>
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

      {/* ===================== MEDIA SHOWCASE ===================== */}
      <MediaShowcase />

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
