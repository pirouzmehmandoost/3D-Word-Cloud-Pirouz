'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import type { WordWeight } from '@/app/lib/types'
import { calculateWordCloudPositions, wrap } from '@utils/positionUtils'
import {
  MAX_FRAME_DELTA_SECONDS,
  ROTATION_SPEED,
  FULL_ROTATION_RADIANS,
} from '@configs/animationConfigs'
import WordMesh from '../mesh/WordMesh'

type WordCloudProps = {
  words: WordWeight[]
}

const WordCloud = ({ words }: WordCloudProps) => {
  const wordCloudRef = useRef<THREE.Group>(null)

  const positionedWords = useMemo(
    () => calculateWordCloudPositions(words),
    [words],
  )

  const wordMeshes = useMemo(
    () =>
      positionedWords.map(({ word, weight, position }) => (
        <WordMesh key={word} word={word} weight={weight} position={position} />
      )),
    [positionedWords],
  )

  useFrame((_, delta) => {
    if (!wordCloudRef.current) return

    const clampedDelta = Math.min(delta, MAX_FRAME_DELTA_SECONDS)
    const y = wordCloudRef.current.rotation.y + clampedDelta * ROTATION_SPEED
    const wrappedY = wrap(y, 0, FULL_ROTATION_RADIANS)

    wordCloudRef.current.rotation.y = wrappedY
  })

  return (
    <group ref={wordCloudRef} position={[0, 0, 0]}>
      {wordMeshes}
    </group>
  )
}

export default WordCloud
