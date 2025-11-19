import { isAuthenticated } from "./authApi.js";

/**
 * Redirect user based on role
 * @param {function} navigate - react-router navigate function
 */
export const redirectByRole = (navigate) => {
  const auth = isAuthenticated();

  if (auth && auth.user) {
    const { role } = auth.user;

    if (role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/posts", { replace: true }); // regular user
    }
  } else {
    navigate("/signin", { replace: true });
  }
};
