import React from 'react';

interface WarningFieldProps {
    warning: string;
}

const WarningField: React.FC<WarningFieldProps> = ({ warning }) => {
    return (
        <p className="text-red-500 text-center font-semibold">{ warning }</p>
    );
};

export default WarningField;