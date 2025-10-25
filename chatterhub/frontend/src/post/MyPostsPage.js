import { useContext, useMemo } from "react";
import { SocketContext } from "../context/SocketContextProvider";
import { isAuthenticated } from "../apis/authApi";
import Post from "../post/Post.js";
import "../styles/Post.css";

export default function MyPostsPage() {
  const { posts } = useContext(SocketContext); // all posts from context
  const { user } = isAuthenticated(); // logged-in user

  // Filter posts created by this user
  const userPosts = useMemo(
    () => posts.filter((p) => p.postedBy?._id === user?._id),
    [posts, user?._id]
  );

  return (
    <div className="post-page">
      <div className="post-page-header">
        <h2 className="post-page-title">My Posts ({userPosts.length})</h2>
      </div>

      <div className="post-page-container">
        {userPosts.length > 0 ? (
          userPosts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <p>You haven’t created any posts yet.</p>
        )}
      </div>
    </div>
  );
}
