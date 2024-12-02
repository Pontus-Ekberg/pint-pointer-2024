import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="fixed z-50 top-4 right-4">
      <div className="flex justify-between items-center">
        <button onClick={toggleMenu} className="focus:outline-none sm:hidden">
          <div className="space-y-2">
            <span className="block w-8 h-1 bg-white"></span>
            <span className="block w-8 h-1 bg-white"></span>
            <span className="block w-8 h-1 bg-white"></span>
          </div>
        </button>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } absolute flex flex-col top-10 -left-12 bg-gray-300 opacity-80 rounded-md sm:relative sm:flex sm:top-auto sm:left-auto sm:w-auto sm:bg-transparent`}
        >
          <a href="/" className="px-4 py-2 sm:inline-block">
            Home
          </a>
          {user && (
            <a href="/profile" className="px-4 py-2 sm:inline-block">
              Profile
            </a>
          )}
          {user && (
            <a href="/all-bars" className="px-4 py-2 sm:inline-block">
              Bars
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
