'use client'

import { Suspense } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Html, Environment } from '@react-three/drei'
import Scene from '../scene/Scene'
import type { WordWeight } from '@/app/lib/types'

THREE.ColorManagement.enabled = true
THREE.Cache.enabled = true

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

export const SceneCanvas = ({ words }: SceneCanvasProps) => {
  return (
    <div className="fixed inset-0 pointer-events-auto">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={'always'}
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 0], near: 1, far: 400, fov: 35 }}
        fallback={<div> Sorry, WebGL is not supported. </div>}
        orthographic={false}
        shadows={{ type: THREE.PCFShadowMap }}
      >
        <Environment preset="forest" />
        <Suspense fallback={<Loader />}>
          <Scene words={words} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default SceneCanvas
