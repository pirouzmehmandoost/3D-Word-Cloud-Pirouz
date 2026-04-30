import type { WordWeight } from '@/app/lib/types'

export const GOLDEN_ANGLE_RADIANS = Math.PI * (3 - Math.sqrt(5))
const WORD_SPACING = 2.4
const MIN_WEIGHT_RADIUS_FACTOR = 0.45
const MAX_VISIBLE_WORDS = 40

/**
 * Places words on a Fibonacci sphere so the cloud fills 3D space without
 * random positions. Higher TF-IDF weights are pulled closer to the center,
 * while lower-weight words sit farther out in the cloud volume.
 */
export function calculateWordCloudPositions(words: WordWeight[]) {
  const visibleWords = words.slice(0, MAX_VISIBLE_WORDS)
  const total = visibleWords.length
  // Cube root grows the radius by an approximate 3D volume.
  const cloudRadius = Math.cbrt(Math.max(total, 1)) * WORD_SPACING
  return visibleWords.map((word, index) => {
    // Map the sorted word list from top (+y) to bottom (-y).
    const normalizedRank = total > 1 ? index / (total - 1) : 0
    const y = 1 - normalizedRank * 2
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))

    const angle = index * GOLDEN_ANGLE_RADIANS
    // pull more important words toward the center.
    const weightRadiusFactor =
      MIN_WEIGHT_RADIUS_FACTOR +
      (1 - word.weight) * (1 - MIN_WEIGHT_RADIUS_FACTOR)

    const distance = cloudRadius * weightRadiusFactor

    return {
      ...word,
      position: [
        Math.cos(angle) * radiusAtY * distance,
        y * distance,
        Math.sin(angle) * radiusAtY * distance,
      ] satisfies [number, number, number],
    }
  })
}

export const wrap = (value: number, min: number, max: number) => {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

/**
 * Maps a string to a stable 0-1 value for deterministic visual variation.
 */
export const getStableUnitValue = (value: string) => {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }

  return hash / 0xffffffff
}
