import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number; // 0 to 5
    maxRating?: number;
    size?: number;
    interactive?: boolean;
    onChange?: (rating: number) => void;
    className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxRating = 5,
    size = 16,
    interactive = false,
    onChange,
    className = ""
}) => {
    const [hoverRating, setHoverRating] = React.useState<number | null>(null);

    const handleMouseEnter = (index: number) => {
        if (interactive) setHoverRating(index);
    };

    const handleMouseLeave = () => {
        if (interactive) setHoverRating(null);
    };

    const handleClick = (index: number) => {
        if (interactive && onChange) {
            onChange(index);
        }
    };

    const currentRating = hoverRating ?? rating;

    return (
        <div className={`flex items-center ${className}`} onMouseLeave={handleMouseLeave}>
            {[...Array(maxRating)].map((_, i) => {
                const starValue = i + 1;
                const filled = starValue <= Math.round(currentRating);

                return (
                    <button
                        key={i}
                        type="button"
                        disabled={!interactive}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform p-0.5`}
                        onMouseEnter={() => handleMouseEnter(starValue)}
                        onClick={() => handleClick(starValue)}
                    >
                        <Star
                            size={size}
                            className={`${filled ? 'fill-black text-black' : 'text-gray-300'
                                }`}
                        />
                    </button>
                );
            })}
        </div>
    );
};
