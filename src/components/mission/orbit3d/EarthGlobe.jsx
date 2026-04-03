import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

export const EarthGlobe = () => {
  const earthRef = useRef(null)
  const atmosphereRef = useRef(null)

  // Slow rotation
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.00005
    }
  })

  return (
    <group>
      {/* Outer glow/atmosphere */}
      <mesh ref={atmosphereRef} scale={1.08}>
        <Sphere args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#06B6D4"
          transparent
          opacity={0.1}
          wireframe={false}
        />
      </mesh>

      {/* Main Earth sphere */}
      <mesh ref={earthRef}>
        <Sphere args={[1, 64, 64]} />
        <meshPhongMaterial
          emissive="#1e40af"
          emissiveIntensity={0.2}
          shininess={5}
          map={createEarthTexture()}
        />
      </mesh>

      {/* Bright ring/atmosphere effect */}
      <mesh scale={1.04}>
        <Sphere args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#3B82F6"
          transparent
          opacity={0.08}
          wireframe={false}
        />
      </mesh>
    </group>
  )
}

// Create a procedural Earth texture
function createEarthTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024

  const ctx = canvas.getContext('2d')
  
  // Ocean blue
  ctx.fillStyle = '#1e3a8a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Simple continents (green patches)
  ctx.fillStyle = '#15803d'
  
  // North America
  ctx.beginPath()
  ctx.ellipse(200, 300, 120, 150, 0, 0, Math.PI * 2)
  ctx.fill()

  // South America
  ctx.beginPath()
  ctx.ellipse(300, 550, 60, 100, 0, 0, Math.PI * 2)
  ctx.fill()

  // Europe
  ctx.beginPath()
  ctx.ellipse(700, 250, 80, 60, 0, 0, Math.PI * 2)
  ctx.fill()

  // Africa
  ctx.beginPath()
  ctx.ellipse(900, 500, 100, 120, 0, 0, Math.PI * 2)
  ctx.fill()

  // Asia
  ctx.beginPath()
  ctx.ellipse(1300, 300, 200, 150, 0, 0, Math.PI * 2)
  ctx.fill()

  // Australia
  ctx.beginPath()
  ctx.ellipse(1450, 700, 70, 60, 0, 0, Math.PI * 2)
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}
