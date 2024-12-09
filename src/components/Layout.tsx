import React, { useEffect, useState } from "react";
import XLWarningOverlay from "./XLWarningOverlay";
import Navbar from "./Navbar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isXLScreen, setIsXLScreen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsXLScreen(window.innerWidth >= 1280);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`relative`}>
      {isXLScreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50"
          style={{ pointerEvents: "none" }}
        />
      )}

      {isXLScreen && <XLWarningOverlay />}

      <div
        className={`relative ${
          isXLScreen ? "pointer-events-none opacity-50" : "pointer-events-auto"
        }`}
      >
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
