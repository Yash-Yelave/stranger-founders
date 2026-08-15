import React, { useState } from 'react'
import KeyItem from './KeyItem.jsx'

export default function BoxContainer({
  boxData,
  onOpenBox,
  onPickupKey,
  isKeyPickedUp
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(true)
      if (onOpenBox) onOpenBox(boxData)
    }
  }

  return (
    <div
      className={`sf-archive-box-wrapper box-type-${boxData.type} ${isOpen ? 'box-is-open' : ''}`}
      style={{ left: `${boxData.x}%`, top: `${boxData.y}%` }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Inspect ${boxData.title}`}
    >
      {/* 3D Box Perspective Body */}
      <div className="sf-box-body">
        {/* Box Lid with smooth 3D rotation */}
        <div className="sf-box-lid">
          <div className="sf-box-lid-texture" />
          <div className="sf-box-handle" />
        </div>

        {/* Box Interior Compartment */}
        <div className="sf-box-interior">
          <div className="sf-interior-lining" />
          {isOpen && (
            <div className="sf-box-content-reveal">
              {boxData.hasKey && !isKeyPickedUp ? (
                <div className="sf-key-in-box-glow" onClick={(e) => { e.stopPropagation(); onPickupKey(); }}>
                  <KeyItem isPickedUp={false} onClick={(e) => { e.stopPropagation(); onPickupKey(); }} />
                  <span className="sf-key-hint">Take Key</span>
                </div>
              ) : boxData.content === 'envelope' ? (
                <div className="sf-item-envelope">✉️ <small>Sealed Letter</small></div>
              ) : boxData.content === 'photograph' ? (
                <div className="sf-item-photo">🖼️ <small>Founder Archive 1924</small></div>
              ) : (
                <div className="sf-item-seal">📜 <small>SF Circle Seal</small></div>
              )}
            </div>
          )}
        </div>
      </div>

      <span className="sf-box-label">{boxData.title}</span>
    </div>
  )
}
