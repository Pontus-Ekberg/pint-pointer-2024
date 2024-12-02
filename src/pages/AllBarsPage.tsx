import React, { useState, useEffect } from "react";
import { db } from "../service/Firebase";
import { collectionGroup, getDocs } from "firebase/firestore";

const AllBarsPage: React.FC = () => {
  const [allBars, setAllBars] = useState<
    {
      id: string;
      name: string;
      photoUrl: string | null;
      rating: number | null;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllBars = async () => {
      try {
        const barsSnapshot = await getDocs(collectionGroup(db, "savedBars"));

        const bars = barsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllBars(
          bars as {
            id: string;
            name: string;
            photoUrl: string | null;
            rating: number | null;
          }[]
        );
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
                  Rating: {bar.rating ? `${bar.rating} Stars` : "No Rating"}
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
