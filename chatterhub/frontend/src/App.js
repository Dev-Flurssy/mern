import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./Layout.js";

import Home from "./pages/Home.js";
import About from "./pages/About.js";
import Contact from "./pages/Contact.js";
import SignUp from "./pages/Signup.js";
import SignIn from "./pages/Signin.js";
import ForgotPassword from "./pages/ForgotPassword.js";
import NotFound from "./pages/NotFound.js";

import PostCreatePage from "./post/PostCreatePage.js";
import MyPostsPage from "./post/MyPostsPage.js";
import NewsfeedWrapper from "./post/NewsfeedWrapper.js";
import FollowersPage from "./pages/user/FollowersPage.js";
import FollowingPage from "./pages/user/FollowingPage.js";
import AdminDashboard from "./pages/admin/AdminDashboard.js";

import ProtectedRoutes from "./components/routes/ProtectedRoutes.js";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Auth pages */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected user routes */}
        <Route
          path="/posts"
          element={
            <ProtectedRoutes role="user">
              <NewsfeedWrapper />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/my-post"
          element={
            <ProtectedRoutes role="user">
              <MyPostsPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/create/post"
          element={
            <ProtectedRoutes role="user">
              <PostCreatePage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/followers"
          element={
            <ProtectedRoutes role="user">
              <FollowersPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/following"
          element={
            <ProtectedRoutes role="user">
              <FollowingPage />
            </ProtectedRoutes>
          }
        />

        {/* Protected admin route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoutes role="admin">
              <AdminDashboard />
            </ProtectedRoutes>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
