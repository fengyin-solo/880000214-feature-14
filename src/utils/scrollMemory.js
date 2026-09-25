const positions = new Map()

export function saveScrollPosition(key, top) {
  if (!key || typeof top !== 'number' || Number.isNaN(top)) return
  positions.set(key, Math.max(0, Math.round(top)))
}

export function getScrollPosition(key) {
  return positions.get(key)
}

export function resetScrollPositions() {
  positions.clear()
}
