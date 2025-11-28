import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Layout from "./components/Layout";
// Pages
import Home from "./components/Home";
import Donations from "./components/donation/Donation";
import BrowseDonations from "./components/donation/BrowseDonations";
import SubmitDonation from "./components/donation/SubmitDonation";
import MyDonations from "./components/donation/MyDonations";
import MyRequests from "./components/request/MyRequests";
import DonationRequests from "./components/request/DonationRequests";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ContactUs from "./components/ContactUs";
import HowItWorks from "./components/HowItWorks";
import FAQ from "./components/FAQ";
import NotificationPage from "./components/NotificationsPage";

export default function MainRoute() {

  const getUserFromStorage = () => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");

    return token && name && role ? { name, role } : null;
  }

  const [user, setUser] = useState(getUserFromStorage());

  useEffect(() => {
    setUser(getUserFromStorage());
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    setUser(null);
  }

  return (
    <Routes>
      <Route element={<Layout user={user} handleLogout={handleLogout}/>}>
        <Route path="/" element={<Home />} />
        <Route path="/donation/:id" element={<Donations />} />
        <Route path="/donations/browse" element={<BrowseDonations />} />
        <Route path="/donations/submit/:id?" element={<SubmitDonation />} />
        <Route path="/donations/my-donations" element={<MyDonations />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/donation-requests" element={<DonationRequests />} />
        <Route path="/profile" element={<Profile user={user} setUser={setUser} handleLogout={handleLogout} />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login setUser={setUser}/>} />
        <Route path="/signup" element={<Signup setUser={setUser}/>} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/notifications" element={<NotificationPage />} />
      </Route>
    </Routes>
  );
}
