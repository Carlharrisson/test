import { useGalleryContext } from '../../hooks/useGalleryContext';
import { GalleryMode } from '../../types';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function ModeSelector() {
    const { displayMode, setDisplayMode } = useGalleryContext();
    const modes: GalleryMode[] = ['scattered', 'prism', 'fragment'];
    const containerRef = useRef<HTMLDivElement>(null);

    const handleModeChange = (newMode: GalleryMode) => {
        if (newMode === displayMode) return;
        setDisplayMode(newMode);
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const buttons = containerRef.current.querySelectorAll('button');

        gsap.fromTo(
            buttons,
            {
                opacity: 0,
                x: -20,
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'easeInOutCubic',
            }
        );
    }, []);

    return (
        <div ref={containerRef} className="flex flex-col gap-2 sm:flex-row sm:space-x-2">
            {modes.map((mode) => (
                <button
                    key={mode}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full font-space transition-all duration-300 opacity-0 
                        ${displayMode === mode
                            ? 'bg-black text-white scale-105'
                            : 'bg-white text-black border border-black hover:bg-black hover:text-white'
                        }`}
                    onClick={() => handleModeChange(mode)}
                >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
            ))}
        </div>
    );
}

export default ModeSelector;