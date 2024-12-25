import { useState, useEffect } from "react";
import { auth, db } from "../service/Firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import beerguy from "../assets/img/Beerguyblue.png";
import clock from "../assets/img/fixedclock.png";
import plank from "../assets/img/Plank.png";
import cowkorv from "../assets/img/Cowkorv.png";
import skumol from "../assets/img/skumol.png";
import ol from "../assets/img/ol.png";

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
            photoUrl: doc.data().photoUrl || null,
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
    <div className="overflow-hidden h-screen w-screen relative font-barrio text-xl">
      <img className="mx-auto sm:w-[200px] md:w-[350px]" src={plank} alt="" />
      <div className="flex flex-col justify-center mt-12 lg:mt-28">
        <button
          className="bg-cover bg-center drop-shadow-md hover:scale-105 hover:brightness-110 rounded-lg border-2 border-black z-20 mx-auto sm:h-12 sm:w-36 md:h-20 md:w-44 lg:h-24 lg:w-64"
          style={{
            backgroundImage: `url(${skumol})`,
          }}
        >
          <a href="/compass" className="md:text-3xl lg:text-4xl">
            Point!
          </a>
        </button>

        {!isLoggedIn && (
          <>
            <button
              className="bg-cover bg-fill drop-shadow-md hover:scale-105 hover:brightness-110 rounded-lg border-2 border-black z-20 h-10 w-28 mx-auto mt-5 md:h-14 md:w-32 lg:h-20 lg:w-56"
              style={{
                backgroundImage: `url(${ol})`,
              }}
            >
              <a href="/login" className="md:text-2xl lg:text-3xl">
                Login
              </a>
            </button>

            <button
              className="bg-cover bg-top drop-shadow-md hover:scale-105 hover:brightness-110 rounded-lg border-2 border-black z-20 h-10 w-28 sm:mt-72 mx-auto md:h-14 md:w-32 md:mt-[550px] lg:h-20 lg:w-56"
              style={{
                backgroundImage: `url(${ol})`,
              }}
            >
              <a href="/signup" className="md:text-2xl lg:text-3xl">
                Sign up
              </a>
            </button>
          </>
        )}

        {isLoggedIn && recentBars.length > 0 && (
          <div className="flex flex-col items-center mt-8 z-50 md:mt-20">
            <h2 className="text-white bg-yellow-600 rounded-lg px-2 text-2xl font-bold mb-4 opacity-95">
              Recently Visited Bars
            </h2>

            {/* För stora skärmar (md): Alla kort bredvid varandra */}
            <div className="hidden md:flex lg:justify-center md:space-x-4">
              {recentBars.map((bar) => (
                <div
                  key={bar.id}
                  className="min-w-[200px] bg-gray-300 opacity-95 p-4 rounded-md shadow-md"
                >
                  {bar.photoUrl ? (
                    <img
                      src={bar.photoUrl}
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

            {/* För mindre skärmar: Ett kort i taget med navigeringsknappar */}
            <div className="flex items-center justify-center md:hidden space-x-4">
              <button
                onClick={handlePrevious}
                className="text-white bg-yellow-600 p-2 rounded-lg opacity-80 text-2xl"
              >
                ←
              </button>
              <div className="min-w-[200px] bg-gray-300 opacity-95 p-4 rounded-md shadow-md">
                {recentBars[currentIndex].photoUrl ? (
                  <img
                    src={recentBars[currentIndex].photoUrl}
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
                className="text-white bg-yellow-600 p-2 rounded-lg opacity-80 text-2xl"
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
