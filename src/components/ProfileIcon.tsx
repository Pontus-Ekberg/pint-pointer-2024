import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../service/Firebase";
import { onAuthStateChanged } from "firebase/auth";

const ProfileAvatar: React.FC = () => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfilePicture(user.photoURL || "https://via.placeholder.com/50");
      } else {
        setProfilePicture(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!profilePicture) return null;

  return (
    <Link to="/profile" className="fixed z-50 top-4 right-4">
      <img
        src={profilePicture}
        alt="Profile"
        className="h-10 w-10 rounded-full border-2 border-black cursor-pointer"
      />
    </Link>
  );
};

export default ProfileAvatar;
