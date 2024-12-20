import { Canvas as R3FCanvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import Gallery from '../Gallery/Gallery'
import { GalleryProvider } from '../../context/GalleryContext'
import { useGalleryContext } from '../../hooks/useGalleryContext'
import { useMouseParallax } from '../../hooks/useMouseParallax'
import LoadingScreen from '../UI/LoadingScreen'

function Scene() {
    useMouseParallax(0.05, 0.05)

    return (
        <>
            <OrbitControls
                enableDamping
                dampingFactor={0.05}
                minDistance={5}
                maxDistance={50}
                enabled={false}
                enableZoom={true}
                enablePan={false}
                enableRotate={false}
            />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Gallery />
        </>
    )
}

function Canvas() {
    const { displayMode, setDisplayMode, paintings, setPaintings, selectedPainting, setSelectedPainting } = useGalleryContext()
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    const contextValue = {
        displayMode,
        setDisplayMode,
        paintings,
        setPaintings,
        selectedPainting,
        setSelectedPainting
    }

    return (
        <>
            <LoadingScreen />
            <Suspense fallback={null}>
                <R3FCanvas
                    camera={{
                        position: [0, 0, 30],
                        fov: 45,
                        near: 0.1,
                        far: 1000
                    }}
                    dpr={isMobile ? [1, 1.5] : [1, 2]}
                    performance={{ min: 0.5 }}
                    gl={{
                        powerPreference: "high-performance",
                        antialias: !isMobile,
                        stencil: false,
                        depth: true,
                        alpha: true
                    }}
                >
                    <GalleryProvider {...contextValue}>
                        <Scene />
                    </GalleryProvider>
                </R3FCanvas>
            </Suspense>
        </>
    )
}

export default Canvas