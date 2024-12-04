import React, { useState, useEffect } from "react";
import { auth, db } from "../service/Firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import EditCard from "../components/EditCard";
import plankimg from "../assets/img/Plankprofile.png";

const ProfilePage: React.FC = () => {
  const [showEditCard, setShowEditCard] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [savedBars, setSavedBars] = useState<
    {
      id: string;
      name: string;
      photoUrl: string | null;
      rating: number | null;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userName = user.displayName || "No Name Set";
        const userPhoto = user.photoURL || "https://via.placeholder.com/150";

        setDisplayName(userName);
        setProfilePicture(userPhoto);

        const fetchSavedBars = async () => {
          try {
            const barsRef = collection(db, "users", user.uid, "savedBars");
            const barsSnapshot = await getDocs(barsRef);
            const bars = barsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setSavedBars(
              bars as {
                id: string;
                name: string;
                photoUrl: string | null;
                rating: number | null;
              }[]
            );
          } catch (error) {
            console.error("Error fetching saved bars from Firebase:", error);
          }
        };

        fetchSavedBars();
      } else {
        console.log("No user logged in");
        setDisplayName(null);
        setProfilePicture(null);
        setSavedBars([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSaveSuccess = () => {
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName || "No Name Set");
      setProfilePicture(user.photoURL || "https://via.placeholder.com/150");
    }
  };

  const handleDeleteBar = async (barId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const barDocRef = doc(db, "users", user.uid, "savedBars", barId);
      await deleteDoc(barDocRef);

      setSavedBars((prevBars) => {
        const updatedBars = prevBars.filter((bar) => bar.id !== barId);
        return updatedBars;
      });
    } catch (error) {
      console.error("Failed to delete bar:", error);
    }
  };

  const handleRatingChange = async (barId: string, newRating: number) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const barDocRef = doc(db, "users", user.uid, "savedBars", barId);
      await updateDoc(barDocRef, { rating: newRating });

      setSavedBars((prevBars) =>
        prevBars.map((bar) =>
          bar.id === barId ? { ...bar, rating: newRating } : bar
        )
      );
    } catch (error) {
      console.error("Failed to update rating:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <img
        className="absolute right-24 -rotate-[12deg] w-[220px]"
        src={plankimg}
        alt=""
      />

      <div className="mt-36">
        <img
          className="h-32 w-32 rounded-full border-2 border-black"
          src={profilePicture || "https://via.placeholder.com/150"}
          alt="Profile"
        />

        <p className="mt-4 text-lg text-white font-medium text-center">
          {displayName || "No Name Set"}
        </p>
      </div>

      <div className="flex flex-col mt-8 space-y-4">
        <button className="px-6 py-2 bg-gray-300 border-2 border-black">
          <a href="/compass">PintPoint!</a>
        </button>
        <button
          onClick={() => setShowEditCard(true)}
          className="px-6 py-2 bg-gray-300 border-2 border-black"
        >
          Edit Profile
        </button>
      </div>

      <div className="mt-10 w-[90%] max-w-lg">
        <h2 className="text-2xl text-white font-bold mb-4">Saved Bars</h2>
        {savedBars.length > 0 ? (
          savedBars.map((bar) => (
            <div
              key={bar.id}
              className="flex items-center bg-gray-300 opacity-80 p-4 rounded-md shadow-md mb-4 relative"
            >
              {bar.photoUrl ? (
                <img
                  src={bar.photoUrl || "https://via.placeholder.com/150"}
                  alt={bar.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-400 rounded-md mr-4"></div>
              )}
              <div>
                <p className="text-lg font-medium">{bar.name}</p>
                <select
                  value={bar.rating || 0}
                  onChange={(e) =>
                    handleRatingChange(bar.id, Number(e.target.value))
                  }
                  className="mt-2 bg-white border rounded-md px-2 py-1"
                >
                  <option value={0}>No Rating</option>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => handleDeleteBar(bar.id)}
                className="absolute top-2 right-2 px-2 py-1 rounded-full text-sm"
              >
                X
              </button>
            </div>
          ))
        ) : (
          <p className="text-lg text-gray-200">No bars saved yet!</p>
        )}
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
