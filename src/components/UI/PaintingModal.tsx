import React from 'react';
import { Painting } from '../../types/index';

interface PaintingModalProps {
    painting: Painting;
    onClose: () => void;
}

const PaintingModal: React.FC<PaintingModalProps> = ({ painting, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
            <div className="max-w-2xl p-8 text-white bg-black rounded-lg">
                <h2 className="mb-4 text-3xl font-bold font-space">{painting.title}</h2>
                <img src={painting.imageUrl} alt={painting.title} className="w-full h-auto mb-4 rounded" />
                <p className="mb-4 font-inter">{painting.description}</p>
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

export default PaintingModal;

