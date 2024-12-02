import gsap from "gsap";
import * as THREE from "three";

export const animateToPosition = (
  object: THREE.Object3D,
  targetPosition: THREE.Vector3,
  duration: number = 0.8,
  delay: number = 0
) => {
  return new Promise<void>((resolve) => {
    gsap.to(object.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration,
      delay,
      ease: "cubic.inOut",
      onComplete: resolve,
    });
  });
};

export const animateRotation = (
  object: THREE.Object3D,
  targetRotation: THREE.Euler,
  duration: number = 1,
  delay: number = 0
) => {
  return new Promise<void>((resolve) => {
    gsap.to(object.rotation, {
      x: targetRotation.x,
      y: targetRotation.y,
      z: targetRotation.z,
      duration,
      delay,
      ease: "power2.inOut",
      onComplete: resolve,
    });
  });
};

export const animateScale = (
  object: THREE.Object3D,
  targetScale: number,
  duration: number = 0.8,
  delay: number = 0
) => {
  return new Promise<void>((resolve) => {
    gsap.to(object.scale, {
      x: targetScale,
      y: targetScale,
      z: targetScale,
      duration,
      delay,
      ease: "cubic.inOut",
      onComplete: resolve,
    });
  });
};

export const createEntryAnimation = (
  objects: THREE.Object3D[],
  duration: number = 1.5
) => {
  return new Promise<void>((resolve) => {
    let completedAnimations = 0;
    const totalAnimations = objects.length;

    objects.forEach((obj, index) => {
      // Start from far away and scaled down
      obj.position.z = 50;
      obj.scale.set(0.1, 0.1, 0.1);

      // Add staggered delay based on index
      const staggerDelay = index * 0.1;

      // Animate position and scale simultaneously
      gsap.to(obj.position, {
        z: obj.userData.targetZ || 0,
        duration,
        delay: staggerDelay,
        ease: "power2.out",
        onComplete: () => {
          completedAnimations++;
          if (completedAnimations === totalAnimations) {
            resolve();
          }
        },
      });

      gsap.to(obj.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration,
        delay: staggerDelay,
        ease: "back.out(1.7)",
      });
    });
  });
};
