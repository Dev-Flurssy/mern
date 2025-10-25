import { isAuthenticated } from "./authApi.js";

/**
 * @param {function} navigate
 */
export const redirectByRole = (navigate) => {
  const auth = isAuthenticated();

  if (auth && auth.user) {
    const { role } = auth.user;
    if (role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      // ✅ Redirect regular users to the Posts page (Newsfeed)
      navigate("/posts", { replace: true });
    }
  } else {
    navigate("/signin", { replace: true });
  }
};
