import React from 'react';

interface ArtistInfoProps {
    onClose: () => void;
}

const ArtistInfo: React.FC<ArtistInfoProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
            <div className="max-w-2xl p-8 text-white bg-black rounded-lg">
                <h2 className="mb-4 text-3xl font-bold font-space">About the Artist</h2>
                <p className="mb-4 font-inter">
                    Gustav is a contemporary artist known for his innovative approach to digital and traditional media.
                    His work explores the intersection of technology and human emotion, creating immersive experiences
                    that challenge the viewer's perception of reality.
                </p>
                <button
                    className="px-4 py-2 text-black bg-white rounded font-space"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ArtistInfo;

