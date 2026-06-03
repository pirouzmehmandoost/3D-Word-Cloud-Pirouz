'use client'

import { EffectComposer, N8AO } from '@react-three/postprocessing'
import type { WordWeight } from '@/app/lib/types'
import WordCloud from '../group/WordCloud'

type SceneProps = {
  words: WordWeight[]
}

const Scene = ({ words }: SceneProps) => {
  return (
    <>
      <directionalLight
        castShadow={true}
        color={'#ffffff'}
        intensity={3}
        position={[0, 0, 50]}
        shadow-bias={-0.004}
        shadow-camera-fov={35}
        shadow-camera-near={1}
        shadow-camera-far={400}
        shadow-camera-top={250}
        shadow-camera-bottom={-250}
        shadow-camera-left={-250}
        shadow-camera-right={250}
        shadow-mapSize={1024}
      />
      <EffectComposer autoClear={false} multisampling={0}>
        <N8AO
          aoRadius={50}
          distanceFalloff={0.3}
          intensity={0.5}
          screenSpaceRadius
          halfRes
        />
      </EffectComposer>
      <WordCloud words={words} />
    </>
  )
}

export default Scene
