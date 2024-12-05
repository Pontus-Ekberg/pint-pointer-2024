import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../service/Firebase";

const BarCard = ({
  name,
  photoUrl,
  address,
  onClose,
  onSave,
}: {
  name: string;
  photoUrl: string | null;
  address: string | null;
  onClose: () => void;
  onSave: () => void;
}) => {
  const navigate = useNavigate();

  const handleGrabADrinkClick = () => {
    onSave();
    const user = auth.currentUser;
    if (user) {
      navigate("/profile");
    }
  };

  return (
    <div className="bg-gray-200 z-40 border-2 border-black p-10 shadow-md absolute top-10">
      <h2 className="text-xl font-semibold">{name}</h2>

      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          className="w-40 h-40 mx-auto object-cover rounded-md mt-2"
        />
      ) : (
        <p>No photo available</p>
      )}

      {address && <p className="text-sm text-gray-600 mt-2">{address}</p>}

      <div className="flex justify-center space-x-2 mt-6">
        <button
          className="bg-gray-300 border-2 border-black px-2 py-1"
          onClick={handleGrabADrinkClick}
        >
          Grab a drink!
        </button>
        <button
          className="bg-red-300 border-2 border-black px-4 py-1"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BarCard;
