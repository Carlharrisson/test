import * as THREE from "three";

export type GalleryMode = "scattered" | "prism" | "fragment";

export interface Painting {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

export interface ShapeProps {
  painting: Painting;
  position: THREE.Vector3;
  rotation: THREE.Euler;
}
