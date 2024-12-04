import { Canvas3DObject } from "@react-three/fiber";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: Canvas3DObject<THREE.Mesh>;
      planeGeometry: Canvas3DObject<THREE.PlaneGeometry>;
      boxGeometry: Canvas3DObject<THREE.BoxGeometry>;
      tetrahedronGeometry: Canvas3DObject<THREE.TetrahedronGeometry>;
      meshBasicMaterial: Canvas3DObject<THREE.MeshBasicMaterial>;
    }
  }
}
