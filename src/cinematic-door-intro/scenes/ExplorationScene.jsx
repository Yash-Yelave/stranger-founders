import React, { useState, useMemo } from 'react'
import BoxContainer from './BoxContainer.jsx'
import { DOOR_INTRO_CONFIG } from '../doorIntroConfig'

export default function ExplorationScene({
  scrollProgress = 0,
  onOpenBox,
  onPickupKey,
  isKeyPickedUp
}) {
  // Translate exploration space based on scrollProgress (0 = hidden below door, 1 = fully visible)
  const translateY = (1 - scrollProgress) * 100 // % translate down

  // Select key box index ONCE when the door intro starts (stable for the entire intro run)
  const [randomKeyBoxIndex] = useState(() => {
    return Math.floor(Math.random() * DOOR_INTRO_CONFIG.BOXES.length)
  })

  // Ensure exactly one box contains the key while maintaining all non-key contents
  const randomizedBoxes = useMemo(() => {
    return DOOR_INTRO_CONFIG.BOXES.map((box, index) => {
      const isWinningBox = index === randomKeyBoxIndex
      return {
        ...box,
        hasKey: isWinningBox,
        content: isWinningBox ? 'key' : (box.content === 'key' ? 'envelope' : box.content)
      }
    })
  }, [randomKeyBoxIndex])

  return (
    <div
      className="sf-door-exploration-scene"
      style={{
        transform: `translate3d(0, ${translateY}%, 0)`,
        opacity: Math.min(1, scrollProgress * 1.5)
      }}
    >
      <div className="sf-archive-header">
        <span className="sf-archive-tag">Founder Storage Archive</span>
        <h3>Explore the Containers</h3>
        <p>One of these cases holds the key to the door above.</p>
      </div>

      {/* Storage Containers Layer */}
      <div className="sf-archive-containers">
        {randomizedBoxes.map((box) => (
          <BoxContainer
            key={box.id}
            boxData={box}
            onOpenBox={onOpenBox}
            onPickupKey={onPickupKey}
            isKeyPickedUp={isKeyPickedUp}
          />
        ))}
      </div>

      {/* Ambient particles */}
      <div className="sf-archive-particles" aria-hidden="true">
        <span className="sf-particle p1" />
        <span className="sf-particle p2" />
        <span className="sf-particle p3" />
        <span className="sf-particle p4" />
      </div>
    </div>
  )
}
