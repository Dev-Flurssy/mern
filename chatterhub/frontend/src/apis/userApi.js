import { isAuthenticated, signout } from "./authApi.js";

const API_BASE = "/api/users";

/** Handle API responses */
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || "Something went wrong";
    } catch {
      errorMessage = await response.text();
    }
    throw new Error(`User API Error ${response.status}: ${errorMessage}`);
  }
  return response.json();
};

/** Get authenticated token */
const getToken = () => isAuthenticated()?.token || "";

/** Read a user */
export const read = async (userId, signal = null) => {
  if (!userId) throw new Error("User ID is required");
  const response = await fetch(`${API_BASE}/${userId}`, {
    method: "GET",
    signal,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return handleResponse(response);
};

/** Follow a user */
export const follow = async (userIdToFollow) => {
  const token = getToken();
  const user = isAuthenticated()?.user;
  if (!token || !user) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE}/follow/`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId: user._id, followId: userIdToFollow }),
  });

  return handleResponse(response);
};

/** Unfollow a user */
export const unfollow = async (userIdToUnfollow) => {
  const token = getToken();
  const user = isAuthenticated()?.user;
  if (!token || !user) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE}/unfollow/`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId: user._id, unfollowId: userIdToUnfollow }),
  });

  return handleResponse(response);
};

/** Get user photo URL */
export const getPhoto = (user) => {
  if (!user?._id) return "/uploads/defaultphoto.png";
  return `/api/users/photo/${user._id}?t=${Date.now()}`;
};

/** Sign out */
export const clearAuth = async (cb) => {
  if (typeof window !== "undefined") localStorage.removeItem("jwt");
  try {
    await signout();
  } catch (err) {
    console.error(err.message);
  }
  cb && cb();
};
