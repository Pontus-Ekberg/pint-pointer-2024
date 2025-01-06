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
import plank from "../assets/img/Plank.png";
import BarDetails from "../components/BarDetails";
//import skumol from "../assets/img/skumol.png";
//import ol from "../assets/img/ol.png";

export type Bar = {
  id: string;
  name: string;
  photoUrl: string | null;
  rating: number;
  ratingCount: number;
  address: string | null;
  openingHours?: string[];
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
              openingHours: doc.data().openingHours || [],
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
    <div className="flex flex-col items-center font-sourgummy">
      <a href="/">
        <img className="mx-auto w-[200px]" src={plank} alt="" />
      </a>
      <div className="mt-14">
        <img
          className="h-32 w-32 rounded-full"
          src={profilePicture || "https://via.placeholder.com/150"}
          alt="Profile"
        />

        <p className="mt-4 text-white text-2xl text-center">
          {displayName || "No Name Set"}
        </p>
      </div>

      <div className="flex flex-col mt-8 space-y-4">
        <button className="bg-yellow-500 opacity-90 px-6 py-2 drop-shadow-md hover:scale-105 hover:brightness-110 rounded-lg h-12 w-50">
          <a className="text-xl text-white" href="/compass">
            COMPASS
          </a>
        </button>
        <button
          onClick={() => setShowEditCard(true)}
          className="bg-yellow-500 opacity-90 text-white h-12 w-50 px-6 py-2 drop-shadow-md hover:scale-105 hover:brightness-110 rounded-lg text-xl"
        >
          EDIT PROFILE
        </button>
      </div>

      <div className="mt-10 w-[90%] max-w-lg">
        <h2 className="text-2xl text-white mb-4">SAVED BARS</h2>
        {savedBars.length > 0 ? (
          savedBars.map((bar) => (
            <div
              key={bar.id}
              className="flex items-center bg-gray-300 opacity-70 p-4 rounded-md shadow-md mb-4 relative cursor-pointer"
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
                <p className="text-xl">{bar.name}</p>
                <p className="text-sm text-gray-700">
                  AVERAGE RATING: {`${bar.rating} OF 5 BEERS`}
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
                      {rating} BEER{rating > 1 ? "S" : ""}
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
