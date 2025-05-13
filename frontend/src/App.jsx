import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import Footer from "./Routes/Homepage/Footer";
import Header from "./Routes/Homepage/Header";
import HeroSection from "./Routes/Homepage/HeroSection";
import RecentEventsSection from "./Routes/Homepage/RecentEventsSection";
import CategoriesSection from "./Routes/Homepage/CategoriesSection";
import PopularEventsSection from "./Routes/Homepage/PopularEventsSection";
import TrendingOrganizersSection from "./Routes/Homepage/TrendingOrganizersSection";
import EventsPage from "./Routes/Events/EventsPage";
import Login from "./Routes/Login/login";
import Signup from "./Routes/signUp/signup";
import VerifyEmail from "./Routes/VerifyEmail/VerifyEmail";
import OtpVerify from "./Routes/ForgetPassword/otpVerify";
import ForgotPassword from "./Routes/ForgetPassword/forgetpassword";
import NewPassword from "./Routes/ForgetPassword/NewPassword";
import AdminLogin from "./Routes/LoginAdmin/adminlogin";
import EventDetail from "./Routes/EventDetail/EventDetail";
import ProfilePage from "./Routes/ProfilePage/ProfilePage.jsx";
import ProfilePageVisitor from "./Routes/ProfilePageVisitor/ProfilePageVisitor.jsx";
import EventFormWrapper from "./Routes/Form/event-form-wrapper.jsx";

// Admin components
import AdminLayout from "./components/layout/Layout";
import Dashboard from "./AdminPanel/Dashboard";
import Organizers from "./AdminPanel/Organizers";
import Events from "./AdminPanel/Events";
import OrganizersSubmission from "./AdminPanel/OrganizersSubmission";
import EventsSubmission from "./AdminPanel/EventsSubmission";
import Admins from "./AdminPanel/Admins";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/adminlogin" replace />;
  }
  return children;
};

function RootLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

function Homepage() {
  return (
    <>
      <HeroSection />
      <RecentEventsSection />
      <CategoriesSection />
      <PopularEventsSection />
      <TrendingOrganizersSection />
    </>
  );
}

function AdminWrapper() {
  return (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "events",
        element: <EventsPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/verifyemail",
    element: <VerifyEmail />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword />,
  },
  {
    path: "/otpverify",
    element: <OtpVerify />,
  },
  {
    path: "/adminlogin",
    element: <AdminLogin />,
  },
  {
    path: "/newpassword",
    element: <NewPassword />,
  },
  {
    path: "/event/:eventId",
    element: <EventDetail />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/form",
    element: <EventFormWrapper />,
  },
  {
    path: "/visitor/:organizerId",
    element: <ProfilePageVisitor />,
  },
  // Admin routes
  {
    path: "/admin",
    element: <AdminWrapper />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "organizers",
        element: <Organizers />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "organizers-submission",
        element: <OrganizersSubmission />,
      },
      {
        path: "events-submission",
        element: <EventsSubmission />,
      },
      {
        path: "admins",
        element: <Admins />,
      },
    ],
  },
]);