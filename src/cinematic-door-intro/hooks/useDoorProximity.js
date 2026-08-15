export function checkDoorProximity(pos1, pos2, activationRadius = 90) {
  if (!pos1 || !pos2) return { isWithinRadius: false, distance: 9999, progress: 0 }

  const dx = pos1.x - pos2.x
  const dy = pos1.y - pos2.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  const isWithinRadius = distance <= activationRadius
  const maxProximityDistance = activationRadius * 2.5
  const progress = Math.max(0, Math.min(1, 1 - (distance / maxProximityDistance)))

  return { isWithinRadius, distance, progress }
}
