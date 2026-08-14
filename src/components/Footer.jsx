import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p className="footer-tag">Meet Strangers. Build Legacies.</p>
            <p className="muted" style={{ maxWidth: '34ch', fontSize: 15, marginTop: 12 }}>
              An invite-only founder experience. Four strangers, one fire, and the
              conversations that outlast the season.
            </p>
          </div>

          <div className="footer-col">
            <h5>Explore</h5>
            <Link to="/experience">The Story</Link>
            <Link to="/season-01">Season 01</Link>
            <Link to="/apply">Request an Invitation</Link>
          </div>

          <div className="footer-col">
            <h5>The Circle</h5>
            <a href="https://www.instagram.com/ramprayaga/" target="_blank" rel="noreferrer">Instagram — @ramprayaga</a>
            <a href="https://www.youtube.com/@RamPrayaga_MYB" target="_blank" rel="noreferrer">YouTube — @RamPrayaga_MYB</a>
            <a href="mailto:hello@strangerfounders.com">hello@strangerfounders.com</a>
            <p>Nature venues across India</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Stranger Founders · The SF Circle</p>
          <p className="powered">
            <span>Powered by</span>
            <strong style={{ color: 'var(--cream)', letterSpacing: '0.02em' }}>FinanceBox</strong>
          </p>
        </div>
      </div>
    </footer>
  )
}
