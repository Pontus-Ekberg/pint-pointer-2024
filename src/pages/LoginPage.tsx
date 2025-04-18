import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../service/Firebase";
//import confetti from "../assets/img/Confettipur.png";
import plank from "../assets/img/Plank.png";
//import claus from "../assets/img/Claus.png";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [resetMessage, setResetMessage] = useState<string>("");
  const [showResetCard, setShowResetCard] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handlePasswordReset = async () => {
    setError("");
    setResetMessage("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage(
        "Password reset email has been sent. Please check your inbox."
      );
      setShowResetCard(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="relative overflow-hidden h-screen flex flex-col items-center font-sourgummy">
      <a href="/">
        <img className="mx-auto w-[200px] md:w-[350px]" src={plank} alt="" />
      </a>
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center md:mt-36 w-80 p-6 pb-0"
      >
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {resetMessage && (
          <p className="text-green-600 text-sm mb-4">{resetMessage}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full z-20 opacity-85 p-3 mb-4 rounded-lg lg:w-80 lg:h-14"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full z-20 opacity-85 p-3 mb-4 rounded-lg lg:w-80 lg:h-14"
          required
        />
        <button
          type="submit"
          className="bg-yellow-500 opacity-90 text-white h-16 w-40 drop-shadow-md hover:scale-105 hover:brightness-110 rounded-lg z-20 py-2 lg:w-48 lg:h-14 text-2xl"
        >
          Login
        </button>
      </form>

      {/* Forgot password button */}
      <button
        onClick={() => setShowResetCard(true)}
        className="z-20 text-white underline"
      >
        Forgot Password?
      </button>

      {/* Password Reset Card */}
      {showResetCard && (
        <div className="absolute z-30 top-20 bg-white p-6 border border-black rounded shadow-lg">
          <h2 className="text-lg font-bold mb-4">Reset Password</h2>
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border border-black"
          />
          <button
            onClick={handlePasswordReset}
            className="bg-gray-300 py-2 px-4 border-2 border-black hover:bg-blue-600 transition"
          >
            Send Reset Email
          </button>
          <button
            onClick={() => setShowResetCard(false)}
            className="ml-4 text-gray-600 underline"
          >
            Cancel
          </button>
        </div>
      )}

      <button className="bg-yellow-500 opacity-90 text-2xl text-white mt-48 z-20 drop-shadow-md hover:scale-105 hover:brightness-110 rounded-lg w-40 h-16 md:mt-96 lg:mt-[700px] lg:w-48 lg:h-14">
        <a href="signup">Sign Up</a>
      </button>
      {/*
      <img
        className="absolute z-10 w-[80%] md:w-[50%] lg:w-[60%] -bottom-[20px] -right-[50px] -rotate-[8deg] w-72"
        src={confetti}
        alt=""
      />
      <img
        className="absolute z-10 w-[80%] md:w-[50%] lg:w-[60%] top-[150px] -left-[70px] rotate-[15deg]"
        src={claus}
        alt=""
      />
*/}
    </div>
  );
};

export default LoginPage;
