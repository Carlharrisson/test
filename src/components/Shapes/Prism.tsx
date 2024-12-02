import React, { useRef, useEffect } from 'react';
import { ShapeProps } from '../../types';
import { Mesh, BoxGeometry, MeshBasicMaterial, TextureLoader } from 'three';

const Prism: React.FC<ShapeProps> = ({ painting, position, rotation }) => {
    const meshRef = useRef<Mesh | null>(null);

    useEffect(() => {
        if (meshRef.current) {
            const geometry = new BoxGeometry(1, 1, 1);
            const texture = new TextureLoader().load(painting.imageUrl);
            const material = new MeshBasicMaterial({ map: texture });
            meshRef.current.geometry = geometry;
            meshRef.current.material = material;
            meshRef.current.position.copy(position);
            meshRef.current.rotation.copy(rotation);
        }
    }, [painting, position, rotation]);

    return <mesh ref={meshRef} />;
};

export default Prism;

