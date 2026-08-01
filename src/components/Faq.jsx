import { useRef, useState } from 'react'

function Item({ q, a }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-q" aria-expanded={open} onClick={() => setOpen(v => !v)}>
        <span>{q}</span>
        <span className="sign" aria-hidden="true" />
      </button>
      <div className="faq-a" style={{ maxHeight: open ? (ref.current?.scrollHeight || 400) : 0 }}>
        <div className="faq-a-inner" ref={ref}>{a}</div>
      </div>
    </div>
  )
}

export default function Faq({ items }) {
  return (
    <div className="faq">
      {items.map((it, i) => <Item key={i} {...it} />)}
    </div>
  )
}
