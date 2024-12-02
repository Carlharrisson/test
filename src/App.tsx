import React, { useState, useEffect } from 'react';
import Canvas from './components/Canvas/Canvas';
import ModeSelector from './components/Navigation/ModeSelector';
import ArtistInfo from './components/UI/ArtistInfo';
import PaintingModal from './components/UI/PaintingModal';
import { GalleryProvider } from './context/GalleryContext';
import { useGalleryContext } from './hooks/useGalleryContext';
import { paintingsData } from './data/paintings';

const App: React.FC = () => {
  return (
    <GalleryProvider>
      <GalleryInitializer />
    </GalleryProvider>
  );
};

const GalleryInitializer: React.FC = () => {
  const { setPaintings, selectedPainting, setSelectedPainting } = useGalleryContext();
  const [showArtistInfo, setShowArtistInfo] = useState(false);

  useEffect(() => {
    setPaintings(paintingsData);
  }, [setPaintings]);

  return (
    <div className="relative w-screen h-screen overflow-hidden text-black bg-white font-inter">
      <Canvas />
      <div className="absolute z-10 top-4 left-4">
        <ModeSelector />
      </div>
      <button
        className="absolute z-10 px-4 py-2 text-black bg-white rounded-full top-4 right-4 font-space"
        onClick={() => setShowArtistInfo(true)}
      >
        About the Artist
      </button>
      {showArtistInfo && <ArtistInfo onClose={() => setShowArtistInfo(false)} />}
      {selectedPainting && (
        <PaintingModal
          painting={selectedPainting}
          onClose={() => setSelectedPainting(null)}
        />
      )}
    </div>
  );
};

export default App;

