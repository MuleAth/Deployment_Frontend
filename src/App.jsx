import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import EquipmentPage from "./pages/EquipmentPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import AchievementPage from "./pages/AchievementsPage";
import ProfileCreationPage from "./pages/ProfileCreationPage";
import AboutUsPage from "./pages/AboutUsPage";
import AdminHome from "./admin/AdminHomePage";
import FeedbackForm from "./pages/FeedbackForm";
import Chatbot from "./components/Chatbot";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ProtectedRoute from "./admin/admin-components/ProtectedRoute";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/dashboard";
import Users from "./admin/Users";
import UserDetail from "./admin/UserDetail";
import Departments from "./admin/Departments";
import UsersByDepartment from "./admin/UsersByDepartment";
import AdminEvents from "./admin/Events";
import AdminEventDetail from "./admin/EventDetail";
import Feedback from "./admin/Feedback";
import AdminEquipment from "./admin/Equipment";


const AppContent = () => {
  const location = useLocation();

  // Conditionally hide Navbar and Footer on login and register pages
  const hideNavbarFooter = [
    "/login",
    "/register",
    "/create-profile"
  ].some((path) => location.pathname.startsWith(path)) || location.pathname.startsWith("/admin");

  return (
    <>
      {/* Only show Navbar and Footer if not on login or register page */}
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-profile" element={<ProfileCreationPage />} />
        <Route path="/profile-page" element={<ProfilePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/equipment-list" element={<EquipmentPage />} />
        <Route path="/achievements" element={<AchievementPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/user/feedback" element={<FeedbackForm />} />

        {/* Admin Routes (Protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/users/:id" element={<UserDetail />} />
          <Route path="/admin/departments" element={<Departments />} />
          <Route path="/admin/departments/:department" element={<UsersByDepartment />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/events/:id" element={<AdminEventDetail />} />
          <Route path="/admin/equipment" element={<AdminEquipment />} />

          <Route path="/admin/feedback" element={<Feedback />} />
        </Route>
      </Routes>
      {/* Only show Footer if not on login or register page */}
      {!hideNavbarFooter && <Footer />}

      <Chatbot />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
