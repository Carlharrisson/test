import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { ThreeEvent } from '@react-three/fiber'
import { useTexture, Billboard } from '@react-three/drei'
import { useGalleryContext } from '../../hooks/useGalleryContext'
import { Painting } from '../../types'
import { animateToPosition, animateHover } from '../../utils/animations'
import { TargetTransform } from '../../utils/shapeTransitions'


interface PaintingMeshProps {
    painting: Painting
    targetPosition: TargetTransform
    index: number
}

function PaintingMesh({ painting, targetPosition, index }: PaintingMeshProps) {
    const groupRef = useRef<THREE.Group>(null)
    const meshRef = useRef<THREE.Mesh<THREE.PlaneGeometry>>(null)
    const { setSelectedPainting, displayMode } = useGalleryContext()
    const texture = useTexture(painting.imageUrl)
    const [aspectRatio, setAspectRatio] = useState(1)
    const baseHeight = 3
    const initialMountRef = useRef(true)

    const initialPositionRef = useRef(targetPosition)

    useEffect(() => {
        if (texture) {
            const image = texture.image
            setAspectRatio(image.width / image.height)
        }
    }, [texture])

    useEffect(() => {
        if (!groupRef.current || !meshRef.current) return

        const positionToUse = displayMode === 'scattered'
            ? initialPositionRef.current
            : targetPosition

        animateToPosition({
            targetPosition: positionToUse.position,
            targetScale: positionToUse.scale,
            targetRotation: positionToUse.rotation,
            index,
            mode: displayMode,
            groupRef: groupRef.current,
            isInitialMount: initialMountRef.current,
            material: meshRef.current.material as THREE.Material
        })

        initialMountRef.current = false
    }, [targetPosition, displayMode, index])

    const width = baseHeight * aspectRatio

    const meshProps = displayMode === 'scattered'
        ? {
            onClick: (e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation()
                setSelectedPainting(painting)
            },
            onPointerEnter: () => {
                if (!meshRef.current) return
                animateHover(meshRef.current, baseHeight, aspectRatio, true)
            },
            onPointerLeave: () => {
                if (!meshRef.current) return
                animateHover(meshRef.current, baseHeight, aspectRatio, false)
            }
        }
        : {}

    return (
        <group ref={groupRef}>
            <Billboard
                follow={displayMode === 'scattered'}
                lockX={displayMode !== 'scattered'}
                lockY={displayMode !== 'scattered'}
                lockZ={displayMode !== 'scattered'}
            >
                <mesh
                    ref={meshRef}
                    {...meshProps}
                >
                    <planeGeometry args={[width, baseHeight]} />
                    <meshBasicMaterial
                        map={texture}
                        side={THREE.DoubleSide}
                        transparent
                    />
                </mesh>
            </Billboard>
        </group>
    )
}

export default PaintingMesh