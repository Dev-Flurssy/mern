import { createContext, useReducer, useEffect } from "react";
import io from "socket.io-client";
import { isAuthenticated } from "../apis/authApi.js";
import { listByUser } from "../apis/api-post.js";

export const SocketContext = createContext();

const initialState = {
  posts: [],
  onlineUsers: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_POSTS":
      return { ...state, posts: action.payload };

    case "ADD_POST":
      return { ...state, posts: [action.payload, ...state.posts] };

    case "DELETE_POST":
      return {
        ...state,
        posts: state.posts.filter((p) => p._id !== action.payload._id),
      };

    case "UPDATE_POST":
      return {
        ...state,
        posts: state.posts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        ),
      };

    case "UPDATE_USER_FOLLOW":
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.postedBy._id === action.payload.userId
            ? {
                ...p,
                postedBy: {
                  ...p.postedBy,
                  followers: action.payload.followers,
                },
              }
            : p
        ),
      };

    case "SET_ONLINE_USERS":
      return { ...state, onlineUsers: action.payload };

    default:
      return state;
  }
}

export default function SocketContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const jwt = isAuthenticated();

  useEffect(() => {
    if (!jwt?.user?._id) return;

    // 1️⃣ Connect to socket
    const socket = io(
      process.env.REACT_APP_BACKEND_URL || "http://localhost:5000",
      {
        transports: ["websocket"],
        query: { userId: jwt.user._id },
      }
    );

    socket.on("connect", () => console.log("Connected to socket server"));
    socket.on("disconnect", () => console.log("Disconnected from socket"));

    // 2️⃣ Socket listeners
    socket.on("newPost", (post) =>
      dispatch({ type: "ADD_POST", payload: post })
    );
    socket.on("deletePost", (post) =>
      dispatch({ type: "DELETE_POST", payload: post })
    );
    socket.on("updatePost", (post) =>
      dispatch({ type: "UPDATE_POST", payload: post })
    );
    socket.on("onlineUsers", (users) =>
      dispatch({ type: "SET_ONLINE_USERS", payload: users })
    );

    // 3️⃣ Preload user's posts on mount
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchPosts = async () => {
      try {
        const posts = await listByUser(
          { userId: jwt.user._id },
          jwt.token,
          signal
        );
        dispatch({ type: "SET_POSTS", payload: posts });
      } catch (err) {
        if (err.name !== "AbortError")
          console.error("Failed to load posts:", err);
      }
    };

    fetchPosts();

    return () => {
      socket.disconnect();
      abortController.abort();
    };
  }, [jwt?.user?._id, jwt?.token]);

  return (
    <SocketContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SocketContext.Provider>
  );
}
