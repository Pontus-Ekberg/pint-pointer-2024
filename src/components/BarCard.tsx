import { useNavigate } from "react-router-dom";
import { auth } from "../service/Firebase";
//import ol from "../assets/img/ol.png";

const BarCard = ({
  name,
  photoUrl,
  address,
  openingHours,
  onClose,
  onSave,
}: {
  name: string;
  photoUrl: string | null;
  address: string | null;
  openingHours: string[];
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
    <div className="bg-gray-200 z-40 p-10 shadow-md absolute top-10 rounded-lg">
      <h2 className="text-2xl">{name}</h2>

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

      {openingHours.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg">Opening Hours:</h3>
          <ul className="list-disc pl-5">
            {openingHours.map((hour, index) => (
              <li key={index} className="text-sm text-gray-600">
                {hour}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-center space-x-2 mt-6">
        <button
          className="bg-yellow-500 opacity-90 h-16 w-36 px-2 py-1 rounded-lg text-xl text-white"
          onClick={handleGrabADrinkClick}
        >
          GRAB A DRINk!
        </button>
        <button
          className="bg-red-400 opacity-90 px-4 py-1 rounded-lg text-xl text-white"
          onClick={onClose}
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};

export default BarCard;
