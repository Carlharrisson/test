import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface PrismModeProps {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
}

function PrismMode({ scene }: PrismModeProps) {
    const rotationRef = useRef(0);
    const animationRef = useRef<gsap.core.Tween>();

    useEffect(() => {
        // Only handle rotation animation
        animationRef.current = gsap.to(rotationRef, {
            current: Math.PI * 2,
            duration: 15,
            ease: "none",
            repeat: -1,
            onUpdate: () => {
                scene.children.forEach(child => {
                    if (child instanceof THREE.Mesh) {
                        const initialAngle = child.userData.initialAngle || 0;
                        const currentAngle = initialAngle + rotationRef.current;
                        const radius = 5;

                        child.position.x = Math.cos(currentAngle) * radius;
                        child.position.y = Math.sin(currentAngle) * radius;
                        child.rotation.y = -currentAngle;
                    }
                });
            }
        });

        return () => {
            if (animationRef.current) animationRef.current.kill();
        };
    }, [scene]);

    return null;
}

export default PrismMode;
