import { useGalleryContext } from '../../hooks/useGalleryContext'
import PaintingMesh from '../Painting/PaintingMesh'
import { calculateTargetPosition } from '../../utils/shapeTransitions'
import { useRef } from 'react'
import * as THREE from 'three'

function FragmentMode() {
    const { paintings } = useGalleryContext()
    const groupRef = useRef<THREE.Group>(null)


    return (
        <group ref={groupRef}>
            {paintings.map((painting, index) => (
                <PaintingMesh
                    key={painting._id}
                    painting={painting}
                    targetPosition={calculateTargetPosition('fragment', index, paintings.length)}
                    index={index}
                />
            ))}
        </group>
    )
}

export default FragmentMode
