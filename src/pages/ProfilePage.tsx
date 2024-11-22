import React, { useState, useEffect } from "react";
import { auth } from "../service/Firebase";
import { useNavigate } from "react-router-dom";
import EditCard from "../components/EditCard";

const ProfilePage: React.FC = () => {
  const [showEditCard, setShowEditCard] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName || "No Name Set");
      setProfilePicture(user.photoURL || "https://via.placeholder.com/150");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  const handleSaveSuccess = () => {
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName || "No Name Set");
      setProfilePicture(user.photoURL || "https://via.placeholder.com/150");
    }
  };

  return (
    <div className="overflow-hidden h-screen flex flex-col items-center">
      <h1 className="text-3xl text-white font-bold mt-10">Profile</h1>

      <div className="mt-10">
        <img
          className="h-32 w-32 rounded-full border-2 border-black"
          src={profilePicture || "https://via.placeholder.com/150"}
          alt="Profile"
        />

        <p className="mt-4 text-lg text-white font-medium text-center">
          {displayName}
        </p>
      </div>

      <div className="flex flex-col mt-8 space-y-4">
        <button
          onClick={() => setShowEditCard(true)}
          className="px-6 py-2 bg-gray-300 border-2 border-black"
        >
          Edit Profile
        </button>

        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-gray-300 border-2 border-black"
        >
          Logout
        </button>
      </div>

      {showEditCard && (
        <EditCard
          onClose={() => setShowEditCard(false)}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
};

export default ProfilePage;
