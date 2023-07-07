import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating }) => {
  const MAX_STARS = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} style={{ color: '#FFD700' }} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key={fullStars} style={{ color: '#FFD700' }} />);
    }

    const remainingStars = MAX_STARS - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={fullStars + i + 1} />);
    }

    return stars;
  };

  return <div>{renderStars()}</div>;
};

export default StarRating;
