import Compass from "../components/Compass";
import plank from "../assets/img/Plank.png";

const CompassPage = () => {
  return (
    <div className="relative overflow-hidden h-screen">
      <img className="absolute -rotate-[12deg] w-[220px]" src={plank} alt="" />
      <Compass />
    </div>
  );
};

export default CompassPage;
