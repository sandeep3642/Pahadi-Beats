import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./PrivateRoute";
import "./App.css";
import Home from "./components/Home";
import PlayingSong from "./components/PlayingSong";
import Search from "./components/Search";
import AllSongs from "./components/AllSongs";
import Otp from "./components/OtpModal";

function App() {
  return (
    <div className="App">
      <Router basename="/Pahadi-Beats">
        <Routes>
          <Route exact path="/Pahadi-Beats" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          <Route path="/allsongs" element={<AllSongs />} />
          <Route path="/otp" element={<Otp />} />
          <Route
            path="/playing-song"
            element={
              <PrivateRoute>
                <PlayingSong />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
