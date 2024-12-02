import * as THREE from "three";
import { animateToPosition, animateRotation, animateScale } from "./animations";
import { transitionGeometry } from "./geometryTransitions";

export const transitionToPrism = (objects: THREE.Object3D[]): Promise<void> => {
  return new Promise((resolve) => {
    let completedAnimations = 0;
    const totalAnimations = objects.length * 4; // position (2x), rotation, and scale animations per object
    let currentLayer = 0;
    let itemsInCurrentLayer = 1;
    let itemIndex = 0;

    const checkComplete = () => {
      completedAnimations++;
      if (completedAnimations === totalAnimations) {
        resolve();
      }
    };

    // Sort objects by their current position's distance from center
    const sortedObjects = [...objects].sort((a, b) => {
      const distA = a.position.length();
      const distB = b.position.length();
      return distA - distB;
    });

    // Stagger the animations
    sortedObjects.forEach((obj, index) => {
      if (!(obj instanceof THREE.Mesh)) return;

      const prismGeometry = new THREE.BoxGeometry(2, 2, 0.2);
      transitionGeometry(obj, prismGeometry);

      // Calculate position in pyramid
      if (itemIndex >= itemsInCurrentLayer) {
        currentLayer++;
        itemsInCurrentLayer = currentLayer * 4;
        itemIndex = 0;
      }

      const layerRadius = 5 - currentLayer * 1.5;
      const angle = (itemIndex / itemsInCurrentLayer) * Math.PI * 2;
      const height = currentLayer * 2;

      const x = Math.cos(angle) * layerRadius;
      const y = height;
      const z = Math.sin(angle) * layerRadius;

      const targetPosition = new THREE.Vector3(x, y, z);
      const targetRotation = new THREE.Euler(0, -angle, 0);

      // Add staggered delay based on index
      const staggerDelay = index * 0.1;

      // First move to center, then to final position
      const centerPosition = new THREE.Vector3(0, 0, 0);

      // Chain the animations using Promises
      animateToPosition(obj, centerPosition, 0.75, staggerDelay)
        .then(() => animateToPosition(obj, targetPosition, 0.75, 0))
        .then(checkComplete);

      animateRotation(obj, targetRotation, 1.5, staggerDelay).then(
        checkComplete
      );
      animateScale(obj, 1, 1.5, staggerDelay).then(checkComplete);

      itemIndex++;
    });
  });
};

export const transitionToFragment = (objects: THREE.Object3D[]) => {
  objects.forEach((obj, index) => {
    if (!(obj instanceof THREE.Mesh)) return;

    const fragmentGeometry = new THREE.TetrahedronGeometry(1, 0);
    transitionGeometry(obj, fragmentGeometry);

    const phi = Math.acos(-1 + (2 * index) / objects.length);
    const theta = Math.sqrt(objects.length * Math.PI) * phi;
    const radius = 8;

    const x = Math.cos(theta) * Math.sin(phi) * radius;
    const y = Math.sin(theta) * Math.sin(phi) * radius;
    const z = Math.cos(phi) * radius;

    const targetPosition = new THREE.Vector3(x, y, z);
    const targetRotation = new THREE.Euler(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    animateToPosition(obj, targetPosition, 1.5);
    animateRotation(obj, targetRotation, 1.5);
    animateScale(obj, 0.8, 1.5);
  });
};

export const transitionToScattered = (objects: THREE.Object3D[]) => {
  objects.forEach((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;

    // Create target plane geometry
    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    transitionGeometry(obj, planeGeometry);

    const x = (Math.random() - 0.5) * 10;
    const y = (Math.random() - 0.5) * 10;
    const z = (Math.random() - 0.5) * 5;
    const targetPosition = new THREE.Vector3(x, y, z);
    const targetRotation = new THREE.Euler(0, 0, 0);

    animateToPosition(obj, targetPosition);
    animateRotation(obj, targetRotation);
    animateScale(obj, 1);
  });
};
