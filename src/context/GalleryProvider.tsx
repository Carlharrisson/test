import { ReactNode, useState } from 'react'
import { Painting } from '../types'
import { GalleryContext } from './GalleryContext'

interface GalleryProviderProps {
    children: ReactNode
}

export function GalleryProvider({ children }: GalleryProviderProps) {
    const [paintings, setPaintings] = useState<Painting[]>([])
    const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null)
    const [displayMode, setDisplayMode] = useState<'prism' | 'scattered' | 'fragment'>('prism')

    return (
        <GalleryContext.Provider
            value={{
                paintings,
                setPaintings,
                selectedPainting,
                setSelectedPainting,
                displayMode,
                setDisplayMode
            }}
        >
            {children}
        </GalleryContext.Provider>
    )
} 