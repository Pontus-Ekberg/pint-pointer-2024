import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../service/Firebase";
import beerpink from "../assets/img/Beerpink.png";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

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
      <h1 className="text-white font-bold text-4xl mt-10 mb-[50px]">Sign Up</h1>
      <form
        onSubmit={handleSignUp}
        className="flex flex-col relative items-center w-80 p-6"
      >
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-black"
          required
        />
        <button
          type="submit"
          className="w-36 bg-gray-300 py-2 border-2 border-black transition"
        >
          Sign Up
        </button>
        <img
          className="absolute top-[270px] left-[70px]"
          src={beerpink}
          alt=""
        />
      </form>
    </div>
  );
};

export default SignUpPage;
