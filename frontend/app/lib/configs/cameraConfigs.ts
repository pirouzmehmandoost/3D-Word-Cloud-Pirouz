import * as THREE from 'three'

const cameraPosition = new THREE.Vector3(0, 0, 50)

const cameraConfigs = {
  POSITION: cameraPosition,
  NEAR: 1,
  FAR: 400,
  FOV: 35,
  MIN_POLAR_ANGLE: Math.PI / 2,
  MAX_POLAR_ANGLE: Math.PI / 8,
}

export default cameraConfigs
