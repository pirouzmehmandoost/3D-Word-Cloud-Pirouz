'use client'

import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { easing } from 'maath'
import { getStableUnitValue } from '@utils/positionUtils'
import {
  MAX_FRAME_DELTA_SECONDS,
  FLOAT_AMPLITUDE,
  FLOAT_SPEED,
} from '@configs/animationConfigs'

const MIN_WORD_FONT_SIZE = 0.5
const WORD_WEIGHT_FONT_SCALE = 1.5
const COLOR_DAMPING = 1

type WordMeshProps = {
  word: string
  weight: number
  position: [number, number, number]
}

const defaultMeshStandardMaterialConfig = {
  flatShading: false,
  metalness: 0,
  roughness: 1,
  side: THREE.DoubleSide,
}

const WordMesh = ({ word, weight, position }: WordMeshProps) => {
  const textRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef(
    new THREE.MeshStandardMaterial({ ...defaultMeshStandardMaterialConfig }),
  )
  const targetColorRef = useRef(new THREE.Color('#FF0000'))
  // Convert the camera's world orientation into this mesh's local space so the
  // word stays readable while the parent word cloud group rotates.
  const parentWorldQuaternionRef = useRef(new THREE.Quaternion())
  const targetLocalQuaternionRef = useRef(new THREE.Quaternion())
  const basePositionRef = useRef(new THREE.Vector3(...position))
  // Stable per-word seed for the y-offset animation.
  const yOffsetRef = useRef(getStableUnitValue(word) * Math.PI * 2)

  const fontSize = MIN_WORD_FONT_SIZE + weight * WORD_WEIGHT_FONT_SCALE

  useLayoutEffect(() => {
    if (!textRef.current) return
    textRef.current.position.set(position[0], position[1], position[2])
    basePositionRef.current.set(position[0], position[1], position[2])
  }, [position])

  useFrame(({ camera, clock }, delta) => {
    const clampedDelta = Math.min(delta, MAX_FRAME_DELTA_SECONDS)

    if (!textRef.current || !materialRef.current) return

    if (textRef.current.parent) {
      textRef.current.parent.getWorldQuaternion(
        parentWorldQuaternionRef.current,
      )
      targetLocalQuaternionRef.current
        .copy(parentWorldQuaternionRef.current)
        .invert()
        .multiply(camera.quaternion)
      textRef.current.quaternion.copy(targetLocalQuaternionRef.current)
    }

    const yOffset =
      Math.sin(clock.elapsedTime * FLOAT_SPEED + yOffsetRef.current) *
      FLOAT_AMPLITUDE
    textRef.current.position.y = basePositionRef.current.y + yOffset

    // Map normalized weight to RGB. Low weight is blue, mid weight is green, high weight is red.
    targetColorRef.current.setRGB(
      weight,
      1 - Math.abs(weight - 0.5) * 2,
      1 - weight,
    )
    easing.dampC(
      materialRef.current.color,
      targetColorRef.current,
      COLOR_DAMPING,
      clampedDelta,
    )
  })

  return (
    <Text ref={textRef} fontSize={fontSize} anchorX="center" anchorY="middle">
      {word}
      <meshStandardMaterial ref={materialRef} />
    </Text>
  )
}
export default WordMesh
