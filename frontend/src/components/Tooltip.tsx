import React from 'react';

interface TooltipProps {
    hint: string;
}

const Tooltip: React.FC<TooltipProps> = ({ hint }) => {
    return (
        <small className="text-gray-500 text-xs ml-1">{ hint }</small>
    );
};

export default Tooltip;