import React, { useEffect, useState } from "react";

const XLWarningOverlay: React.FC = () => {
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

  if (!isXLScreen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center"
      style={{ pointerEvents: "auto" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
        <h2 className="text-xl font-bold mb-4">
          This app only works on mobile phones and iPads!
        </h2>
        <p className="text-gray-700">
          For the best experience, please open the app on a smaller screen.
        </p>
      </div>
    </div>
  );
};

export default XLWarningOverlay;
