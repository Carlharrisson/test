import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useGalleryContext } from '../../hooks/useGalleryContext'
import { Painting } from '../../types'
import gsap from 'gsap'

interface FragmentModeProps {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
}

function FragmentMode({ scene, camera }: FragmentModeProps) {
    const { paintings } = useGalleryContext()
    const rotationRef = useRef({ theta: 0, phi: 0 })
    const animationRef = useRef<gsap.core.Timeline>()
    const radius = 30

    useEffect(() => {
        scene.children = scene.children.filter(child => !(child instanceof THREE.Mesh))

        paintings.forEach((painting: Painting, index: number) => {
            const phi = Math.acos(-1 + (2 * index) / paintings.length)
            const theta = Math.sqrt(paintings.length * Math.PI) * phi

            const texture = new THREE.TextureLoader().load(painting.imageUrl)
            texture.colorSpace = THREE.SRGBColorSpace

            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(2, 2),
                new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide
                })
            )

            scene.add(plane)
            plane.userData = {
                paintingId: painting.id,
                initialPhi: phi,
                initialTheta: theta
            }

            // Initial position using the constant radius
            plane.position.x = Math.cos(theta) * Math.sin(phi) * radius
            plane.position.y = Math.sin(theta) * Math.sin(phi) * radius
            plane.position.z = Math.cos(phi) * radius
        })

        // Create infinite rotation animation
        const timeline = gsap.timeline({ repeat: -1 })

        timeline.to(rotationRef.current, {
            theta: Math.PI * 2,
            duration: 20,
            ease: "none"
        })
            .to(rotationRef.current, {
                phi: Math.PI * 2,
                duration: 30,
                ease: "none"
            }, 0) // The "0" means this animation starts at the same time

        animationRef.current = timeline

        // Update function
        const updatePositions = () => {
            scene.children.forEach(child => {
                if (child instanceof THREE.Mesh) {
                    const { initialPhi, initialTheta } = child.userData
                    const radius = 2

                    // Calculate new position with both rotations
                    const rotatedPhi = initialPhi + rotationRef.current.phi
                    const rotatedTheta = initialTheta + rotationRef.current.theta

                    child.position.x = Math.cos(rotatedTheta) * Math.sin(rotatedPhi) * radius
                    child.position.y = Math.sin(rotatedTheta) * Math.sin(rotatedPhi) * radius
                    child.position.z = Math.cos(rotatedPhi) * radius

                    // Make paintings face the camera
                    child.lookAt(camera.position)
                }
            })
        }

        // Add the update function to the animation
        gsap.ticker.add(updatePositions)

        return () => {
            if (animationRef.current) {
                animationRef.current.kill()
            }
            gsap.ticker.remove(updatePositions)
            scene.children = scene.children.filter(child => !(child instanceof THREE.Mesh))
        }
    }, [paintings, scene, camera])

    return null
}

export default FragmentMode

