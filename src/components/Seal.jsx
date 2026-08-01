/* The circular "I am a Stranger Founder" wax-stamp seal from the deck. */
export default function Seal({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true"
         style={{ width: size, height: size }}>
      <circle cx="100" cy="100" r="94" fill="none" stroke="var(--copper)" strokeWidth="1"
              strokeDasharray="2 5" opacity="0.7" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="var(--copper)" strokeWidth="1.4" />
      <text x="100" y="86" textAnchor="middle" fontFamily="Marck Script, cursive"
            fontSize="26" fill="var(--cream)">I am a</text>
      <text x="100" y="118" textAnchor="middle" fontFamily="Marck Script, cursive"
            fontSize="26" fill="var(--copper-light)">Stranger</text>
      <text x="100" y="146" textAnchor="middle" fontFamily="Marck Script, cursive"
            fontSize="26" fill="var(--copper-light)">Founder</text>
    </svg>
  )
}
