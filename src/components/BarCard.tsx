import React from "react";

const BarCard = ({
  name,
  photoUrl,
  onClose,
  onSave,
}: {
  name: string;
  photoUrl: string | null;
  onClose: () => void;
  onSave: () => void;
}) => (
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
    <div className="flex justify-center space-x-2 mt-6">
      <button
        className="bg-gray-300 border-2 border-black px-2 py-1"
        onClick={onSave}
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

export default BarCard;
