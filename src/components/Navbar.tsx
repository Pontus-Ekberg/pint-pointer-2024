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
      <div className="flex justify-between items-center font-barrio">
        <button onClick={toggleMenu} className="focus:outline-none">
          {user && profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-10 h-10 md:w-20 md:h-20 rounded-full border-2 border-black"
            />
          ) : (
            <img
              src={hamburger}
              alt="Menu"
              className="w-10 h-10 md:w-20 md:h-20"
            />
          )}
        </button>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } absolute flex flex-col top-12 -left-24 bg-gray-300 rounded-md`}
        >
          <a
            href="/"
            className="w-36 px-4 py-2 sm:inline-block"
            onClick={closeMenu}
          >
            Home
          </a>
          {user && (
            <a
              href="/profile"
              className="px-4 py-2 sm:inline-block"
              onClick={closeMenu}
            >
              Profile
            </a>
          )}
          {user && (
            <a
              href="/all-bars"
              className="px-4 py-2 sm:inline-block"
              onClick={closeMenu}
            >
              Toprated bars
            </a>
          )}
          <a
            href="/compass"
            className="px-4 py-2 sm:inline-block"
            onClick={closeMenu}
          >
            Pointer
          </a>
          {user && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 sm:inline-block text-red-500 text-left"
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
