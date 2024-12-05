import React from "react";
import { Bar } from "../pages/AllBarsPage";

interface BarDetailsProps {
  bar: Bar;
  onClose: () => void;
}

const BarDetails: React.FC<BarDetailsProps> = ({ bar, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md mx-auto">
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
        <p className="mt-4">Rating: {bar.rating} Stars</p>
        <p>Votes: {bar.ratingCount}</p>

        {/* Visa adressen här */}
        {bar.address && (
          <p className="mt-2 text-gray-600">Address: {bar.address}</p>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BarDetails;
