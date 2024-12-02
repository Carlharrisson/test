import { useEffect, RefObject } from "react";
import * as THREE from "three";
import { useGalleryContext } from "./useGalleryContext";

export const usePanControls = (
  canvasRef: RefObject<HTMLCanvasElement>,
  cameraRef: RefObject<THREE.Camera>
) => {
  const { paintings, displayMode } = useGalleryContext();

  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    // Only reset camera position for prism and fragment modes
    if (displayMode === "prism" || displayMode === "fragment") {
      camera.position.set(0, 0, 20);
      return; // Don't set up pan controls for these modes
    }

    // For scattered mode, maintain the current camera position
    if (displayMode === "scattered" && camera.position.z === 20) {
      camera.position.set(0, 0, 8); // Set initial scattered mode position
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    // Calculate boundaries based on number of paintings
    const gridSize = Math.ceil(Math.sqrt(paintings.length));
    const spacing = 2.5;
    const totalWidth = (gridSize - 1) * spacing;
    const boundaryPadding = totalWidth;
    const maxX = totalWidth + boundaryPadding;
    const maxY = totalWidth + boundaryPadding;

    const clampPosition = (position: number, max: number) => {
      return Math.max(Math.min(position, max), -max);
    };

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      };

      const cameraMoveSpeed = 0.01;
      const newX = camera.position.x - deltaMove.x * cameraMoveSpeed;
      const newY = camera.position.y + deltaMove.y * cameraMoveSpeed;

      camera.position.x = clampPosition(newX, maxX);
      camera.position.y = clampPosition(newY, maxY);

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
    };
  }, [canvasRef, cameraRef, paintings, displayMode]);
};
