import React from "react";
import "./App.css";
import Header from "./components/Header";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import NotAllowed from "./components/NotAllowed/NotAllowed";
import Welcome from "./components/Welcome/Welcome";
const App = () => {
  const lastAccessTimestamp = localStorage.getItem("lastAccessTimestamp");
  if (!lastAccessTimestamp) {
    // If it doesn't exist, allow access and store the current timestamp
    return (
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/Tinder"
            element={
              <div className="app">
                <Header />
                <Welcome />
              </div>
            }
          />

          <Route path="*" element={<Navigate to="/Tinder" />} />
        </Routes>
      </BrowserRouter>
    );
  } else {
    const currentTime = Date.now();
    const timeDifference = currentTime - parseInt(lastAccessTimestamp);

    // If the time difference is greater than 24 hours (in milliseconds)
    if (timeDifference > 6 * 60 * 60 * 1000) {
      return (
        <BrowserRouter>
          <Routes>
            <Route
              exact
              path="/Tinder"
              element={
                <div className="app">
                  <Header />
                  <Welcome />
                </div>
              }
            />

            <Route path="*" element={<Navigate to="/Tinder" />} />
          </Routes>
        </BrowserRouter>
      );
    } else {
      return (
        <BrowserRouter>
          <Routes>
            <Route exact path="/Tinder/notAllowed" element={<NotAllowed />} />
            <Route path="*" element={<Navigate to="/Tinder/notAllowed" />} />
          </Routes>
        </BrowserRouter>
      );
    }
  }
};

export default App;
