import { Link } from 'react-router-dom'

export function LogoMark({ size = 40 }) {
  return (
    <img
      src="/img/logo.png"
      alt="Stranger Founders Logo"
      className="logo-mark"
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Stranger Founders — home">
      <LogoMark />
      <span className="logo-word">
        <b>STRANGER FOUNDERS</b>
        <small>Meet Strangers · Build Legacies</small>
      </span>
    </Link>
  )
}
