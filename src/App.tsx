import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CompassPage from "./pages/CompassPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileAvatar from "./components/ProfileIcon";
import Navbar from "./components/Navbar";
import AllBarsPage from "./pages/AllBarsPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/compass" element={<CompassPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/all-bars" element={<AllBarsPage />} />
      </Routes>
    </>
  );
}

export default App;
