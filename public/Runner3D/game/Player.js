import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export function createPlayer() {
  const group = new THREE.Group()

  // Placeholder mientras carga el modelo
  const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9)
  const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc, metalness: 0.2, roughness: 0.4 })
  const placeholder = new THREE.Mesh(geometry, material)
  placeholder.position.set(0, 0.45, 0)
  group.add(placeholder)

  // Propiedades de juego
  group.userData = {
    laneX: 0,
    targetX: 0,
    isJumping: false,
    vy: 0,
    groundY: 0.45
  }

  // Cargar modelo GLTF
  const loader = new GLTFLoader()
  const modelUrl = new URL('../prison_realm__jujutsu_kaisen/scene.gltf', import.meta.url)

  loader.load(
    modelUrl.href,
    (gltf) => {
      const model = gltf.scene

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      // Escalar y alinear al suelo
      const box = new THREE.Box3().setFromObject(model)
      const size = new THREE.Vector3()
      box.getSize(size)

      if (size.y > 0) {
        const scale = 0.9 / size.y
        model.scale.setScalar(scale)
      }

      box.setFromObject(model)
      const minY = box.min.y
      model.position.y = -0.45 - minY

      group.remove(placeholder)
      group.add(model)
    },
    undefined,
    (error) => {
      console.error('Error cargando el modelo GLTF:', error)
    }
  )

  return group
}