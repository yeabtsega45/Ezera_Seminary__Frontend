// App.jsx
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, setAuthReady } from "./redux/authSlice";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/user/Home";
import SabbathSchool from "@/pages/user/SabbathSchool";
import UserProfile from "@/pages/user/UserProfile";
import ProfileSettings from "@/pages/user/ProfileSettings";
import Devotion from "@/pages/user/Devotion";
import AboutUs from "@/pages/user/AboutUs";
import ContactUs from "@/pages/user/ContactUs";
import NotMatch from "@/pages/user/NotMatch";
import Login from "@/pages/user/Login";
import Signup from "@/pages/user/Signup";
import Footer from "./components/Footer";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CoursesAvailable from "@/features/courses/user/CoursesAvailable";
import ChaptersDisplay from "@/features/courses/user/ChaptersDisplay";
import SlidesDisplay from "@/features/courses/user/SlidesDisplay";
import SSLQuarter from "@/features/sabbathSchool/SSLQuarter";
import SSLDay from "@/features/sabbathSchool/SSLDay";
import DisplaySSLLesson from "@/features/sabbathSchool/DisplaySSLLesson";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthReady = useSelector((state) => state.auth.isAuthReady);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch(login(user)); // Dispatch the login action
    }

    dispatch(setAuthReady(true)); // Dispatch the setAuthReady action
  }, [dispatch]);

  if (!isAuthReady) {
    return <div>Loading...</div>; // Or a  loading spinner
  }

  // Private Route for Admin
  const PrivateAdminRoute = ({ children }) => {
    if (user && user.role === "Admin") {
      return children;
    } else {
      return <Navigate to="/" replace={true} />;
    }
  };

  PrivateAdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const PrivateUserRoute = ({ children }) => {
    if (user) {
      return children;
    } else {
      return <Navigate to="/login" replace={true} />;
    }
  };

  PrivateUserRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  // Public Route (redirect if logged in)
  const PublicRoute = ({ children }) => {
    return !user ? children : <Navigate to="/" replace={true} />;
  };

  PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/courses/get/:courseId" element={<ChaptersDisplay />} />
        <Route
          path="/courses/get/:courseId/chapter/:chapterId"
          element={<SlidesDisplay />}
        />
        <Route path="/sabbathSchool" element={<SabbathSchool />} />
        <Route path="/sabbathSchool/:quarter" element={<SSLQuarter />} />
        <Route path="/sabbathSchool/:quarter/lessons/:id" element={<SSLDay />}>
          <Route path="days/:day/read" element={<DisplaySSLLesson />} />
        </Route>
        <Route path="/devotion" element={<Devotion />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/courses" element={<CoursesAvailable />} />
        <Route
          path="/profile"
          element={
            <PrivateUserRoute>
              <UserProfile />
            </PrivateUserRoute>
          }
        />
        <Route
          path="/profile/settings"
          element={
            <PrivateUserRoute>
              <ProfileSettings />
            </PrivateUserRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/admin/*"
          element={
            <PrivateAdminRoute>
              <AdminDashboard />
            </PrivateAdminRoute>
          }
        />

        {/* Public Routes (Redirect if logged in) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Not Found Route */}
        <Route path="*" element={<NotMatch />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
