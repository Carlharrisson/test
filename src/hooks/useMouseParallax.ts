import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export const useMouseParallax = (
  intensity: number = 0.1,
  damping: number = 0.1
) => {
  const { camera } = useThree();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const targetRotation = useRef(new THREE.Euler(0, 0, 0));
  const currentRotation = useRef(new THREE.Euler(0, 0, 0));

  useEffect(() => {
    if (isMobile) return; // Disable on mobile

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      targetRotation.current.y = x * intensity;
      targetRotation.current.x = y * intensity;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      // Smoothly interpolate current rotation towards target rotation
      currentRotation.current.x +=
        (targetRotation.current.x - currentRotation.current.x) * damping;
      currentRotation.current.y +=
        (targetRotation.current.y - currentRotation.current.y) * damping;

      // Apply rotation to camera
      camera.rotation.x = currentRotation.current.x;
      camera.rotation.y = currentRotation.current.y;

      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [camera, intensity, damping, isMobile]);
};
