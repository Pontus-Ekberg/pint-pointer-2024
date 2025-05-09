import React, { useState, useEffect } from "react";
import { db } from "../service/Firebase";
import { collectionGroup, getDocs, DocumentData } from "firebase/firestore";
import plank from "../assets/img/Plank.png";
import BarDetails from "../components/BarDetails";
import ratingbeer from "../assets/img/beer-1669275_960_720.webp";
import halfbeer from "../assets/img/halfbier.png";

export type Bar = {
  id: string;
  name: string;
  photoUrl: string | null;
  rating: number;
  ratingCount: number;
  address: string | null;
  openingHours?: string[];
};

const AllBarsPage: React.FC = () => {
  const [allBars, setAllBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);

  useEffect(() => {
    const fetchAllBars = async () => {
      try {
        const barsSnapshot = await getDocs(collectionGroup(db, "savedBars"));

        const barsMap = new Map<
          string,
          {
            photoReference: string | null;
            totalRating: number;
            ratingCount: number;
            address: string | null;
            openingHours?: string[];
          }
        >();

        barsSnapshot.docs.forEach((doc) => {
          const data = doc.data() as DocumentData;

          if (
            typeof data.name === "string" &&
            (data.photoReference === null ||
              typeof data.photoReference === "string") &&
            typeof data.rating === "number"
          ) {
            const barName = data.name;
            const address = data.address || null;
            const openingHours = data.openingHours || undefined;

            if (barsMap.has(barName)) {
              const existingBar = barsMap.get(barName)!;
              existingBar.totalRating += data.rating;
              existingBar.ratingCount += 1;
            } else {
              barsMap.set(barName, {
                photoReference: data.photoReference || null,
                totalRating: data.rating,
                ratingCount: 1,
                address,
                openingHours,
              });
            }
          }
        });

        const bars: Bar[] = Array.from(barsMap.entries()).map(
          ([
            name,
            { photoReference, totalRating, ratingCount, address, openingHours },
          ]) => ({
            id: name,
            name,
            photoUrl: photoReference,
            rating: parseFloat((totalRating / ratingCount).toFixed(2)),
            ratingCount,
            address,
            openingHours,
          })
        );

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

  const handleCardClick = (bar: Bar) => {
    setSelectedBar(bar);
  };

  const closeModal = () => {
    setSelectedBar(null);
  };

  const renderRatingImages = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const images = [];

    for (let i = 0; i < fullStars; i++) {
      images.push(
        <img
          key={`full-${i}`}
          src={ratingbeer}
          alt="beer rating"
          className="w-6 h-6"
        />
      );
    }

    if (hasHalfStar) {
      images.push(
        <img
          key="half"
          src={halfbeer}
          alt="half beer rating"
          className="w-6 h-6"
        />
      );
    }

    return images;
  };

  return (
    <div className="flex flex-col items-center md:w-[90%] mx-auto font-sourgummy">
      <a href="/">
        <img className="mx-auto w-[200px]" src={plank} alt="" />
      </a>
      {loading ? (
        <p className="mt-4 text-gray-500">Loading...</p>
      ) : allBars.length > 0 ? (
        <div className="mt-6 w-[90%] max-w-4xl">
          {allBars.map((bar) => (
            <div
              key={bar.id}
              className="flex items-center bg-gray-300 opacity-80 p-4 rounded-md shadow-md mb-4 relative cursor-pointer"
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
                  AVERAGE RATING:
                  <span className="flex">
                    {renderRatingImages(bar.rating)}
                  </span>{" "}
                  ({bar.ratingCount} VOTES)
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-500">No bars have been rated yet!</p>
      )}

      {selectedBar && <BarDetails bar={selectedBar} onClose={closeModal} />}
    </div>
  );
};

export default AllBarsPage;
