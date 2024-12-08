import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../service/Firebase";
import { useAuth } from "../contexts/AuthContext";
import hamburger from "../assets/img/Burger.png";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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
    <nav className="fixed z-50 top-4 right-2">
      <div className="flex justify-between items-center">
        <button onClick={toggleMenu} className="focus:outline-none">
          <img
            src={hamburger}
            alt="Menu"
            className="w-10 h-10 md:w-20 md:h-20"
          />
        </button>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } absolute flex flex-col top-10 -left-12 bg-gray-300 opacity-80 rounded-md`}
        >
          <a href="/" className="px-4 py-2 sm:inline-block" onClick={closeMenu}>
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
