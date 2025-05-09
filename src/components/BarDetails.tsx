import React, { useState, useEffect } from "react";
import ratingbeer from "../assets/img/beer-1669275_960_720.webp";
import halfbeer from "../assets/img/halfbier.png";
//import ol from "../assets/img/ol.png";

interface BarDetailsProps {
  bar: {
    name: string;
    photoUrl: string | null;
    rating: number;
    ratingCount: number;
    address: string | null;
    openingHours?: string[];
  };
  onClose: () => void;
}

const BarDetails: React.FC<BarDetailsProps> = ({ bar, onClose }) => {
  const [showOpeningHours, setShowOpeningHours] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const generatePhotoUrl = async () => {
      if (bar.photoUrl) {
        // If it's already a full URL (old data), use it directly
        if (bar.photoUrl.startsWith("http")) {
          setImageUrl(bar.photoUrl);
          return;
        }

        // Otherwise, it's a photo reference, so generate the URL
        const baseUrl = "https://maps.googleapis.com/maps/api/place/photo";
        const maxWidth = 400;
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        const url = `${baseUrl}?maxwidth=${maxWidth}&photo_reference=${bar.photoUrl}&key=${apiKey}`;
        setImageUrl(url);
      }
    };

    generatePhotoUrl();
  }, [bar.photoUrl]);

  const renderRatingImages = (rating: number) => {
    const images = [];
    const fullBeers = Math.floor(rating);
    const hasHalfBeer = rating % 1 >= 0.5;

    for (let i = 0; i < fullBeers; i++) {
      images.push(
        <img
          key={`full-${i}`}
          src={ratingbeer}
          alt="Full Beer"
          className="h-6 w-6"
        />
      );
    }

    if (hasHalfBeer) {
      images.push(
        <img key="half" src={halfbeer} alt="Half Beer" className="h-6 w-6" />
      );
    }

    return images;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-200 opacity-90 rounded-lg p-6 max-w-md mx-auto">
        <h2 className="text-2xl">{bar.name}</h2>
        {imageUrl ? (
          <img
            src={imageUrl}
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

        {bar.openingHours && bar.openingHours.length > 0 && (
          <div className="mt-4">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setShowOpeningHours(!showOpeningHours)}
            >
              <span className="text-lg font-semibold">
                {showOpeningHours ? "Hide Opening Hours" : "Show Opening Hours"}
              </span>
              <span className="ml-2">{showOpeningHours ? "▲" : "▼"}</span>
            </div>

            {showOpeningHours && (
              <div className="mt-2">
                <h3 className="font-semibold text-gray-700">Opening Hours:</h3>
                <ul className="list-disc pl-5">
                  {bar.openingHours.map((hour, index) => (
                    <li key={index} className="text-gray-600">
                      {hour}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="bg-red-500 opacity-90 mt-4 px-4 py-2 rounded-lg text-white"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};

export default BarDetails;
