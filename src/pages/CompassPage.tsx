import Compass from "../components/Compass";
import plank from "../assets/img/Plank.png";

const CompassPage = () => {
  return (
    <div className="relative overflow-hidden h-screen">
      <img className="absolute left-14 w-[200px]" src={plank} alt="" />
      <Compass />
    </div>
  );
};

export default CompassPage;
