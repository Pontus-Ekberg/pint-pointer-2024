import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // Importera AuthContext

const Navbar: React.FC = () => {
  const { user } = useAuth(); // Hämta användaren från AuthContext
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="fixed z-50 top-4 right-4">
      <div className="flex justify-between items-center">
        {/* Hamburger Icon */}
        <button onClick={toggleMenu} className="focus:outline-none sm:hidden">
          <div className="space-y-2">
            <span className="block w-8 h-1 bg-white"></span>
            <span className="block w-8 h-1 bg-white"></span>
            <span className="block w-8 h-1 bg-white"></span>
          </div>
        </button>

        {/* Länkar */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } absolute flex flex-col top-10 -left-12 bg-gray-300 border-2 border-black sm:relative sm:flex sm:top-auto sm:left-auto sm:w-auto sm:bg-transparent`}
        >
          <a href="/" className="px-4 py-2 sm:inline-block">
            Home
          </a>
          {user && (
            <a href="/profile" className="px-4 py-2 sm:inline-block">
              Profile
            </a>
          )}
          <a href="/compass" className="px-4 py-2 sm:inline-block">
            Pointer
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
