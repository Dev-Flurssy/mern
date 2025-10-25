import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./Layout.js";

import Home from "./pages/Home.js";
import About from "./pages/About.js";
import Contact from "./pages/Contact.js";
import SignUp from "./pages/Signup.js";
import SignIn from "./pages/Signin.js";
import ForgotPassword from "./pages/ForgotPassword.js";
import NotFound from "./pages/NotFound.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
