import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/views/NavBar/NavBar";
import Footer from "./components/views/Footer/Footer";
import LandingPage from "./components/views/Landingpage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import AUTH from "./hoc/auth";
function App() {
  const NewLandingPage = AUTH(LandingPage, null);
  const NewLoginPage = AUTH(LoginPage, false);
  const NewRegisterPage = AUTH(RegisterPage, false);

  return (
    <>
      <Router>
        <div>
          <NavBar />
          <Routes>
            <Route exact path="/" element={<NewLandingPage />} />
            <Route exact path="/login" element={<NewLoginPage />} />
            <Route exact path="/register" element={<NewRegisterPage />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
