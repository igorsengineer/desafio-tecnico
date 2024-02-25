import React from 'react';

interface CustomButtonProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

const CustomButton: React.FC<CustomButtonProps> = ({ onClick }) => {
    return (
        <button
            className="w-5/6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={onClick}>
            Pagar
        </button>
    );
};

export default CustomButton;