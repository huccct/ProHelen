'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

function GridMesh() {
  const linesRef = useRef<THREE.LineSegments>(null)
  const [primaryColor, setPrimaryColor] = useState('#3b82f6') // fallback

  const gridSizeX = 50
  const gridSizeY = 30

  useEffect(() => {
    const updatePrimaryColor = () => {
      if (typeof window !== 'undefined') {
        const styles = getComputedStyle(document.documentElement)
        const primaryValue = styles.getPropertyValue('--primary').trim()

        let color = '#3b82f6'
        if (primaryValue.includes('oklch')) {
          const isDark = document.documentElement.classList.contains('dark')
          color = isDark ? '#e5e5e5' : '#1a1a1a'
        }
        setPrimaryColor(color)
      }
    }

    updatePrimaryColor()

    const observer = new MutationObserver(updatePrimaryColor)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions: number[] = []

    const fov = 75 * Math.PI / 180
    const distance = 6
    const viewHeight = 2 * distance * Math.tan(fov / 2)
    const aspectRatio = typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 16 / 9
    const viewWidth = viewHeight * aspectRatio

    const extendedHeight = viewHeight * 1.2
    const extendedWidth = viewWidth * 1.2

    for (let i = 0; i <= gridSizeY; i++) {
      const y = (i / gridSizeY - 0.5) * extendedHeight
      positions.push(-extendedWidth / 2, y, 0)
      positions.push(extendedWidth / 2, y, 0)
    }

    for (let i = 0; i <= gridSizeX; i++) {
      const x = (i / gridSizeX - 0.5) * extendedWidth
      positions.push(x, -extendedHeight / 2, 0)
      positions.push(x, extendedHeight / 2, 0)
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geo
  }, [gridSizeX, gridSizeY])

  const material = useMemo(() => {
    const color = new THREE.Color(primaryColor)

    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: color },
        opacity: { value: 0.45 },
      },
      vertexShader: `
        uniform float time;
        varying vec3 vPosition;
        
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float opacity;
        uniform vec3 baseColor;
        varying vec3 vPosition;
        
                  void main() {
            float basePulse = 0.5 + 0.6 * sin(time * 0.5 + vPosition.x * 0.6 + vPosition.y * 0.6);
            
            float finalOpacity = opacity * basePulse;
          
          gl_FragColor = vec4(baseColor, finalOpacity);
        }
      `,
      transparent: true,
    })
  }, [primaryColor])

  useFrame((state) => {
    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.ShaderMaterial
      mat.uniforms.time.value = state.clock.elapsedTime

      const color = new THREE.Color(primaryColor)
      mat.uniforms.baseColor.value = color
    }
  })

  return (
    <lineSegments ref={linesRef} geometry={geometry} material={material} />
  )
}

function CentralGrid() {
  return (
    <div className="absolute top-[20%] left-[15%] right-[15%] bottom-[20%] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
        <GridMesh />
      </Canvas>
    </div>
  )
}

export function CornerGrids() {
  return <CentralGrid />
}
