import { useState, useContext } from "react";
import { Avatar, Button, TextField, IconButton } from "@mui/material";
import { isAuthenticated } from "../apis/authApi.js";
import {
  likePost,
  unlikePost,
  commentPost,
  uncommentPost,
} from "../apis/api-post.js";
import { SocketContext } from "../context/SocketContextProvider.js";
import "../styles/Post.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function Post({ post, onRemove }) {
  const { socket, dispatch } = useContext(SocketContext);
  const jwt = isAuthenticated();
  const [commentText, setCommentText] = useState("");

  // Normalize post on load
  const normalizedPost = {
    ...post,
    likes: post.likes || [],
    comments: post.comments || [],
  };

  const isLiked = normalizedPost.likes.some((id) => id === jwt.user._id);

  const handleLikeToggle = async () => {
    if (!jwt) return;
    try {
      const apiCall = isLiked ? unlikePost : likePost;
      const updatedPost = await apiCall(
        { postId: normalizedPost._id },
        { t: jwt.token }
      );

      const normalized = {
        ...updatedPost,
        likes: updatedPost.likes || [],
        comments: updatedPost.comments || [],
      };

      socket?.emit("update post", normalized);
      dispatch({ type: "UPDATE_POST", payload: normalized });
    } catch (err) {
      console.error("Like toggle failed:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const updatedPost = await commentPost(
        { postId: normalizedPost._id, comment: { text: commentText } },
        { t: jwt.token }
      );

      const normalized = {
        ...updatedPost,
        likes: updatedPost.likes || [],
        comments: updatedPost.comments || [],
      };

      socket?.emit("update post", normalized);
      dispatch({ type: "UPDATE_POST", payload: normalized });
      setCommentText("");
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  const handleUncomment = async (c) => {
    try {
      const updatedPost = await uncommentPost(
        { postId: normalizedPost._id, comment: { _id: c._id } },
        { t: jwt.token }
      );

      const normalized = {
        ...updatedPost,
        likes: updatedPost.likes || [],
        comments: updatedPost.comments || [],
      };

      socket?.emit("update post", normalized);
      dispatch({ type: "UPDATE_POST", payload: normalized });
    } catch (err) {
      console.error("Uncomment failed:", err);
    }
  };

  const isOwner = normalizedPost.postedBy._id === jwt.user._id;

  return (
    <div className="post-card">
      <div className="post-header">
        <Avatar
          src={`/api/users/photo/${normalizedPost.postedBy._id}`}
          alt={normalizedPost.postedBy.name}
          onError={(e) => (e.target.src = "/api/users/defaultphoto")}
        />
        <div className="post-user-info">
          <h4>{normalizedPost.postedBy.name}</h4>
          <small>{new Date(normalizedPost.createdAt).toLocaleString()}</small>
        </div>
        {isOwner && (
          <Button
            size="small"
            color="secondary"
            onClick={() => onRemove && onRemove(normalizedPost)}
          >
            Delete
          </Button>
        )}
      </div>

      {normalizedPost.text && (
        <p className="post-text">{normalizedPost.text}</p>
      )}
      {normalizedPost.photo?.data && (
        <img
          className="post-photo"
          src={`/api/posts/photo/${normalizedPost._id}`}
          alt="Post"
        />
      )}

      <div className="post-actions">
        <IconButton onClick={handleLikeToggle}>
          {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
        </IconButton>
        <span>{normalizedPost.likes.length}</span>
        <span>{normalizedPost.comments.length} comments</span>
      </div>

      <div className="post-comments">
        {normalizedPost.comments.map((c) => (
          <div key={c._id} className="post-comment">
            <strong>{c.postedBy.name}:</strong> {c.text}
            {c.postedBy._id === jwt.user._id && (
              <Button size="small" onClick={() => handleUncomment(c)}>
                Delete
              </Button>
            )}
          </div>
        ))}

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <TextField
            placeholder="Write a comment..."
            fullWidth
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button type="submit">Post</Button>
        </form>
      </div>
    </div>
  );
}
