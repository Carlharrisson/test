import * as THREE from "three";
import gsap from "gsap";

export const transitionGeometry = (
  mesh: THREE.Mesh,
  targetGeometry: THREE.BufferGeometry,
  duration: number = 0.8
) => {
  const currentGeometry = mesh.geometry;
  const targetPositions = targetGeometry.attributes.position.array;

  // Create temporary geometry for transition
  const tempGeometry = currentGeometry.clone();
  mesh.geometry = tempGeometry;

  // Animate vertices
  gsap.to(tempGeometry.attributes.position.array, {
    duration,
    ease: "power2.inOut",
    ...Array.from(targetPositions).reduce((acc, val, i) => {
      acc[i] = val;
      return acc;
    }, {} as { [key: number]: number }),
    onUpdate: () => {
      tempGeometry.attributes.position.needsUpdate = true;
    },
    onComplete: () => {
      mesh.geometry = targetGeometry;
    },
  });
};
