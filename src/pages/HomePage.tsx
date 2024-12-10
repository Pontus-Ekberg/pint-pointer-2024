import React, { useState, useEffect } from "react";
import { auth } from "../service/Firebase";
import beerguy from "../assets/img/Beerguyblue.png";
import clock from "../assets/img/fixedclock.png";
import plank from "../assets/img/Plank.png";
import cowkorv from "../assets/img/Cowkorv.png";
import skumol from "../assets/img/skumol.png";
import ol from "../assets/img/ol.png";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="overflow-hidden h-screen w-screen relative">
      <img
        className="mx-auto sm:w-[200px] md:w-[350px] lg:w-[350px]"
        src={plank}
        alt=""
      />
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
