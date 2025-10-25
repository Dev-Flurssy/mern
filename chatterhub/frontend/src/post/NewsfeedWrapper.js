import { useEffect, useState } from "react";
import { isAuthenticated } from "../apis/authApi";
import { listAllPosts } from "../apis/api-post";
import Post from "../post/Post.js";
import "../styles/Post.css";

export default function NewsfeedWrapper() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const { token } = isAuthenticated();

    listAllPosts(token, signal).then((data) => {
      if (Array.isArray(data)) setPosts(data);
    });

    return () => abortController.abort();
  }, []);

  return (
    <div className="post-page">
      <div className="post-page-header">
        <h2>Community Posts</h2>
      </div>

      <div className="profile-posts-section">
        <h3>All Posts</h3>
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
}
