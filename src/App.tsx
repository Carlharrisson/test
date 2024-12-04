import React, { useEffect, useRef } from 'react';
import { GalleryProvider } from './context/GalleryContext';
import Canvas from './components/Canvas/Canvas';
import ModeSelector from './components/Navigation/ModeSelector';
import ArtistInfo from './components/UI/ArtistInfo';
import PaintingModal from './components/UI/PaintingModal';
import gsap from 'gsap';

function App() {
  const [showArtistInfo, setShowArtistInfo] = React.useState(false);
  const aboutButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aboutButtonRef.current) return;

    gsap.fromTo(
      aboutButtonRef.current,
      {
        opacity: 0,
        y: -20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'easeInOutCubic',
        delay: 0.4,
      }
    );
  }, []);

  return (
    <GalleryProvider>
      <div className="relative w-screen h-screen overflow-hidden text-black bg-white font-inter">
        <div className="absolute inset-0">
          <Canvas />
        </div>
        <div className="absolute z-10 top-4 left-4 sm:left-6 md:left-8">
          <ModeSelector />
        </div>
        <button
          ref={aboutButtonRef}
          className="absolute z-10 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-white bg-black rounded-full top-4 right-4 sm:right-6 md:right-8 font-space opacity-0 hover:scale-105 transition-transform"
          onClick={() => setShowArtistInfo(true)}
        >
          About
        </button>
        {showArtistInfo && <ArtistInfo onClose={() => setShowArtistInfo(false)} />}
        <PaintingModal />
      </div>
    </GalleryProvider>
  );
}

export default App;