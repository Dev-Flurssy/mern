const AUTH_BASE = "/api/auth";

// Unified response handler
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

// Signup a new user
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

// Signin an existing user
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

  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
  }

  return data;
};

// Signout the user
export const signout = async () => {
  const response = await fetch(`${AUTH_BASE}/signout`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Signout failed: ${errorText}`);
  }

  const data = await response.text(); // or .json() if your backend returns JSON

  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
  }

  return data;
};

// Store JWT manually
export const authenticate = (jwt, cb) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(jwt));
  }
  cb && cb();
};

// Retrieve JWT from localStorage
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  const jwt = localStorage.getItem("jwt");
  return jwt ? JSON.parse(jwt) : false;
};

// Clear JWT and signout
export const clearJWT = async (cb) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
  }

  try {
    await signout();
  } catch (err) {
    console.error("Signout failed:", err.message);
  }

  cb && cb();
};
