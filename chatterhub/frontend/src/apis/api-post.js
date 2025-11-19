import { isAuthenticated } from "./authApi.js";

const API_BASE = "/api/posts";

/** Get token safely */
const getToken = () => isAuthenticated()?.token || "";

/** List all posts */
export const listAllPosts = async (signal) => {
  const token = getToken();
  const response = await fetch(`${API_BASE}/all`, {
    method: "GET",
    signal,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
};

/** List posts by user */
export const listByUser = async (userId, signal) => {
  const token = getToken();
  const response = await fetch(`${API_BASE}/by/${userId}`, {
    method: "GET",
    signal,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch user posts");
  return response.json();
};

/** Create post (with optional FormData) */
export const createPost = async (postData) => {
  const token = getToken();
  const response = await fetch(`${API_BASE}/create`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: postData,
  });
  return response.ok ? response.json() : { error: "Failed to create post" };
};

/** Like / Unlike post */
export const likePost = async (postId) => {
  const token = getToken();
  const response = await fetch(`${API_BASE}/like`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ postId }),
  });
  return response.json();
};

export const unlikePost = async (postId) => {
  const token = getToken();
  const response = await fetch(`${API_BASE}/unlike`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ postId }),
  });
  return response.json();
};

/** Comment / Uncomment post */
export const commentPost = async (postId, comment) => {
  const token = getToken();
  const response = await fetch(`${API_BASE}/comment`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ postId, comment }),
  });
  return response.json();
};

export const uncommentPost = async (postId, comment) => {
  const token = getToken();
  const response = await fetch(`${API_BASE}/uncomment`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ postId, comment }),
  });
  return response.json();
};

/** Delete post */
export const removePost = async (postId) => {
  const token = getToken();
  const response = await fetch(`${API_BASE}/${postId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

/** Read single post */
export const readPost = async (postId) => {
  const token = getToken();
  const response = await fetch(`${API_BASE}/${postId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
