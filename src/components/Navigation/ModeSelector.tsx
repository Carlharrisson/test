import React from 'react';
import { useGalleryContext } from '../../hooks/useGalleryContext';
import { GalleryMode } from '../../types/index';

const ModeSelector: React.FC = () => {
    const { displayMode, setDisplayMode } = useGalleryContext();

    const modes: GalleryMode[] = ['scattered', 'prism', 'fragment'];

    return (
        <div className="flex space-x-2">
            {modes.map((mode) => (
                <button
                    key={mode}
                    className={`px-4 py-2 rounded-full font-space ${displayMode === mode
                        ? 'bg-black text-white'
                        : 'bg-white text-black border border-black'
                        }`}
                    onClick={() => setDisplayMode(mode)}
                >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
            ))}
        </div>
    );
};

export default ModeSelector;
