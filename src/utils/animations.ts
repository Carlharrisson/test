import * as THREE from "three";
import { GalleryMode } from "../types";
import gsap from "gsap";

export interface AnimationConfig {
  targetPosition: THREE.Vector3;
  targetScale: THREE.Vector3;
  targetRotation: THREE.Euler;
  index: number;
  mode: GalleryMode;
  groupRef: THREE.Group;
  isInitialMount?: boolean;
  material?: THREE.Material;
}

export const animateToPosition = ({
  targetPosition,
  targetScale,
  targetRotation,
  index,
  groupRef,
  isInitialMount = false,
  material,
}: AnimationConfig) => {
  gsap.killTweensOf(groupRef.position);
  gsap.killTweensOf(groupRef.scale);
  gsap.killTweensOf(groupRef.rotation);

  if (isInitialMount && material) {
    const materialWithOpacity = material as THREE.Material & {
      opacity: number;
      transparent: boolean;
    };
    materialWithOpacity.transparent = true;
    materialWithOpacity.opacity = 0;

    gsap.to(materialWithOpacity, {
      opacity: 1,
      duration: 1,
      delay: index * 0.1,
      ease: "power2.inOut",
    });
  }

  gsap.to(groupRef.position, {
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
    duration: 1.2,
    ease: "power3.inOut",
    delay: index * 0.04,
  });

  gsap.to(groupRef.scale, {
    x: targetScale.x,
    y: targetScale.y,
    z: targetScale.z,
    duration: 1.2,
    ease: "power3.inOut",
    delay: index * 0.04,
  });

  gsap.to(groupRef.rotation, {
    x: targetRotation.x,
    y: targetRotation.y,
    z: targetRotation.z,
    duration: 1.2,
    ease: "power3.inOut",
    delay: index * 0.04,
  });
};

export const animateHover = (
  meshRef: THREE.Mesh<THREE.PlaneGeometry>,
  baseHeight: number,
  aspectRatio: number,
  isEntering: boolean
) => {
  const scale = isEntering ? 1.1 : 1;
  const newHeight = baseHeight * scale;
  const newWidth = newHeight * aspectRatio;
  const currentWidth = meshRef.geometry.parameters.width;
  const currentHeight = meshRef.geometry.parameters.height;

  gsap.to(
    {
      width: currentWidth,
      height: currentHeight,
    },
    {
      width: newWidth,
      height: newHeight,
      duration: 0.6,
      ease: "power2.inOut",
      onUpdate: function () {
        meshRef.geometry.dispose();
        meshRef.geometry = new THREE.PlaneGeometry(
          this.targets()[0].width,
          this.targets()[0].height
        );
      },
    }
  );
};
