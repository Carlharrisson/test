import * as THREE from "three";
import { GalleryMode } from "../types";

const existingPositions: THREE.Vector3[] = [];

// Constants for camera and viewport calculations
const cameraDistance = 20;
const cameraFOV = 75;
const aspectRatio = window.innerWidth / window.innerHeight;

// Calculate visible area at camera distance
const vFOV = (cameraFOV * Math.PI) / 180; // convert to radians
const visibleHeight = 2 * Math.tan(vFOV / 2) * cameraDistance;
const visibleWidth = visibleHeight * aspectRatio;

// Set usable area to be slightly smaller than visible area
const baseHeight = 3;
let usableWidth = visibleWidth * 0.8; // 80% of visible width
let usableHeight = visibleHeight * 0.8; // 80% of visible height
const usableDepth = 10;
const scatteredPositions = new Map<string, TargetTransform>();

// Add window resize handler
window.addEventListener("resize", () => {
  const newAspectRatio = window.innerWidth / window.innerHeight;
  const newVisibleHeight = 2 * Math.tan(vFOV / 2) * cameraDistance;
  const newVisibleWidth = newVisibleHeight * newAspectRatio;

  // Update usable dimensions
  usableWidth = newVisibleWidth * 0.8;
  usableHeight = newVisibleHeight * 0.8;

  // Clear existing positions to trigger recalculation
  existingPositions.length = 0;
  scatteredPositions.clear();
});

// Improved collision detection with perspective consideration
function checkCollision(
  position: THREE.Vector3,
  existingPositions: THREE.Vector3[],
  width: number,
  height: number
): boolean {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    // Simpler collision detection for mobile
    const padding = Math.max(width, height) * 0.8;
    return existingPositions.some(
      (existing) => position.distanceTo(existing) < padding
    );
  }

  const padding = Math.max(width, height) * 0.5;

  // Scale padding based on z-position (further objects need more padding)
  const getScaledPadding = (z: number) => {
    const distanceScale = (cameraDistance - z) / cameraDistance;
    return padding * distanceScale;
  };

  return existingPositions.some((existing) => {
    // Calculate scaled padding based on average z-position
    const avgZ = (position.z + existing.z) / 2;
    const scaledPadding = getScaledPadding(avgZ);

    // Project positions to screen space for overlap check
    const projectedDist = Math.sqrt(
      Math.pow(
        (position.x - existing.x) * (cameraDistance / (cameraDistance - avgZ)),
        2
      ) +
        Math.pow(
          (position.y - existing.y) *
            (cameraDistance / (cameraDistance - avgZ)),
          2
        )
    );

    return projectedDist < scaledPadding * 4; // Increased minimum separation
  });
}

// Rest of the position finding logic remains the same
function findValidPosition(
  existingPositions: THREE.Vector3[],
  width: number,
  height: number,
  usableWidth: number,
  usableHeight: number,
  attempts: number = 150
): THREE.Vector3 {
  const margin = Math.max(width, height) * 1.2; // Increased margin for better spacing
  const safeWidth = usableWidth - margin;
  const safeHeight = usableHeight - margin;
  const safeDepth = usableDepth - margin;

  const clampPosition = (pos: THREE.Vector3): THREE.Vector3 => {
    pos.x = Math.max(Math.min(pos.x, safeWidth / 2), -safeWidth / 2);
    pos.y = Math.max(Math.min(pos.y, safeHeight / 2), -safeHeight / 2);
    pos.z = Math.max(Math.min(pos.z, safeDepth / 2), -safeDepth / 2);
    return pos;
  };

  // Use golden ratio for better distribution
  const goldenRatio = 1.61803398875;

  for (let i = 0; i < attempts; i++) {
    const angle = i * goldenRatio * Math.PI * 2;
    const radius =
      (Math.sqrt(i / attempts) * Math.min(safeWidth, safeHeight)) / 2;

    // Modify z-position distribution to prefer positions closer to camera
    const zPosition = -safeDepth / 2 + Math.random() * (safeDepth / 3);

    const newPosition = new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      zPosition // Use modified z-position
    );

    const clampedPosition = clampPosition(newPosition);

    if (!checkCollision(clampedPosition, existingPositions, width, height)) {
      return clampedPosition;
    }
  }

  // Fallback position
  return clampPosition(
    new THREE.Vector3(
      (Math.random() - 0.5) * safeWidth,
      (Math.random() - 0.5) * safeHeight,
      (Math.random() - 0.5) * safeDepth
    )
  );
}

