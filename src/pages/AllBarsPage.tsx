import React, { useState, useEffect } from "react";
import { db } from "../service/Firebase";
import { collectionGroup, getDocs, DocumentData } from "firebase/firestore";

// Typdefinition för en Bar
type Bar = {
  id: string;
  name: string;
  photoUrl: string | null;
  rating: number;
};

const AllBarsPage: React.FC = () => {
  const [allBars, setAllBars] = useState<Bar[]>([]); // State för alla barer
  const [loading, setLoading] = useState<boolean>(true); // State för att hålla koll på laddning

  useEffect(() => {
    const fetchAllBars = async () => {
      try {
        const barsSnapshot = await getDocs(collectionGroup(db, "savedBars"));

        const bars: Bar[] = barsSnapshot.docs
          .map((doc) => {
            const data = doc.data() as DocumentData;

            // Typkontroll för att säkerställa att alla fält finns och har rätt typ
            if (
              typeof data.name === "string" &&
              (data.photoUrl === null || typeof data.photoUrl === "string") &&
              typeof data.rating === "number"
            ) {
              return {
                id: doc.id,
                name: data.name,
                photoUrl: data.photoUrl || null,
                rating: data.rating,
              };
            }

            // Returnera null om objektet inte är giltigt
            return null;
          })
          .filter((bar): bar is Bar => bar !== null); // Filtrera bort null-objekt

        // Sortera barerna efter högst rating först
        const sortedBars = bars.sort((a, b) => b.rating - a.rating);

        setAllBars(sortedBars);
      } catch (error) {
        console.error("Error fetching bars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBars();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-8">All Rated Bars</h1>

      {loading ? (
        <p className="mt-4 text-gray-500">Loading...</p>
      ) : allBars.length > 0 ? (
        <div className="mt-6 w-[90%] max-w-4xl">
          {allBars.map((bar) => (
            <div
              key={bar.id}
              className="flex items-center bg-gray-300 opacity-90 p-4 rounded-md shadow-md mb-4 relative"
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
                  Rating: {`${bar.rating} Stars`}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-500">No bars have been rated yet!</p>
      )}
    </div>
  );
};

export default AllBarsPage;
