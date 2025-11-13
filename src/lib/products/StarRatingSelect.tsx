import React, {FC, useState} from "react";
import styles from "./starRatingSelect.module.sass";

interface StarRatingSelectProps {
    rating: number;
    onRatingChange: (rating: number) => void;
    size?: number;
}

export const StarRatingSelect: FC<StarRatingSelectProps> = ({rating, onRatingChange, size = 24}) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className={styles.starRatingSelect}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`${styles.star} ${star <= (hoverRating || rating) ? styles.active : ""}`}
                    style={{fontSize: `${size}px`}}
                    onClick={() => onRatingChange(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

