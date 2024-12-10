import React, { useEffect, useState } from "react";
import Compass from "../components/Compass";
import plank from "../assets/img/Plank.png";

const CompassPage = () => {
  const [hasReloaded, setHasReloaded] = useState(false);

  useEffect(() => {
    const hasReloadedFlag = sessionStorage.getItem("hasReloaded");
    if (hasReloadedFlag) {
      setHasReloaded(true);
    } else {
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    }
  }, []);

  if (hasReloaded) {
    return (
      <div className="relative overflow-hidden h-screen">
        <img className="mx-auto w-[200px] md:w-[350px]" src={plank} alt="" />
        <Compass />
      </div>
    );
  }

  return null;
};

export default CompassPage;
