import React from "react";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const maxStars = 5;
  const fullStars = Math.floor(rating);
  const partialStarWidth = (rating - fullStars) * 100;

  return (
    <div className="rating flex-align-center">
      <div className="rating__container flex gap-5">
        {[...Array(maxStars)].map((_, index) => {
          if (index < fullStars) {
            return (
              <span key={index} style={{ color: "gold", fontSize: "20px" }}>
                ★
              </span>
            );
          } else if (index === fullStars && partialStarWidth > 0) {
            return (
              <div
                key={index}
                style={{ position: "relative", display: "inline-block" }}
              >
                <span style={{ color: "lightgray", fontSize: "20px" }}>★</span>
                <span
                  style={{
                    position: "absolute",
                    overflow: "hidden",
                    width: `${partialStarWidth}%`,
                    top: 0,
                    left: 0,
                    color: "gold",
                    fontSize: "20px",
                  }}
                >
                  ★
                </span>
              </div>
            );
          } else {
            return (
              <span
                key={index}
                style={{ color: "lightgray", fontSize: "20px" }}
              >
                ★
              </span>
            );
          }
        })}
      </div>
      <p className="fz-16 ml-10">{rating}</p>
    </div>
  );
};

export default StarRating;
