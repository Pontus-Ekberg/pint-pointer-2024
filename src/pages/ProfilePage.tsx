import React, { useState, useEffect } from "react";
import { auth, db } from "../service/Firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import EditCard from "../components/EditCard";
import plankimg from "../assets/img/Plankprofile.png";
import BarDetails from "../components/BarDetails";
import skumol from "../assets/img/skumol.png";
import ol from "../assets/img/ol.png";

export type Bar = {
  id: string;
  name: string;
  photoUrl: string | null;
  rating: number;
  ratingCount: number;
  address: string | null;
};

const ProfilePage: React.FC = () => {
  const [showEditCard, setShowEditCard] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [savedBars, setSavedBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);

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
            const barsQuery = query(barsRef, orderBy("timestamp", "desc"));
            const barsSnapshot = await getDocs(barsQuery);

            const bars = barsSnapshot.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name || "Unknown Bar",
              photoUrl: doc.data().photoUrl || null,
              rating: doc.data().rating || 0,
              ratingCount: doc.data().ratingCount || 0,
              address: doc.data().address || "No address available",
            }));

            setSavedBars(bars as Bar[]);
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

  const handleCardClick = (bar: Bar) => {
    setSelectedBar(bar);
  };

  const closeModal = () => {
    setSelectedBar(null);
  };

  const handleDeleteBar = async (barId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const barDocRef = doc(db, "users", user.uid, "savedBars", barId);
      await deleteDoc(barDocRef);

      setSavedBars((prevBars) => prevBars.filter((bar) => bar.id !== barId));
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
      <img className="mx-auto w-[200px]" src={plankimg} alt="" />

      <div className="mt-14">
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
        <button
          className="px-6 py-2 bg-cover bg-center rounded-lg border-2 border-black"
          style={{
            backgroundImage: `url(${skumol})`,
          }}
        >
          <a href="/compass">PintPoint!</a>
        </button>
        <button
          onClick={() => setShowEditCard(true)}
          className="px-6 py-2 bg-cover bg-center rounded-lg border-2 border-black"
          style={{
            backgroundImage: `url(${ol})`,
          }}
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
              className="flex items-center bg-gray-300 opacity-90 p-4 rounded-md shadow-md mb-4 relative cursor-pointer"
              onClick={() => handleCardClick(bar)}
            >
              {bar.photoUrl ? (
                <img
                  src={bar.photoUrl}
                  alt={bar.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-400 rounded-md mr-4"></div>
              )}
              <div>
                <p className="text-lg font-medium">{bar.name}</p>
                <p className="text-sm text-gray-700">
                  Average Rating: {`${bar.rating} Stars`}
                </p>
                <select
                  value={bar.rating}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    handleRatingChange(bar.id, Number(e.target.value))
                  }
                  className="mt-2 bg-white border rounded-md px-2 py-1"
                >
                  {[0, 1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBar(bar.id);
                }}
                className="absolute top-2 right-2 px-2 py-1 text-sm"
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
      {selectedBar && <BarDetails bar={selectedBar} onClose={closeModal} />}
    </div>
  );
};

export default ProfilePage;
