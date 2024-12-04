import { useGalleryContext } from '../../hooks/useGalleryContext'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

function PaintingModal() {
    const { selectedPainting, setSelectedPainting, paintings } = useGalleryContext()
    const modalRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const isAnimatingRef = useRef(false)
    const [isInitialMount, setIsInitialMount] = useState(true)

    const currentIndex = paintings.findIndex(p => p._id === selectedPainting?._id)

    useEffect(() => {
        if (!modalRef.current || !contentRef.current) return

        if (selectedPainting && isInitialMount) {
            isAnimatingRef.current = true

            const tl = gsap.timeline({
                onComplete: () => {
                    isAnimatingRef.current = false
                    setIsInitialMount(false)
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
        }
    }, [selectedPainting, isInitialMount])

    const animateToNewPainting = (newPainting: typeof selectedPainting) => {
        if (!contentRef.current || isAnimatingRef.current) return

        isAnimatingRef.current = true
        const tl = gsap.timeline({
            onComplete: () => {
                setSelectedPainting(newPainting)
                isAnimatingRef.current = false
            }
        })

        tl.to(contentRef.current, {
            x: -50,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut"
        }).set(contentRef.current, {
            x: 50
        }).to(contentRef.current, {
            x: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.inOut"
        })
    }

    const handlePrevious = () => {
        if (isAnimatingRef.current || currentIndex === -1) return
        const newIndex = (currentIndex - 1 + paintings.length) % paintings.length
        animateToNewPainting(paintings[newIndex])
    }

    const handleNext = () => {
        if (isAnimatingRef.current || currentIndex === -1) return
        const newIndex = (currentIndex + 1) % paintings.length
        animateToNewPainting(paintings[newIndex])
    }

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
                setSelectedPainting(null)
                setIsInitialMount(true)
                isAnimatingRef.current = false
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

    if (!selectedPainting) return null

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-white/40"
            style={{ opacity: 0 }}
        >
            <button
                className="fixed px-4 py-2 text-sm transition-transform top-4 right-4 font-space hover:scale-105"
                onClick={handleClose}
            >
                Close
            </button>

            <button
                className="fixed hidden px-4 py-2 text-sm transition-transform -translate-y-1/2 md:block left-4 top-1/2 font-space hover:scale-105"
                onClick={handlePrevious}
            >
                Previous
            </button>

            <button
                className="fixed hidden px-4 py-2 text-sm transition-transform -translate-y-1/2 md:block right-4 top-1/2 font-space hover:scale-105"
                onClick={handleNext}
            >
                Next
            </button>

            <div className="fixed bottom-0 left-0 right-0 flex justify-between w-full p-4 bg-white/80 backdrop-blur-sm md:hidden">
                <button
                    className="px-4 py-2 text-sm transition-transform font-space hover:scale-105"
                    onClick={handlePrevious}
                >
                    Previous
                </button>
                <button
                    className="px-4 py-2 text-sm transition-transform font-space hover:scale-105"
                    onClick={handleNext}
                >
                    Next
                </button>
            </div>

            <div
                ref={contentRef}
                className="relative flex flex-col w-full max-w-6xl gap-4 p-4 mx-4 mb-20 md:mb-8 md:grid md:grid-cols-8 md:gap-8 md:p-8"
            >
                <div className="col-span-1 md:col-span-4 h-[50vh] md:h-[80vh] flex items-center justify-center">
                    <img
                        src={selectedPainting.imageUrl}
                        alt={selectedPainting.title}
                        className="object-contain w-full h-full rounded"
                    />
                </div>
                <div className="flex flex-col justify-center col-span-1 pb-4 md:col-span-3 md:pb-8">
                    <h2 className="mb-4 text-2xl font-bold md:text-3xl font-space">
                        {selectedPainting.title}
                    </h2>
                    <p className="mb-6 font-inter text-black/80">
                        {selectedPainting.description}
                    </p>
                    <div className="flex flex-wrap gap-2 md:gap-4">
                        <div className='px-3 py-1 text-sm transition-transform bg-black rounded-full md:px-4 md:py-2 md:text-base font-space text-warm-light hover:scale-105'>{selectedPainting.year}</div>
                        <div className='px-3 py-1 text-sm transition-transform bg-black rounded-full md:px-4 md:py-2 md:text-base font-space text-warm-light hover:scale-105'>{selectedPainting.medium}</div>
                        <div className='px-3 py-1 text-sm transition-transform bg-black rounded-full md:px-4 md:py-2 md:text-base font-space text-warm-light hover:scale-105'>{selectedPainting.size}</div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default PaintingModal
