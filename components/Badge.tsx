import React from 'react';

interface BadgeProps {
    imageSrc: string;
    title: string;
}

const Badge: React.FC<BadgeProps> = ({ imageSrc }) => {
    return (
        <div className="h-24 w-24 rounded-xl shadow-md bg-white border border-gray-300 flex items-center justify-center">
            <img
                src={imageSrc}
                alt="Badge"
                className="h-23 w-23 object-contain"
            />
        </div>
    );
};

export default Badge;