export interface ShapeConfig {
  mode: GalleryMode;
  index: number;
  total: number;
}

export interface TargetTransform {
  position: THREE.Vector3;
  scale: THREE.Vector3;
  rotation: THREE.Euler;
}

export function calculateTargetPosition(
  mode: GalleryMode,
  index: number,
  total: number,
  paintingId?: string
): TargetTransform {
  switch (mode) {
    case "scattered": {
      if (paintingId && scatteredPositions.has(paintingId)) {
        return scatteredPositions.get(paintingId)!;
      }

      const position = findValidPosition(
        existingPositions,
        baseHeight,
        baseHeight,
        usableWidth,
        usableHeight
      );

      existingPositions.push(position.clone());

      const transform = {
        position,
        scale: new THREE.Vector3(0.8, 0.8, 0.8),
        rotation: new THREE.Euler(
          (Math.random() - 0.5) * 0.2, // Reduced rotation for better readability
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        ),
      };

      if (paintingId) {
        scatteredPositions.set(paintingId, transform);
      }

      return transform;
    }

    case "prism": {
      const radius = 4;
      const imagesPerFace = Math.ceil(Math.sqrt(total / 6));
      const gridSize = imagesPerFace - 1 || 1;
      const face = Math.floor(index / (imagesPerFace * imagesPerFace));
      const faceIndex = index % (imagesPerFace * imagesPerFace);

      const row = Math.floor(faceIndex / imagesPerFace);
      const col = faceIndex % imagesPerFace;

      const xOffset = (col - gridSize / 2) * 4;
      const yOffset = (row - gridSize / 2) * 4;

      const position = new THREE.Vector3(xOffset, yOffset, radius);

      const currentFaceIndex = face % 6;
      switch (currentFaceIndex) {
        case 0: // Front face
          position.set(xOffset, yOffset, radius);
          break;
        case 1: // Right face
          position.set(radius, yOffset, -xOffset);
          break;
        case 2: // Back face
          position.set(-xOffset, yOffset, -radius);
          break;
        case 3: // Left face
          position.set(-radius, yOffset, xOffset);
          break;
        case 4: // Top face
          position.set(xOffset, radius, -yOffset);
          break;
        case 5: // Bottom face
          position.set(xOffset, -radius, yOffset);
          break;
      }

      // Complete rotation logic with all axes for each face
      const rotation = new THREE.Euler();
      switch (currentFaceIndex) {
        case 0: // Front face
          rotation.set(0, Math.PI, Math.PI);
          break;
        case 1: // Right face
          rotation.set(Math.PI, -Math.PI * 0.5, Math.PI);
          break;
        case 2: // Back face
          rotation.set(Math.PI, 0, Math.PI);
          break;
        case 3: // Left face
          rotation.set(Math.PI, Math.PI * 0.5, Math.PI);
          break;
        case 4: // Top face
          rotation.set(-Math.PI * 0.5, Math.PI, 0);
          break;
        case 5: // Bottom face
          rotation.set(Math.PI * 0.5, Math.PI, 0);
          break;
      }

      return {
        position,
        scale: new THREE.Vector3(0.7, 0.7, 0.7),
        rotation,
      };
    }

    case "fragment": {
      const radius = 5;
      const phi = Math.acos(-1 + (2 * index) / total);
      const theta = Math.sqrt(total * Math.PI) * phi;

      const position = new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );

      // Add slight random offset
      const randomOffset = 0.5;
      position.x += (Math.random() - 0.5) * randomOffset;
      position.y += (Math.random() - 0.5) * randomOffset;
      position.z += (Math.random() - 0.5) * randomOffset;

      // Calculate rotation to properly face outward from sphere center
      const normal = position.clone().normalize();
      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.lookAt(
        normal,
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1, 0)
      );
      const rotation = new THREE.Euler().setFromRotationMatrix(rotationMatrix);

      return {
        position,
        scale: new THREE.Vector3(0.4, 0.4, 0.4),
        rotation: new THREE.Euler(
          rotation.x,
          rotation.y,
          0 // Keep Z rotation at 0 to prevent tilting
        ),
      };
    }

    default:
      return {
        position: new THREE.Vector3(0, 0, 0),
        scale: new THREE.Vector3(0.7, 0.7, 0.7),
        rotation: new THREE.Euler(0, 0, 0),
      };
  }
}
