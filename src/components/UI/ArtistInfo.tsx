import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { client } from '../../lib/sanity'

interface ArtistInfoProps {
    onClose: () => void
}

interface Artist {
    name: string
    bio: string
    tags?: string[]
    socialLinks?: Array<{
        platform: string
        url: string
    }>
    email?: string
}

function ArtistInfo({ onClose }: ArtistInfoProps) {
    const [artist, setArtist] = useState<Artist | null>(null)
    const [error, setError] = useState<string | null>(null)
    const modalRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const isAnimatingRef = useRef(false)

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const result = await client.fetch(`
                    *[_type == "artist"][0] {
                        name,
                        bio,
                        tags,
                        socialLinks,
                        email
                    }
                `)
                console.log('Fetched artist data:', result)
                if (!result) {
                    setError('No artist data found')
                    return
                }
                setArtist(result)
            } catch (err) {
                console.error('Error fetching artist:', err)
                setError('Failed to fetch artist data')
            }
        }

        fetchArtist()
    }, [])

    useEffect(() => {
        if (!modalRef.current || !contentRef.current || isAnimatingRef.current) return

        isAnimatingRef.current = true
        const tl = gsap.timeline({
            onComplete: () => {
                isAnimatingRef.current = false
            }
        })

        tl.fromTo(modalRef.current,
            {
                opacity: 0,
                backdropFilter: 'blur(0px)'
            },
            {
                opacity: 1,
                backdropFilter: 'blur(20px)',
                duration: 0.8,
                ease: "easeInOutCubic",
            }
        )
            .fromTo(contentRef.current,
                {
                    y: 20,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: "easeInOutCubic"
                },
                "-=0.4"
            )
    }, [artist])

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleEscKey);
        return () => window.removeEventListener('keydown', handleEscKey);
    }, []);

    const handleClose = () => {
        if (!modalRef.current || !contentRef.current || isAnimatingRef.current) return

        isAnimatingRef.current = true
        const tl = gsap.timeline({
            onComplete: () => {
                isAnimatingRef.current = false
                onClose()
            }
        })

        tl.to(contentRef.current, {
            y: 20,
            opacity: 0,
            duration: 0.4,
            ease: "easeInOutCubic"
        })
            .to(modalRef.current, {
                opacity: 0,
                backdropFilter: 'blur(0px)',
                duration: 0.6,
                ease: "easeInOutCubic"
            }, "-=0.2")
    }

    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40">
                <div className="p-4 bg-white rounded-lg shadow-lg">
                    <p className="text-red-500">{error}</p>
                    <button
                        className="px-4 py-2 mt-4 text-sm text-white bg-black rounded-full"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        )
    }

    if (!artist) return null

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto backdrop-blur-xl bg-white/40"
            style={{ opacity: 1 }}
        >
            <button
                className="fixed px-4 py-2 text-sm transition-transform top-4 right-4 font-space hover:scale-105"
                onClick={handleClose}
            >
                Close
            </button>

            <div
                ref={contentRef}
                className="grid w-full max-w-6xl grid-cols-1 gap-4 p-4 mx-4 md:grid-cols-8 md:gap-8 md:p-8"
            >
                <div className="col-span-1 md:col-span-4">
                    <h2 className="mb-4 text-2xl font-bold md:text-3xl font-space">
                        {artist.name}
                    </h2>
                    <p className="mb-6 font-inter text-black/80">
                        {artist.bio}
                    </p>
                    {artist.email && (
                        <p className="mb-6 font-inter text-black/80">
                            Email: <a href={`mailto:${artist.email}`} className="underline hover:text-black/60">{artist.email}</a>
                        </p>
                    )}
                    {artist.tags && artist.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 md:gap-4">
                            {artist.tags.map((tag, index) => (
                                <div
                                    key={index}
                                    className='px-3 py-1 text-sm transition-transform bg-black rounded-full md:px-4 md:py-2 md:text-base font-space text-warm-light hover:scale-105'
                                >
                                    {tag}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ArtistInfo

