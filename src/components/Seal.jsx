/* Elevated "I am a Stranger Founder" seal badge preserving original script layout & high contrast legibility */
export default function Seal({ size = 130 }) {
  return (
    <div className="seal-badge-wrapper" style={{ width: size, height: size, display: 'inline-block' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        aria-label="I am a Stranger Founder Seal"
        className="seal-badge-svg"
      >
        {/* Background Glass Disc */}
        <circle cx="100" cy="100" r="92" fill="rgba(11, 22, 16, 0.75)" stroke="#d69a5c" strokeWidth="1" strokeDasharray="3 5" opacity="0.8" />
        <circle cx="100" cy="100" r="82" fill="rgba(6, 14, 10, 0.92)" stroke="#d69a5c" strokeWidth="1.8" />
        
        {/* Inner Accent Ring */}
        <circle cx="100" cy="100" r="76" fill="none" stroke="rgba(245, 236, 216, 0.3)" strokeWidth="0.8" />

        {/* High Legibility Stacked Script Text */}
        <text
          x="100"
          y="80"
          textAnchor="middle"
          fontFamily="'Marck Script', cursive"
          fontStyle="normal"
          fontSize="28"
          fontWeight="600"
          fill="#f5ecd8"
        >
          I am a
        </text>
        <text
          x="100"
          y="118"
          textAnchor="middle"
          fontFamily="'Marck Script', cursive"
          fontStyle="normal"
          fontSize="30"
          fontWeight="700"
          fill="#e5ab6a"
        >
          Stranger
        </text>
        <text
          x="100"
          y="152"
          textAnchor="middle"
          fontFamily="'Marck Script', cursive"
          fontStyle="normal"
          fontSize="30"
          fontWeight="700"
          fill="#e5ab6a"
        >
          Founder
        </text>
      </svg>
    </div>
  )
}
