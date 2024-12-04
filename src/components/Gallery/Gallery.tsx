import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { useGalleryContext } from '../../hooks/useGalleryContext'
import PaintingMesh from '../Painting/PaintingMesh'
import { calculateTargetPosition } from '../../utils/shapeTransitions'

function Gallery() {
    const { paintings, displayMode } = useGalleryContext()
    const groupRef = useRef<THREE.Group>(null)

    useEffect(() => {
        if (!groupRef.current) return

        // Kill any existing animations
        gsap.killTweensOf(groupRef.current.rotation)

        if (displayMode === 'prism' || displayMode === 'fragment') {
            const rotate = () => {
                gsap.to(groupRef.current!.rotation, {
                    y: groupRef.current!.rotation.y + Math.PI * 2,
                    x: groupRef.current!.rotation.x + Math.PI * 2,
                    duration: 10,
                    ease: 'none',
                    onComplete: rotate
                })
            }
            rotate()
        } else {
            // Reset rotation values before transitioning
            groupRef.current.rotation.y = groupRef.current.rotation.y % (Math.PI * 2)

            gsap.to(groupRef.current.rotation, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1.5,
                ease: 'power2.inOut'
            })
        }
    }, [displayMode])

    return (
        <group ref={groupRef}>
            {paintings.map((painting, index) => (
                <PaintingMesh
                    key={painting._id}
                    painting={painting}
                    targetPosition={calculateTargetPosition(displayMode, index, paintings.length)}
                    index={index}
                />
            ))}
        </group>
    )
}

export default Gallery 