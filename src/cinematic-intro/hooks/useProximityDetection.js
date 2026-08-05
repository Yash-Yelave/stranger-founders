/**
 * Proximity detection helper calculating Euclidean distance between two points
 */
export function getDistance(posA, posB) {
  if (!posA || !posB) return Infinity
  const dx = posA.x - posB.x
  const dy = posA.y - posB.y
  return Math.sqrt(dx * dx + dy * dy)
}

export function isWithinProximity(posA, posB, radius) {
  return getDistance(posA, posB) <= radius
}
