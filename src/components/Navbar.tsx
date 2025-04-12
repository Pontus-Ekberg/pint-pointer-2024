import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../service/Firebase";
import { useAuth } from "../contexts/AuthContext";
import { onAuthStateChanged } from "firebase/auth";
import hamburger from "../assets/img/Burger.png";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfilePicture(user.photoURL || "https://via.placeholder.com/50");
      } else {
        setProfilePicture(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      closeMenu();
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  return (
    <nav className="fixed z-60 top-4 right-2">
      <div className="flex justify-between items-center font-sourgummy">
        <button onClick={toggleMenu} className="focus:outline-none">
          {user && profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-10 h-10 md:w-20 md:h-20 rounded-full"
            />
          ) : (
            <img
              src={hamburger}
              alt="Menu"
              className="w-10 h-10 md:w-20 md:h-20"
            />
          )}
        </button>

        {/* Fullscreen Menu */}
        <div
          className={`${
            isOpen ? "fixed" : "hidden"
          } right-4 top-4 left-4 md:right-8 md:left-8 md:top-8 bg-gray-300 bg-opacity-95 z-50 flex flex-col items-center rounded-2xl shadow-xl pt-20 pb-12`}
        >
          {/* Close Button */}
          <button
            onClick={closeMenu}
            className="absolute top-4 right-4 text-4xl font-bold hover:scale-110 transition-transform"
          >
            ✕
          </button>

          <div className="flex flex-col items-center space-y-8 text-3xl">
            <a
              href="/"
              className="w-64 py-3 text-center hover:scale-110 transition-transform hover:bg-yellow-500 hover:text-white rounded-lg"
              onClick={closeMenu}
            >
              HOME
            </a>
            <a
              href="/compass"
              className="w-64 py-3 text-center hover:scale-110 transition-transform hover:bg-yellow-500 hover:text-white rounded-lg"
              onClick={closeMenu}
            >
              COMPASS
            </a>

            {user && (
              <a
                href="/all-bars"
                className="w-64 py-3 text-center hover:scale-110 transition-transform hover:bg-yellow-500 hover:text-white rounded-lg"
                onClick={closeMenu}
              >
                TOP RATED BARS
              </a>
            )}

            {user && (
              <a
                href="/profile"
                className="w-64 py-3 text-center hover:scale-110 transition-transform hover:bg-yellow-500 hover:text-white rounded-lg"
                onClick={closeMenu}
              >
                PROFILE
              </a>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="w-64 py-3 text-center hover:scale-110 transition-transform hover:bg-red-500 hover:text-white rounded-lg text-red-600"
              >
                LOG OUT
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
