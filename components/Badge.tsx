import React from 'react';

interface BadgeProps {
    imageSrc: string;
    title: string;
}

const Badge: React.FC<BadgeProps> = ({ imageSrc, title }) => {
    return (
        <div className="h-28 w-20 rounded  shadow-lg bg-[#DCEDFF]">
            {/* Image of the badge */}
            <img  src={imageSrc} alt={title} />
            <div className="px-2 py-1">
                {/* Name of the badge */}
                <div className="font-bold  text-lg font-garamond text-[#0A2463]">{title}</div>
            </div>
        </div>
    );
};

export default Badge;