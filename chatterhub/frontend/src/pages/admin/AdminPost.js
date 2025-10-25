import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import { getPosts, deletePost } from "../../apis/postApi.js";

/* If you want, I can also provide postApi.js and implement full CRUD for posts, 
so admins can create, edit, and delete posts directly from their dashboard.
Create postApi.js to fetch, delete, and manage posts.
Add role-based protection so only admins can access /admin.
Style tables and lists using CSS Grid or Flexbox for a clean admin UI.
Later, add search/filter for users/posts.*/

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((err) => console.error(err.message));
  }, []);

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId);
      setPosts(posts.filter((p) => p._id !== postId));
    }
  };

  return (
    <>
      <Navbar />
      <main className="admin-page">
        <h1>Manage Posts</h1>
        <ul className="admin-posts">
          {posts.map((post) => (
            <li key={post._id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <button
                onClick={() => handleDelete(post._id)}
                className="btn-danger"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
