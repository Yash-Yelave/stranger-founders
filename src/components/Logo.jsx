import { Link } from 'react-router-dom'

export function LogoMark({ size = 40 }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true"
         style={{ width: size, height: size }}>
      <circle cx="50" cy="50" r="35" fill="none" stroke="var(--copper)" strokeWidth="2.2" />
      <text x="45" y="63" fontFamily="Fraunces, Georgia, serif" fontSize="40" fontWeight="500"
            fill="var(--copper-light)" textAnchor="middle">SF</text>
      <path d="M69 33 l4.5 10 -3.2 0 3.4 8 -3.2 0 3.4 8 -9 0 3.4 -8 -3.2 0 3.4 -8 -3.2 0 z"
            fill="var(--copper)" />
    </svg>
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
