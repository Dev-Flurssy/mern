import { useState, useContext } from "react";
import { isAuthenticated } from "../apis/authApi";
import { createPost } from "../apis/api-post";
import { SocketContext } from "../context/SocketContextProvider.js";
import "../styles/Post.css";

export default function PostCreate() {
  const [values, setValues] = useState({ text: "", photo: "", error: "" });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { dispatch, socket } = useContext(SocketContext);

  const jwt = isAuthenticated();

  const handleChange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    setValues({ ...values, [name]: value });
    if (name === "photo" && e.target.files[0])
      setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const clickPost = async () => {
    if (!jwt) return setValues({ ...values, error: "You must be signed in" });
    if (!values.text.trim())
      return setValues({ ...values, error: "Post text cannot be empty" });

    setLoading(true);
    const postData = new FormData();
    postData.append("text", values.text);
    if (values.photo) postData.append("photo", values.photo);

    try {
      const data = await createPost(
        { userId: jwt.user._id },
        { t: jwt.token },
        postData
      );
      if (data.error) setValues({ ...values, error: data.error });
      else {
        // Reset form
        setValues({ text: "", photo: "", error: "" });
        setPreview(null);

        // Normalize new post
        const newPost = { ...data, likes: [], comments: [] };

        // Add to global state & emit socket
        dispatch({ type: "NEW_POST", payload: newPost });
        socket?.emit("new post", newPost);
      }
    } catch (err) {
      setValues({ ...values, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-create-card">
      <h3>Share your thoughts 💭</h3>
      {values.error && <div className="error">{values.error}</div>}

      <textarea
        placeholder="Write something..."
        value={values.text}
        onChange={handleChange("text")}
      />

      <label className="file-label">
        <input
          type="file"
          accept="image/*"
          onChange={handleChange("photo")}
          hidden
        />
        <span className="upload-btn">📸 Add Photo</span>
      </label>

      {preview && (
        <div className="image-preview">
          <img src={preview} alt="Preview" />
        </div>
      )}

      <button onClick={clickPost} disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>
    </div>
  );
}
