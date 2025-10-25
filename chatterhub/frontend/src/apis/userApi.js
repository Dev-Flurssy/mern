import { isAuthenticated, signout } from "./authApi.js";

const API_BASE = "/api/users";

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
    throw new Error(`User API Error ${response.status}: ${errorMessage}`);
  }
  return response.json();
};

// Create a new user
export const create = async (user) => {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return handleResponse(response);
};

// List all users
export const list = async (signal) => {
  const response = await fetch(API_BASE, {
    method: "GET",
    signal,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${isAuthenticated()?.token}`,
    },
  });
  return handleResponse(response);
};

// Read a specific user
export const read = async (userId, signal = null) => {
  if (!userId) throw new Error("User ID is required for read()");
  const response = await fetch(`${API_BASE}/${userId}`, {
    method: "GET",
    signal, // null is fine
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${isAuthenticated()?.token}`,
    },
  });
  return handleResponse(response);
};

// Update a user (with optional photo)
export const update = async (userId, data) => {
  if (!userId) throw new Error("User ID is required for update()");
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && key !== "photo") {
      formData.append(key, data[key]);
    }
  });

  if (data.photo instanceof File) {
    formData.append("photo", data.photo);
  }

  const response = await fetch(`${API_BASE}/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${isAuthenticated()?.token}`,
    },
    body: formData,
  });
  return handleResponse(response);
};

// Delete a user
export const remove = async (userId) => {
  if (!userId) throw new Error("User ID is required for remove()");
  const response = await fetch(`${API_BASE}/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${isAuthenticated()?.token}`,
    },
  });
  return handleResponse(response);
};

// Follow another user
export const follow = async (params, credentials, followId) => {
  try {
    const response = await fetch(`${API_BASE}/follow/`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.t}`,
      },
      body: JSON.stringify({
        userId: params.userId,
        followId,
      }),
    });
    return await response.json();
  } catch (err) {
    console.error("Follow error:", err);
  }
};

// Unfollow a user
export const unfollow = async (params, credentials, unfollowId) => {
  try {
    const response = await fetch(`${API_BASE}/unfollow/`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.t}`,
      },
      body: JSON.stringify({
        userId: params.userId,
        unfollowId,
      }),
    });
    return await response.json();
  } catch (err) {
    console.error("Unfollow error:", err);
  }
};

// Find people to follow
export const findPeople = async (params, credentials, signal) => {
  try {
    const response = await fetch(`${API_BASE}/findpeople/${params.userId}`, {
      method: "GET",
      signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.t}`,
      },
    });
    return await response.json();
  } catch (err) {
    console.error("FindPeople error:", err);
  }
};

// Clear auth and sign out
export const clearAuth = async (cb) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
  }

  try {
    await signout(); // handles response internally
  } catch (err) {
    console.error(err.message);
  }

  if (typeof cb === "function") {
    cb();
  }
};

// Get user photo URL
export const getPhoto = (user) => {
  if (!user?._id) return "/uploads/defaultphoto.png";
  return `/api/users/photo/${user._id}?t=${Date.now()}`;
};
