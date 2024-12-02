import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGalleryContext } from '../../hooks/useGalleryContext';

interface MiniMapProps {
    mainScene: THREE.Scene;
    mainCamera: THREE.PerspectiveCamera;
}

function MiniMap({ mainScene, mainCamera }: MiniMapProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const { displayMode } = useGalleryContext();

    useEffect(() => {
        if (!canvasRef.current || displayMode !== 'scattered') return;

        const miniMapSize = 150;
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
            antialias: true
        });
        rendererRef.current = renderer;
        renderer.setSize(miniMapSize, miniMapSize);

        const camera = new THREE.OrthographicCamera(
            -15, 15,  // left, right
            15, -15,  // top, bottom
            0.1, 1000 // near, far
        );
        camera.position.set(0, 0, 20);
        camera.lookAt(0, 0, 0);

        const scene = new THREE.Scene();

        // Create dots for each mesh in the main scene
        mainScene.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
                const dot = new THREE.Mesh(
                    new THREE.CircleGeometry(0.3, 32),
                    new THREE.MeshBasicMaterial({
                        color: 0x000000,
                        transparent: true,
                        opacity: 0.8
                    })
                );
                dot.position.copy(child.position);
                dot.position.z = 0;
                scene.add(dot);
            }
        });

        // Add camera indicator
        const cameraIndicator = new THREE.Mesh(
            new THREE.CircleGeometry(0.5, 32),
            new THREE.MeshBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 0.8
            })
        );
        scene.add(cameraIndicator);

        let animationFrameId: number;

        const animate = () => {
            if (displayMode === 'scattered') {
                animationFrameId = requestAnimationFrame(animate);
                cameraIndicator.position.x = mainCamera.position.x;
                cameraIndicator.position.y = mainCamera.position.y;
                renderer.render(scene, camera);
            }
        };
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            scene.clear();
        };
    }, [mainScene, mainCamera, displayMode]);

    if (displayMode !== 'scattered') return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed bottom-4 left-4 w-[150px] h-[150px] rounded-lg border-2 border-black bg-white/50"
        />
    );
}

export default MiniMap; 