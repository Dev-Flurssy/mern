import PostCreate from "./PostCreate";
import "../styles/Post.css";

export default function PostCreatePage() {
  return (
    <div className="post-create-page">
      <h2>Create a New Post</h2>
      <PostCreate />
    </div>
  );
}
