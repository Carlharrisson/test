import { useGalleryContext } from '../../hooks/useGalleryContext'
import PaintingMesh from '../Painting/PaintingMesh'
import { calculateTargetPosition } from '../../utils/shapeTransitions'

function ScatteredMode() {
    const { paintings } = useGalleryContext()

    // Sort paintings by z-position (furthest first)
    const sortedPaintings = [...paintings].sort((a, b) => {
        const posA = calculateTargetPosition('scattered', paintings.indexOf(a), paintings.length)
        const posB = calculateTargetPosition('scattered', paintings.indexOf(b), paintings.length)
        return posB.position.z - posA.position.z
    })

    return (
        <group>
            {sortedPaintings.map((painting) => (
                <PaintingMesh
                    key={painting._id}
                    painting={painting}
                    targetPosition={calculateTargetPosition('scattered', paintings.indexOf(painting), paintings.length)}
                    index={paintings.indexOf(painting)}
                />
            ))}
        </group>
    )
}

export default ScatteredMode