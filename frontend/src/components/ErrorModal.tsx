import React from 'react';

interface ErrorModalProps {
    modalTitle: string;
    errorMessage: string;
    setErrorMessage: (errorMessage: string) => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ modalTitle, errorMessage, setErrorMessage }) => {
    return (
        errorMessage !== '' && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white p-4 rounded shadow-md max-w-sm relative">
                    <p className="text-center text-red-500 font-semibold mb-2">{modalTitle}</p>
                    <p className="text-center mb-4 text-gray-700 font-bold">{errorMessage}</p>
                    <button
                        className="absolute mr-1 mt-1 top-0 right-0 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => setErrorMessage('')}
                    >
                        X
                    </button>
                </div>
            </div>
        )
    );
};

export default ErrorModal;