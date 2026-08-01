import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="page-hero section-pad">
      <div className="container narrow" style={{ textAlign: 'center' }}>
        <span className="eyebrow center plain">Off the trail</span>
        <h1 className="display" style={{ margin: '20px 0 18px' }}>404</h1>
        <p className="lead muted">This path doesn’t lead to the fire. Let’s get you back.</p>
        <div style={{ marginTop: 30 }}>
          <Link to="/" className="btn btn-primary">Return home <span className="arw">→</span></Link>
        </div>
      </div>
    </section>
  )
}
