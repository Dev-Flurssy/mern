import { useState, useContext } from "react";
import { isAuthenticated } from "../apis/authApi";
import {
  likePost,
  unlikePost,
  commentPost,
  uncommentPost,
  removePost,
} from "../apis/api-post.js";
import { SocketContext } from "../context/SocketContextProvider.js";

export default function usePostAction(post, onRemove) {
  const { dispatch, socket } = useContext(SocketContext);
  const jwt = isAuthenticated();

  const [values, setValues] = useState({
    like: post.likes?.includes(jwt?.user?._id) || false,
    likes: post.likes || [],
    comments: post.comments || [],
  });

  const clickLike = async () => {
    if (!jwt) return alert("You must be signed in");
    try {
      const apiCall = values.like ? unlikePost : likePost;
      const data = await apiCall({ postId: post._id }, { t: jwt.token });
      if (data.error) return alert(data.error);

      setValues((prev) => ({
        ...prev,
        like: !prev.like,
        likes: data.likes,
      }));

      // Emit to socket
      socket?.emit("update post", { ...post, likes: data.likes });
      dispatch({
        type: "UPDATE_POST",
        payload: { ...post, likes: data.likes },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateComments = async (comment, remove = false) => {
    if (!jwt) return alert("You must be signed in");
    try {
      const apiCall = remove ? uncommentPost : commentPost;
      const data = await apiCall(
        { postId: post._id },
        { t: jwt.token },
        comment
      );
      if (data.error) return alert(data.error);

      setValues((prev) => ({ ...prev, comments: data.comments }));

      // Emit to socket
      socket?.emit("update post", { ...post, comments: data.comments });
      dispatch({
        type: "UPDATE_POST",
        payload: { ...post, comments: data.comments },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async () => {
    if (!jwt) return alert("You must be signed in");
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const data = await removePost({ postId: post._id }, { t: jwt.token });
      if (data.error) return alert(data.error);

      // Remove from socket state
      socket?.emit("delete post", post);
      dispatch({ type: "DELETE_POST", payload: post });
      onRemove && onRemove();
    } catch (err) {
      console.error(err);
    }
  };

  return [values, setValues, clickLike, updateComments, deletePost];
}
