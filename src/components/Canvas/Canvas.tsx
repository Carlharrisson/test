import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGalleryContext } from '../../hooks/useGalleryContext';
import ScatteredMode from '../Modes/ScatteredMode';
import PrismMode from '../Modes/PrismMode';
import FragmentMode from '../Modes/FragmentMode';
import { usePanControls } from '../../hooks/usePanControls';
import MiniMap from '../MiniMap/MiniMap';

const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

    const { displayMode } = useGalleryContext();

    useEffect(() => {
        if (!canvasRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.z = 8;

        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!camera || !renderer) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    }, []);

    usePanControls(canvasRef, cameraRef);

    const renderMode = () => {
        if (!sceneRef.current || !cameraRef.current) return null;

        switch (displayMode) {
            case 'scattered':
                return <ScatteredMode scene={sceneRef.current} camera={cameraRef.current} />;
            case 'prism':
                return <PrismMode scene={sceneRef.current} camera={cameraRef.current} />;
            case 'fragment':
                return <FragmentMode scene={sceneRef.current} camera={cameraRef.current} />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full h-full">
            <canvas ref={canvasRef} className="w-full h-full" />
            {renderMode()}
            {sceneRef.current && cameraRef.current && (
                <MiniMap mainScene={sceneRef.current} mainCamera={cameraRef.current} />
            )}
        </div>
    );
};

export default Canvas;
