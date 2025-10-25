import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { isAuthenticated } from "../../apis/authApi.js";
import { read, follow, unfollow } from "../../apis/userApi.js";
import FollowProfileButton from "../../components/FollowProfileButton.js";
import "../../styles/Followers.css";

export default function FollowingPage() {
  const { userId } = useParams();
  const { user: authUser, token } = isAuthenticated();

  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user and following list
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchUser = async () => {
      try {
        const data = await read(userId, signal);
        if (data?.error) return console.error(data.error);

        setUser(data);
        setFollowing(data.following || []);
      } catch (err) {
        if (err.name !== "AbortError")
          console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => abortController.abort();
  }, [userId]);

  const handleFollowToggle = async (followedUser) => {
    if (!authUser) return;

    const isFollowing = followedUser.followers?.some(
      (f) => f._id === authUser._id
    );
    const params = { userId: authUser._id };
    const credentials = { t: token };

    try {
      let updatedUser;
      if (isFollowing) {
        updatedUser = await unfollow(params, credentials, followedUser._id);
      } else {
        updatedUser = await follow(params, credentials, followedUser._id);
      }

      // Update following list in state
      setFollowing((prev) =>
        prev.map((f) => (f._id === updatedUser._id ? updatedUser : f))
      );
    } catch (err) {
      console.error("Follow toggle error:", err);
    }
  };

  if (loading) return <p>Loading following...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="followers-page">
      <h2>{user.name} is Following</h2>
      <div className="followers-container">
        {following.length === 0 && <p>Not following anyone yet.</p>}

        {following.map((followedUser) => (
          <div key={followedUser._id} className="follower-card">
            <Link to={`/user/${followedUser._id}`}>
              <img
                src={`/api/users/photo/${followedUser._id}?t=${Date.now()}`}
                alt={followedUser.name}
                className="follow-avatar"
                onError={(e) => (e.target.src = "/api/users/defaultphoto")}
              />
            </Link>
            <span className="follow-name">{followedUser.name}</span>

            {followedUser._id !== authUser._id && (
              <FollowProfileButton
                following={followedUser.followers?.some(
                  (f) => f._id === authUser._id
                )}
                onButtonClick={() => handleFollowToggle(followedUser)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
