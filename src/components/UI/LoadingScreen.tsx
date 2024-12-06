import { useProgress } from '@react-three/drei'
import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'

function LoadingScreen() {
    const { progress } = useProgress()
    const [show, setShow] = useState(true)
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLParagraphElement>(null)

    // Initial animation
    useEffect(() => {
        if (!containerRef.current || !textRef.current) return

        const tl = gsap.timeline()

        tl.fromTo(containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        ).fromTo(textRef.current,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 0.8,
                ease: "power2.out"
            }
        )
    }, [])

    // Exit animation
    useEffect(() => {
        if (progress === 100) {
            const tl = gsap.timeline({
                onComplete: () => setShow(false)
            })

            tl.to(textRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: "power2.in"
            }).to(containerRef.current, {
                opacity: 0,
                duration: 0.5
            })
        }
    }, [progress])

    if (!show) return null

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
            <p
                ref={textRef}
                className="text-sm tracking-wider font-space text-black/60"
            >
                Crafting the experience
            </p>
        </div>
    )
}

export default LoadingScreen 