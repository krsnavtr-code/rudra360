// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MediaGallery from "./components/admin/MediaUploder.jsx";
import MediaTags from "./pages/admin/MediaTags.jsx";
import ImageGallery from "./pages/admin/MediaGallery.jsx";
import Users from "./pages/admin/Users";
import OwnerInfo from "./pages/admin/OwnerInfo";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AccountSettings from "./pages/AccountSettings";
import ContactUs from "./pages/ContactUs";
import ContactInquiries from "./pages/admin/ContactInquiries";
import Portfolio from "./pages/admin/Portfolio";
import Privacy from "./pages/Privacy";
import TermsOfUse from "./pages/TermsOfUse";
import AboutUs from "./pages/AboutUs";
import CorporateAwards from "./pages/CorporateAwards";
import VirtualAwards from "./pages/VirtualAwards";
import TechnicalGalas from "./pages/TechnicalGalas";
import CaseStudies from "./pages/CaseStudies";
import CulturalEvents from "./pages/CulturalEvents";
import HallOfFame from "./pages/HallOfFame";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="corporate-awards" element={<CorporateAwards />} />
        <Route path="virtual-awards" element={<VirtualAwards />} />
        <Route path="technical-galas" element={<TechnicalGalas />} />
        <Route path="case-studies" element={<CaseStudies />} />
        <Route path="cultural-events" element={<CulturalEvents />} />
        <Route path="hall-of-fame" element={<HallOfFame />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<TermsOfUse />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin Routes - Protected and Admin Only */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="media-gallery" element={<ImageGallery />} />
        <Route path="media-gallery/upload" element={<MediaGallery />} />
        <Route path="media/tags" element={<MediaTags />} />
        <Route path="users" element={<Users />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="owner-info" element={<OwnerInfo />} />
        <Route path="contact-inquiries" element={<ContactInquiries />} />

        {/* Add more admin routes here */}
      </Route>

      {/* Not Found Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
