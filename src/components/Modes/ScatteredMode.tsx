import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGalleryContext } from '../../hooks/useGalleryContext';
import { createEntryAnimation } from '../../utils/animations';

interface ScatteredModeProps {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
}

function ScatteredMode({ scene }: ScatteredModeProps) {
    const { paintings, setSelectedPainting } = useGalleryContext();
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        if (hasAnimatedRef.current) return;

        scene.children = scene.children.filter(child => !(child instanceof THREE.Mesh));
        const meshes: THREE.Mesh[] = [];

        paintings.forEach((painting) => {
            const texture = new THREE.TextureLoader().load(painting.imageUrl);
            texture.colorSpace = THREE.SRGBColorSpace;

            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(2, 2),
                new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide
                })
            );

            // Calculate scattered position
            const x = (Math.random() - 0.5) * 40;
            const y = (Math.random() - 0.5) * 40;
            const z = (Math.random() - 0.5) * 40;

            // Store target position in userData
            plane.userData = {
                paintingId: painting.id,
                targetZ: z
            };

            plane.position.set(x, y, 50); // Start from far away
            plane.scale.set(0.1, 0.1, 0.1); // Start small

            scene.add(plane);
            meshes.push(plane);
        });

        // Run entry animation
        createEntryAnimation(meshes).then(() => {
            hasAnimatedRef.current = true;
        });

        return () => {
            hasAnimatedRef.current = false;
            scene.children = scene.children.filter(child => !(child instanceof THREE.Mesh));
        };
    }, [paintings, scene, setSelectedPainting]);

    return null;
}

export default ScatteredMode;

