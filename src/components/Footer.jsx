import { Link } from 'react-router-dom'
import { LogoMark } from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <LogoMark size={44} />
            <p className="footer-tag">Meet Strangers. Build Legacies.</p>
            <p className="muted" style={{ maxWidth: '34ch', fontSize: 15 }}>
              An invite-only founder experience. Four strangers, one fire, and the
              conversations that outlast the season.
            </p>
          </div>

          <div className="footer-col">
            <h5>Explore</h5>
            <Link to="/experience">The Experience</Link>
            <Link to="/season-01">Season 01</Link>
            <Link to="/partners">Partner With Us</Link>
            <Link to="/apply">Request an Invitation</Link>
          </div>

          <div className="footer-col">
            <h5>The Circle</h5>
            <a href="https://instagram.com/thesfshow" target="_blank" rel="noreferrer">Instagram — @thesfshow</a>
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
