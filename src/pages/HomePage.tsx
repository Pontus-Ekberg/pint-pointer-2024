import React, { useState, useEffect } from "react";
import { auth } from "../service/Firebase";
import beerguy from "../assets/img/Beerguyblue.png";
import clock from "../assets/img/Clock.png";
import plank from "../assets/img/Plank.png";

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
      <img className="mx-auto w-[250px]" src={plank} alt="" />
      <div className="flex flex-col justify-center mt-12">
        <button className="bg-gray-300 border-2 border-black z-20 h-10 mx-28">
          <a href="/compass">Point!</a>
        </button>

        {!isLoggedIn && (
          <>
            <button className="bg-gray-300 border-2 border-black z-20 h-10 mx-28 mt-5">
              <a href="/login">Login</a>
            </button>

            <button className="bg-gray-300 border-2 border-black z-20 h-10 mt-52 mx-28">
              <a href="/signup">Sign up</a>
            </button>
          </>
        )}

        <img
          className="absolute z-10 top-[300px] left-[100px]"
          src={beerguy}
          alt=""
        />
        <img
          className="absolute -rotate-[10deg] z-10 top-[150px] -left-[50px]"
          src={clock}
          alt=""
        />
      </div>
    </div>
  );
};

export default HomePage;
