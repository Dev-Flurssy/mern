import { useContext, useEffect, useMemo } from "react";
import { SocketContext } from "../context/SocketContextProvider.js";
import Post from "./Post";
import PostCreate from "./PostCreate.js";
import { listNewsFeed } from "../apis/api-post.js";
import { isAuthenticated } from "../apis/authApi.js";

export default function Newsfeed({ showCreate = true }) {
  const { posts, dispatch, socket } = useContext(SocketContext);
  const jwt = useMemo(() => isAuthenticated(), []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchPosts = async () => {
      try {
        const data = await listNewsFeed(
          { userId: jwt.user._id },
          { t: jwt.token },
          controller.signal
        );
        if (Array.isArray(data)) {
          const normalizedPosts = data.map((p) => ({
            ...p,
            likes: Array.isArray(p.likes) ? p.likes : [],
            comments: Array.isArray(p.comments) ? p.comments : [],
          }));
          dispatch({ type: "SET_POSTS", payload: normalizedPosts });
        }
      } catch (err) {
        console.error("Failed to load posts:", err);
      }
    };
    fetchPosts();
    return () => controller.abort();
  }, [jwt, dispatch]);

  // Socket listeners...
  useEffect(() => {
    if (!socket) return;
    const handleLikes = (post) =>
      dispatch({ type: "UPDATE_POST_LIKES", payload: post });
    const handleFollow = (userUpdate) =>
      dispatch({ type: "UPDATE_USER_FOLLOW", payload: userUpdate });
    socket.on("update likes", handleLikes);
    socket.on("update follow", handleFollow);
    return () => {
      socket.off("update likes", handleLikes);
      socket.off("update follow", handleFollow);
    };
  }, [socket, dispatch]);

  return (
    <div className="newsfeed-container">
      {showCreate && <PostCreate />} {/* only show create box if allowed */}
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            onRemove={() => dispatch({ type: "DELETE_POST", payload: post })}
          />
        ))
      )}
    </div>
  );
}
