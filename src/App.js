import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./PrivateRoute";
import "./App.css";
import Home from "./components/Home";
import Search from "./components/Search";
import AllSongs from "./components/AllSongs";
import Otp from "./components/OtpModal";
import Profile from "./components/Profile";
import AboutArtist from "./components/AboutArtist";
import About from "./components/About";
import GoogleAuthCallback from "./components/GoogleAuthCallback";
import Settings from "./components/Setting";
import ForgetPassword from "./components/ForgetPassword";
import ResetPasswordPage from "./components/ResetPasswordPage";
import BuyPlans from "./components/BuyPlans";
import TermsCondition from "./components/TermsCondition";
import DownloadedSongs from "./components/DownloadedSongs";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          <Route
            path="/allsongs"
            element={
              <PrivateRoute>
                <AllSongs />
              </PrivateRoute>
            }
          />
          <Route path="/otp" element={<Otp />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/aboutArtist/:id" element={<AboutArtist />} />{" "}
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/buy-plans" element={<BuyPlans />} />
          <Route path="/terms" element={<TermsCondition />} />
          <Route path="/downloaded-songs" element={<DownloadedSongs />} />
          <Route
            path="/auth/google/callback"
            element={<GoogleAuthCallback />}
          />{" "}
          {/* Add Google Auth Callback */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
