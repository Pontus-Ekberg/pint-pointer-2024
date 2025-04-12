import { useState, useEffect } from "react";
import { auth, db } from "../service/Firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import beerguy from "../assets/img/Beerguyblue.png";
import clock from "../assets/img/fixedclock.png";
import plank from "../assets/img/Plank.png";
import cowkorv from "../assets/img/Cowkorv.png";

type Bar = {
  id: string;
  name: string;
  photoUrl: string | null;
  address: string | null;
};

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [recentBars, setRecentBars] = useState<Bar[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoggedIn(!!user);

      if (user) {
        try {
          const barsRef = collection(db, "users", user.uid, "savedBars");
          const barsQuery = query(
            barsRef,
            orderBy("timestamp", "desc"),
            limit(3)
          );
          const barsSnapshot = await getDocs(barsQuery);

          const bars = barsSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name || "Unknown Bar",
            photoUrl: doc.data().photoReference || null,
            address: doc.data().address || "No address available",
          }));

          setRecentBars(bars);
        } catch (error) {
          console.error("Error fetching recent bars:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const generatePhotoUrl = async () => {
      if (recentBars.length > 0 && recentBars[currentIndex].photoUrl) {
        const photoUrl = recentBars[currentIndex].photoUrl;
        // If it's already a full URL (old data), use it directly
        if (photoUrl.startsWith("http")) {
          setImageUrl(photoUrl);
          return;
        }

        // Otherwise, it's a photo reference, so generate the URL
        const baseUrl = "https://maps.googleapis.com/maps/api/place/photo";
        const maxWidth = 400;
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        const url = `${baseUrl}?maxwidth=${maxWidth}&photo_reference=${photoUrl}&key=${apiKey}`;
        setImageUrl(url);
      } else {
        setImageUrl(null);
      }
    };

    generatePhotoUrl();
  }, [recentBars, currentIndex]);

  const handleNext = () => {
    if (recentBars.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % recentBars.length);
    }
  };

  const handlePrevious = () => {
    if (recentBars.length > 0) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + recentBars.length) % recentBars.length
      );
    }
  };

  return (
    <div className="overflow-hidden h-screen w-screen relative font-sourgummy text-white text-2xl">
      <img className="mx-auto sm:w-[200px] md:w-[350px]" src={plank} alt="" />
      <div className="flex flex-col justify-center mt-12 lg:mt-28">
        <button className="bg-yellow-500 opacity-90 drop-shadow-md hover:scale-105 hover:brightness-110 rounded-lg z-20 mx-auto sm:h-16 sm:w-48 md:h-20 md:w-44 lg:h-24 lg:w-64">
          <a href="/compass" className="md:text-3xl lg:text-4xl">
            COMPASS
          </a>
        </button>

        {!isLoggedIn && (
          <>
            <button className="bg-yellow-500 opacity-90 drop-shadow-md hover:scale-105 hover:brightness-110 rounded-lg z-20 h-16 w-48 mx-auto mt-5 md:h-14 md:w-32 lg:h-20 lg:w-56">
              <a href="/login" className="md:text-2xl lg:text-3xl">
                Login
              </a>
            </button>

            <button className="bg-yellow-500 opacity-90 drop-shadow-md hover:scale-105 hover:brightness-110 rounded-lg z-20 h-16 w-48 sm:mt-72 mx-auto md:h-14 md:w-32 md:mt-[550px] lg:h-20 lg:w-56">
              <a href="/signup" className="md:text-2xl lg:text-3xl">
                Sign up
              </a>
            </button>
          </>
        )}

        {isLoggedIn && recentBars.length > 0 && (
          <div className="flex flex-col items-center mt-8 z-50 md:mt-20">
            <h2 className="text-white bg-yellow-500 rounded-lg px-2 text-2xl font-bold mb-4 opacity-95">
              Recently Visited Bars
            </h2>

            {/* För stora skärmar (md): Alla kort bredvid varandra */}
            <div className="hidden md:flex lg:justify-center md:space-x-4">
              {recentBars.map((bar) => (
                <div
                  key={bar.id}
                  className="min-w-[200px] bg-gray-300 opacity-95 p-4 rounded-md shadow-md"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={bar.name}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-400 rounded-md mb-2"></div>
                  )}
                  <p className="text-lg font-medium">{bar.name}</p>
                  <p className="text-sm text-gray-700">{bar.address}</p>
                </div>
              ))}
            </div>

            <div className="relative w-full flex items-center justify-center md:hidden">
              <button
                onClick={handlePrevious}
                className="absolute left-1 text-white bg-yellow-500 p-2 rounded-lg opacity-90 text-2xl"
              >
                ←
              </button>
              <div className="min-w-[200px] max-w-[260px] bg-gray-300 opacity-95 p-4 rounded-md shadow-md">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={recentBars[currentIndex].name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-400 rounded-md mb-2"></div>
                )}
                <p className="text-lg font-medium">
                  {recentBars[currentIndex].name}
                </p>
                <p className="text-sm text-gray-700">
                  {recentBars[currentIndex].address}
                </p>
              </div>

              <button
                onClick={handleNext}
                className="absolute right-1 text-white bg-yellow-500 p-2 rounded-lg opacity-90 text-2xl"
              >
                →
              </button>
            </div>
          </div>
        )}

        <img
          className="absolute z-10 -bottom-[50px] -right-[80px] w-[90%] md:w-[60%]"
          src={beerguy}
          alt=""
        />
        <img
          className="absolute -rotate-[10deg] z-10 top-[150px] -left-[80px] w-[80%] md:w-[65%] md:top-[270px] "
          src={clock}
          alt=""
        />
        <img
          className="absolute rotate-[10deg] z-10 top-[100px] -right-[50px] w-[60%] md:w-[50%]"
          src={cowkorv}
          alt=""
        />
      </div>
    </div>
  );
};
export default HomePage;
