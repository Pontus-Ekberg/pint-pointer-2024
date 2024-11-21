import beerguy from "../assets/img/Beerguyblue.png";
import clock from "../assets/img/Clock.png";

const HomePage = () => {
  return (
    <div className="overflow-hidden h-screen w-screen relative">
      <h1 className="flex justify-center mt-10 text-white font-bold text-4xl">
        PintPoint
      </h1>
      <div className="flex flex-col justify-center mt-24">
        <button className="bg-gray-300 border-2 border-black z-20 h-10 mx-28">
          <a href="/compass">Point!</a>
        </button>

        <button className="bg-gray-300 border-2 border-black z-20 h-10 mx-28 mt-5">
          <a href="/login">Login</a>
        </button>

        <button className="bg-gray-300 border-2 border-black z-20 h-10 mt-80 mx-28">
          <a href="/signup">Sign up</a>
        </button>
        <img
          className="absolute z-10 top-[360px] left-[100px]"
          src={beerguy}
          alt=""
        />
        <img
          className="absolute -rotate-[10deg] z-10 top-[150px] -left-[50px]"
          src={clock}
          alt=""
        />
      </div>
    </div>
  );
};

export default HomePage;
