import React from "react";

interface StarRatingProps {
    rating: number;
    totalComments: number;
}

export const StarRating: React.FC<StarRatingProps> = ({rating, totalComments}) => {
    return (
        <div className="rating flex-align-center">
            <div className="rating__container flex gap-5">
                <span style={{color: "gold", fontSize: "16px"}}>
                ★
                </span>
            </div>
            <p className="fz-14 ml-10">{rating}<span className="color-gray">/{totalComments} отзывов</span></p>
        </div>
    );
};