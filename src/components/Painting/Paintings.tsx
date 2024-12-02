import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Painting as PaintingType } from '../../types/index';
import { useGalleryContext } from '../../hooks/useGalleryContext';
import { transitionToPrism, transitionToFragment, transitionToScattered } from '../../utils/shapeTransitions';

interface PaintingProps {
    painting: PaintingType;
    position: THREE.Vector3;
}

const Painting: React.FC<PaintingProps> = React.memo(({ painting, position }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { displayMode, setSelectedPainting } = useGalleryContext();
    const [isLoaded, setIsLoaded] = useState(false);
    const prevModeRef = useRef(displayMode);

    useEffect(() => {
        if (!meshRef.current || !isLoaded) return;
        if (prevModeRef.current === displayMode) return;

        const mesh = meshRef.current;
        prevModeRef.current = displayMode;

        switch (displayMode) {
            case 'prism':
                transitionToPrism([mesh]);
                break;
            case 'fragment':
                transitionToFragment([mesh]);
                break;
            case 'scattered':
                transitionToScattered([mesh]);
                break;
        }
    }, [displayMode, isLoaded]);

    useEffect(() => {
        if (!meshRef.current) return;

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            painting.imageUrl,
            (texture) => {
                if (meshRef.current) {
                    texture.colorSpace = THREE.SRGBColorSpace;
                    const material = new THREE.MeshBasicMaterial({
                        map: texture,
                        side: THREE.DoubleSide
                    });
                    meshRef.current.material = material;
                    meshRef.current.position.copy(position);
                    setIsLoaded(true);
                }
            },
            undefined,
            (error) => {
                console.error('Error loading texture:', error);
            }
        );
    }, [painting.imageUrl, position]);

    const handleClick = (event: MouseEvent) => {
        event.stopPropagation();
        setSelectedPainting(painting);
    };

    return (
        <mesh ref={meshRef} onClick={handleClick}>
            <planeGeometry args={[2, 2]} />
            <meshBasicMaterial color="white" side={THREE.DoubleSide} />
        </mesh>
    );
});

export default Painting;

