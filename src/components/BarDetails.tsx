import React from "react";
import { Bar } from "../pages/AllBarsPage";
import ratingbeer from "../assets/img/beer-1669275_960_720.webp";
import halfbeer from "../assets/img/halfbier.png";

interface BarDetailsProps {
  bar: Bar;
  onClose: () => void;
}

const BarDetails: React.FC<BarDetailsProps> = ({ bar, onClose }) => {
  const renderRatingImages = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const images = [];

    for (let i = 0; i < fullStars; i++) {
      images.push(
        <img
          key={`full-${i}`}
          src={ratingbeer}
          alt="beer rating"
          className="w-6 h-6 inline-block"
        />
      );
    }

    if (hasHalfStar) {
      images.push(
        <img
          key="half"
          src={halfbeer}
          alt="half beer rating"
          className="w-6 h-6 inline-block"
        />
      );
    }

    return images;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-200 opacity-90 p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold">{bar.name}</h2>
        {bar.photoUrl ? (
          <img
            src={bar.photoUrl}
            alt={bar.name}
            className="w-full h-48 object-cover mt-4"
          />
        ) : (
          <div className="w-full h-48 bg-gray-400 mt-4"></div>
        )}
        <p className="mt-4 flex items-center">
          Rating:
          <span className="ml-2 flex">{renderRatingImages(bar.rating)}</span>
        </p>
        <p>Votes: {bar.ratingCount}</p>

        {bar.address && (
          <p className="mt-2 text-gray-600">Address: {bar.address}</p>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-gray-300 px-4 py-2 border-2 border-black rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BarDetails;
