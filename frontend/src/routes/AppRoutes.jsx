import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRegister from '../pages/auth/UserRegister.jsx';
import UserLogin from '../pages/auth/UserLogin.jsx';
import PartnerRegister from '../pages/auth/PartnerRegister.jsx';
import PartnerLogin from '../pages/auth/PartnerLogin.jsx';
import Home from '../pages/general/Home.jsx';
import LandingPage from '../pages/general/LandingPage.jsx';
import CreateFood from '../pages/food-partner/CreateFood.jsx';
import Profile from '../pages/food-partner/Profile.jsx';
import SavedVideos from '../pages/user/SavedVideos.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/feed" element={<Home />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/food-partner/register" element={<PartnerRegister />} />
        <Route path="/food-partner/login" element={<PartnerLogin />} />
        <Route path="/create-food" element={<CreateFood />} />
        <Route path="/food-partner/:id" element={<Profile />} />
        <Route path="/saved" element={<SavedVideos />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes