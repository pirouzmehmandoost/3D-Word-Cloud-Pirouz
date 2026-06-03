'use client'

import { memo, Suspense } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Html, OrbitControls, Stage } from '@react-three/drei'
import type { WordWeight } from '@/app/lib/types'
import cameraConfigs from '@configs/cameraConfigs'
import Scene from '../scene/Scene'

THREE.ColorManagement.enabled = true
THREE.Cache.enabled = true

const { MIN_POLAR_ANGLE, MAX_POLAR_ANGLE } = cameraConfigs

type SceneCanvasProps = {
  words: WordWeight[]
}

export const Loader = () => {
  return (
    <Html center className="text-white text-nowrap text-5xl">
      Loading...
    </Html>
  )
}

const SceneCanvas = memo(function SceneCanvas({ words }: SceneCanvasProps) {
  return (
    <div className="fixed inset-0 pointer-events-auto">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={'always'}
        gl={{ antialias: true }}
        camera={{
          position: cameraConfigs.POSITION,
          near: cameraConfigs.NEAR,
          far: cameraConfigs.FAR,
          fov: cameraConfigs.FOV,
        }}
        fallback={<div> Sorry, WebGL is not supported. </div>}
        orthographic={false}
        shadows={{ type: THREE.PCFShadowMap }}
      >
        <Stage shadows="accumulative" />
        <Suspense fallback={<Loader />}>
          <Scene words={words} />
          <OrbitControls
            enableDamping
            dampingFactor={0.08}
            enablePan={false}
            minDistance={10}
            maxDistance={30}
            minPolarAngle={MIN_POLAR_ANGLE - MAX_POLAR_ANGLE}
            maxPolarAngle={MIN_POLAR_ANGLE + MAX_POLAR_ANGLE}
          />
        </Suspense>
      </Canvas>
    </div>
  )
})

export default SceneCanvas
