import React, { useState } from "react";
import { updateProfile, updatePassword } from "firebase/auth";
import { auth } from "../service/Firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface EditCardProps {
  onClose: () => void;
  onSaveSuccess: () => void;
}

const EditCard: React.FC<EditCardProps> = ({ onClose, onSaveSuccess }) => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    const user = auth.currentUser;
    if (!user) {
      setError("No user is currently logged in.");
      return;
    }

    try {
      if (name) {
        await updateProfile(user, { displayName: name });
      }

      if (password) {
        await updatePassword(user, password);
      }

      if (profilePicture) {
        const storage = getStorage();
        const storageRef = ref(storage, `profilePictures/${user.uid}`);

        await uploadBytes(storageRef, profilePicture);

        const downloadURL = await getDownloadURL(storageRef);

        await updateProfile(user, { photoURL: downloadURL });
      }

      setSuccess("Profile updated successfully!");
      onSaveSuccess();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-100 w-[90%] max-w-md p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-yellow-500 text-white opacity-90 drop-shadow-md hover:scale-105 hover:brightness-110 rounded-lg px-3 py-1 text-xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300"
              placeholder="Enter new name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Profile Picture</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:bg-yellow-100 file:rounded-lg drop-shadow-md"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-yellow-500 text-white opacity-90 drop-shadow-md hover:scale-105 hover:brightness-110 rounded-lg py-2 text-2xl"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCard;
