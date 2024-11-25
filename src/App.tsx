import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CompassPage from "./pages/CompassPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileAvatar from "./components/ProfileIcon";

function App() {
  return (
    <>
      <ProfileAvatar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/compass" element={<CompassPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
