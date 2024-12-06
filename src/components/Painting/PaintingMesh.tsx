import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { ThreeEvent } from '@react-three/fiber'
import { useTexture, Billboard } from '@react-three/drei'
import { useGalleryContext } from '../../hooks/useGalleryContext'
import { Painting } from '../../types'
import { animateToPosition, animateHover } from '../../utils/animations'
import { TargetTransform } from '../../utils/shapeTransitions'
import { urlFor } from '../../lib/sanity'


interface PaintingMeshProps {
    painting: Painting
    targetPosition: TargetTransform
    index: number
}

function PaintingMesh({ painting, targetPosition, index }: PaintingMeshProps) {
    const groupRef = useRef<THREE.Group>(null)
    const meshRef = useRef<THREE.Mesh<THREE.PlaneGeometry>>(null)
    const { setSelectedPainting, displayMode } = useGalleryContext()
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    // Handle both image and imageUrl cases
    const imageSource = painting.image || painting.imageUrl
    const imageUrl = imageSource ? (
        typeof imageSource === 'string'
            ? imageSource
            : urlFor(imageSource)
                .width(isMobile ? 600 : 800)
                .quality(isMobile ? 50 : 60)
                .format('webp')
                .url()
    ) : ''

    const texture = useTexture(imageUrl, (texture) => {
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.needsUpdate = true
    })
    const [aspectRatio, setAspectRatio] = useState(1)
    const baseHeight = 3
    const initialMountRef = useRef(true)

    const initialPositionRef = useRef(targetPosition)

    const planeSegments = isMobile ? 1 : 2

    useEffect(() => {
        if (texture) {
            const image = texture.image
            setAspectRatio(image.width / image.height)
        }
    }, [texture, imageUrl, painting.title])

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

    useEffect(() => {
        if (!meshRef.current) return;

        // Set renderOrder based on z-position (further back renders first)
        const zPos = groupRef.current?.position.z || 0;
        meshRef.current.renderOrder = -zPos;
    }, [targetPosition.position.z]);

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
                    <planeGeometry args={[width, baseHeight, planeSegments, planeSegments]} />
                    <meshBasicMaterial
                        map={texture}
                        side={THREE.FrontSide}
                        transparent={true}
                        depthTest={true}
                        depthWrite={true}
                        alphaTest={0.5}
                    />
                </mesh>
            </Billboard>
        </group>
    )
}

export default PaintingMesh