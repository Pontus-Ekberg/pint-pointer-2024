import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../service/Firebase";
import claus from "../assets/img/Claus.png";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/compass");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="relative overflow-hidden h-screen flex flex-col items-center">
      <h1 className="text-white font-bold text-4xl mt-10 mb-[50px]">Login</h1>
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center w-80 p-6"
      >
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-black"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-black"
          required
        />
        <button
          type="submit"
          className="w-36 bg-gray-300 py-2 border-2 border-black hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
      <button className="mt-[250px] z-20 bg-gray-300 border-2 border-black w-32 h-10">
        <a href="signup">SignUp</a>
      </button>
      <img
        className="absolute z-10 top-[350px] right-[125px] -rotate-[8deg]"
        src={claus}
        alt=""
      />
    </div>
  );
};

export default LoginPage;
