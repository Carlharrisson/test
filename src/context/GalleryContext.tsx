import React, { createContext, useState, useEffect } from 'react';
import { GalleryMode, Painting } from '../types';
import { GalleryContextType } from './types';
import { client } from '../lib/sanity';

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

interface GalleryProviderProps {
    children: React.ReactNode;
    displayMode?: GalleryMode;
    setDisplayMode?: (mode: GalleryMode) => void;
    paintings?: Painting[];
    selectedPainting?: Painting | null;
    setSelectedPainting?: (painting: Painting | null) => void;
    setShowPaintingModal?: (show: boolean) => void;
    showPaintingModal?: boolean;
}

export function GalleryProvider({
    children,
    displayMode: externalDisplayMode,
    setDisplayMode: externalSetDisplayMode,
    paintings: externalPaintings,
    selectedPainting: externalSelectedPainting,
    setSelectedPainting: externalSetSelectedPainting
}: GalleryProviderProps) {
    const [internalDisplayMode, setInternalDisplayMode] = useState<GalleryMode>('scattered');
    const [internalPaintings, setInternalPaintings] = useState<Painting[]>([]);
    const [internalSelectedPainting, setInternalSelectedPainting] = useState<Painting | null>(null);

    useEffect(() => {
        if (!externalPaintings) {
            // Fetch paintings from Sanity
            const fetchPaintings = async () => {
                const result = await client.fetch(`
                    *[_type == "painting"] {
                        _id,
                        title,
                        description,
                        year,
                        medium,
                        size,
                        "imageUrl": image.asset->url
                    }
                `);
                setInternalPaintings(result);
            };

            fetchPaintings().catch(console.error);
        }
    }, [externalPaintings]);

    const value = {
        displayMode: externalDisplayMode ?? internalDisplayMode,
        setDisplayMode: externalSetDisplayMode ?? setInternalDisplayMode,
        paintings: externalPaintings ?? internalPaintings,
        setPaintings: setInternalPaintings,
        selectedPainting: externalSelectedPainting ?? internalSelectedPainting,
        setSelectedPainting: externalSetSelectedPainting ?? setInternalSelectedPainting
    };

    return (
        <GalleryContext.Provider value={value}>
            {children}
        </GalleryContext.Provider>
    );
}

export { GalleryContext };

