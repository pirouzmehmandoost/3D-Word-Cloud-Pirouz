'use client'

import { Text } from '@react-three/drei'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import type { WordWeight } from '@/app/lib/types'

type SceneProps = {
  words: WordWeight[]
}

type WordNodeProps = {
  word: string
  weight: number
  position: [number, number, number]
}

const WordNode = ({ word, weight, position }: WordNodeProps) => {
  return (
    <Text
      position={position}
      fontSize={0.5 + weight * 1.5}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      {word}
    </Text>
  )
}
const Scene = ({ words }: SceneProps) => {
  return (
    <>
      <directionalLight
        castShadow={true}
        color={'#fff6e8'}
        intensity={1}
        position={[0, 10, 0]}
        shadow-bias={-0.004}
        shadow-camera-fov={50}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-mapSize={1024}
      />
      <EffectComposer autoClear={false} multisampling={0}>
        <N8AO
          aoRadius={10}
          distanceFalloff={0.3}
          intensity={0.5}
          screenSpaceRadius
          halfRes
        />
      </EffectComposer>

      {words.slice(0, 20).map(({ word, weight }, index) => (
        <WordNode
          key={word}
          word={word}
          weight={weight}
          position={[0, index * -1, -20]}
        />
      ))}
    </>
  )
}

export default Scene
