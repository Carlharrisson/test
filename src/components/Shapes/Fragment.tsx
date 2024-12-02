import React, { useRef, useEffect } from 'react';
import { ShapeProps } from '../../types';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import '../types/three-jsx.d';

const Fragment: React.FC<ShapeProps> = ({ painting, position, rotation }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
        if (!meshRef.current) return;

        const texture = new TextureLoader().load(painting.imageUrl);
        meshRef.current.material = new THREE.MeshBasicMaterial({ map: texture });
        meshRef.current.position.copy(position);
        meshRef.current.rotation.copy(rotation);
    }, [painting, position, rotation]);

    return (
        <mesh ref={meshRef}>
            <tetrahedronGeometry args={[0.8, 0]} />
            <meshBasicMaterial color="white" />
        </mesh>
    );
};

export default Fragment;

