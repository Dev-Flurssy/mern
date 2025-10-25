import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { isAuthenticated } from "../../apis/authApi.js";
import { read } from "../../apis/userApi.js";
import { listByUser } from "../../apis/api-post.js";
import DeleteUser from "../../components/DeleteUser.js";
import "../../styles/Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userId } = useParams();
  const navigate = useNavigate();
  const jwt = isAuthenticated();

  // Fetch user info
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchUser = async () => {
      try {
        const data = await read(userId, signal);
        if (data?.error) navigate("/signin");
        else setUser(data);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => abortController.abort();
  }, [userId, navigate]);

  // Fetch posts by this user
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchUserPosts = async () => {
      try {
        const data = await listByUser({ userId }, jwt?.token, signal);
        setUserPosts(data || []);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
    };

    fetchUserPosts();

    return () => abortController.abort();
  }, [userId, jwt?.token]);

  const isOwner = jwt?.user?._id === user?._id;

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <main className="profile-page">
      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-avatar">
            <img
              src={`/api/users/photo/${user._id}?t=${Date.now()}`}
              alt={user.name ? `Profile of ${user.name}` : "Default profile"}
              onError={(e) => (e.target.src = "/api/users/defaultphoto")}
            />
          </div>

          <div className="profile-info">
            <h2>{user.name}</h2>
            <p className="email">{user.email}</p>
            {user.about && <p className="about">{user.about}</p>}
            {user.createdAt && (
              <p className="joined">
                Joined: {new Date(user.createdAt).toDateString()}
              </p>
            )}

            <div className="profile-counts">
              <Link to={`/user/${user._id}/followers`} className="count-link">
                Followers: {user.followers?.length || 0}
              </Link>
              <Link to={`/user/${user._id}/following`} className="count-link">
                Following: {user.following?.length || 0}
              </Link>
              <Link to={`/user/${user._id}/posts`} className="count-link">
                Posts: {userPosts.length}
              </Link>
            </div>
          </div>

          {isOwner && (
            <div className="profile-actions">
              <Link to={`/user/edit/${user._id}`} className="btn-edit">
                Edit Profile
              </Link>
              <DeleteUser userId={user._id} className="delete-button" />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
