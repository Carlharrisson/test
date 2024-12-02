import React, { createContext, useState } from 'react';
import { GalleryMode, Painting } from '../types';
import { GalleryContextType } from './types';

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export function GalleryProvider({ children }: { children: React.ReactNode }) {
    const [displayMode, setDisplayMode] = useState<GalleryMode>('scattered');
    const [paintings, setPaintings] = useState<Painting[]>([]);
    const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);

    const value = {
        displayMode,
        setDisplayMode,
        paintings,
        setPaintings,
        selectedPainting,
        setSelectedPainting
    };

    return (
        <GalleryContext.Provider value={value}>
            {children}
        </GalleryContext.Provider>
    );
}

export { GalleryContext };

