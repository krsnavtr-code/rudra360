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

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="contact" element={<ContactUs />} />
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
        <Route path="owner-info" element={<OwnerInfo />} />

        {/* Add more admin routes here */}
      </Route>

      {/* Not Found Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
