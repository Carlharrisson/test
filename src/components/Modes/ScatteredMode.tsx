import { useGalleryContext } from '../../hooks/useGalleryContext'
import PaintingMesh from '../Painting/PaintingMesh'
import { calculateTargetPosition } from '../../utils/shapeTransitions'

function ScatteredMode() {
    const { paintings } = useGalleryContext()

    return (
        <group>
            {paintings.map((painting, index) => (
                <PaintingMesh
                    key={painting.id}
                    painting={painting}
                    targetPosition={calculateTargetPosition('scattered', index, paintings.length)}
                    index={index}
                />
            ))}
        </group>
    )
}

export default ScatteredMode