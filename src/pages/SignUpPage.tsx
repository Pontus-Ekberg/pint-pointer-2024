import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../service/Firebase";
import { useNavigate } from "react-router-dom";
import beerpink from "../assets/img/Beerpink.png";
import signupimg from "../assets/img/Planksignup.png";
import faceimg from "../assets/img/Faceyellow.png";
import skumol from "../assets/img/skumol.png";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      const user = auth.currentUser;

      if (user) {
        await updateProfile(user, {
          displayName: "Default Name",
          photoURL: "https://example.com/default-profile-pic.png",
        });
      }

      setSuccess("Account created successfully! You can now log in.");
      navigate("/profile");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="relative overflow-hidden h-screen flex flex-col items-center font-barrio">
      <img className="mx-auto w-[200px] md:w-[350px]" src={signupimg} alt="" />
      <form
        onSubmit={handleSignUp}
        className="flex flex-col relative items-center w-80 p-6 md:mt-36"
      >
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full z-20 opacity-85 p-2 mb-4 border border-black lg:w-80 lg:h-14"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full z-20 opacity-85 p-2 mb-4 border border-black lg:w-80 lg:h-14"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full z-20 opacity-85 p-2 mb-4 border border-black lg:w-80 lg:h-14"
          required
        />
        <button
          type="submit"
          className="w-36 z-20 bg-cover bg-center drop-shadow-md hover:scale-105 hover:brightness-110 rounded-lg py-2 border-2 border-black lg:w-48 lg:h-14 text-xl"
          style={{
            backgroundImage: `url(${skumol})`,
          }}
        >
          Sign Up
        </button>
      </form>
      <img
        className="absolute -bottom-[50px] -right-[85px] md:w-[500px] lg:w-[600px]"
        src={beerpink}
        alt=""
      />
      <img
        className="absolute top-[100px] z-10 -left-[130px] rotate-[25deg] md:w-[500px] lg:w-[600px]"
        src={faceimg}
        alt=""
      />
    </div>
  );
};

export default SignUpPage;
