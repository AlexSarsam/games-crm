import * as THREE from 'three'

export function createCoin(type = 'coin') {
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32)

  let color = 0xffd700 //

  if (type === 'life') color = 0x4dff6a   // verde → vida
  if (type === 'speed') color = 0x00aaff  // azul → velocidad

  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.8,
    roughness: 0.2
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = Math.PI / 2
  mesh.position.y = 0.35

  mesh.userData = { type }
  return mesh
}
  