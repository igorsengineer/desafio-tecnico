import React from 'react';

interface SuccessModalProps {
    modalTitle: string;
    successMessage: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ modalTitle, successMessage }) => {
    return (
        successMessage !== '' && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-green-200 bg-opacity-75">
                <div className="bg-white p-4 rounded shadow-md max-w-sm relative">
                    <p className="text-center text-green-500 font-semibold mb-2">{modalTitle}</p>
                    <p className="text-center mb-4 text-gray-700 font-bold">{successMessage}</p>
                    <button
                        className="absolute mr-1 mt-1 top-0 right-0 bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => window.location.reload()}
                    >
                        X
                    </button>
                </div>
            </div>
        )
    );
};

export default SuccessModal;