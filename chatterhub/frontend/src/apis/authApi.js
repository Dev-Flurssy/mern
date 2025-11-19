const AUTH_BASE = "/api/auth";

/** Unified response handler */
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || "Something went wrong";
    } catch {
      errorMessage = await response.text();
    }
    throw new Error(`Auth Error ${response.status}: ${errorMessage}`);
  }
  return response.json();
};

/** Sign up a new user */
export const signup = async (user) => {
  const response = await fetch(`${AUTH_BASE}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return handleResponse(response);
};

/** Sign in existing user */
export const signin = async (user) => {
  const response = await fetch(`${AUTH_BASE}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include", // for cookie support
    body: JSON.stringify(user),
  });

  const data = await handleResponse(response);

  // Store JWT and user in localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
  }

  return data;
};

/** Sign out */
export const signout = async () => {
  const response = await fetch(`${AUTH_BASE}/signout`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Signout failed: ${errorText}`);
  }

  if (typeof window !== "undefined") localStorage.removeItem("jwt");
  return response.json();
};

/** Store JWT manually */
export const authenticate = (jwt, cb) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(jwt));
    cb && setTimeout(cb, 50); // ensure callback runs after storage
  }
};

/** Check if user is authenticated */
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  try {
    const jwt = JSON.parse(localStorage.getItem("jwt"));
    return jwt ? jwt : false;
  } catch (error) {
    console.error("Invalid JWT in localStorage:", error);
    return false;
  }
};

/** Clear JWT and sign out */
export const clearJWT = async (cb) => {
  if (typeof window !== "undefined") localStorage.removeItem("jwt");

  try {
    await signout();
  } catch (err) {
    console.error("Signout failed:", err.message);
  }

  cb && cb();
};
