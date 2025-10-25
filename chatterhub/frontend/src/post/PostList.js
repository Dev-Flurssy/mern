import PropTypes from "prop-types";
import Post from "./Post";
import "../styles/Post.css";

export default function PostList({ posts }) {
  if (!Array.isArray(posts)) return null; // Prevent the posts.map error
  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  removeUpdate: PropTypes.func.isRequired,
};
