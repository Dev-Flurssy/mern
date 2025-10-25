// Create a post with optional photo
export const createPost = async (params, credentials, postData) => {
  try {
    const response = await fetch(`/api/posts/create`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credentials.t, // JWT token
      },
      body: postData, // FormData (do NOT set Content-Type manually)
    });
    return await response.json();
  } catch (err) {
    console.error("createPost error:", err);
    return { error: err.message };
  }
};

export const listNewsFeed = async (params, credentials, signal) => {
  try {
    const response = await fetch(`/api/posts/feed/${params.userId}`, {
      method: "GET",
      signal,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credentials.t,
        "Cache-Control": "no-store",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch news feed: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("listNewsFeed error:", err);
    }
    return []; // always return array to prevent .map() errors
  }
};

export const listAllPosts = async (token, signal) => {
  try {
    const response = await fetch("/api/posts/all", {
      method: "GET",
      signal,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("listAllPosts error:", err);
    }
    return [];
  }
};

export const listByUser = async (params, credentials, signal) => {
  try {
    let response = await fetch("/api/posts/by/" + params.userId, {
      method: "GET",
      signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials,
      },
    });
    const data = await response.json();
    console.log("User posts fetched:", data); // ← check here
    if (!response.ok) throw new Error("Failed to fetch user posts");
    return data;
  } catch (err) {
    if (err.name !== "AbortError") console.error("listByUser error:", err);
    return [];
  }
};

export const likePost = async (params, credentials) => {
  try {
    let response = await fetch("/api/posts/like", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ postId: params.postId }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const unlikePost = async (params, credentials) => {
  try {
    let response = await fetch("/api/posts/unlike", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ postId: params.postId }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const commentPost = async (params, credentials, comment) => {
  try {
    let response = await fetch("/api/posts/comment", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ postId: params.postId, comment }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const uncommentPost = async (params, credentials, comment) => {
  try {
    let response = await fetch("/api/posts/uncomment", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ postId: params.postId, comment }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const removePost = async (params, credentials) => {
  try {
    let response = await fetch("/api/posts/" + params.postId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const readPost = async (params, credentials) => {
  try {
    let response = await fetch("/api/posts/" + params.postId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
