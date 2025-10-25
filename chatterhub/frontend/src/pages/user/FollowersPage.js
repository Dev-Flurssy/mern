import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { isAuthenticated } from "../../apis/authApi.js";
import { read, follow, unfollow } from "../../apis/userApi.js";
import FollowProfileButton from "../../components/FollowProfileButton.js";
import "../../styles/Followers.css";

export default function FollowersPage() {
  const { userId } = useParams();
  const { user: authUser, token } = isAuthenticated();

  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user and followers
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchUser = async () => {
      try {
        const data = await read(userId, signal);
        if (data?.error) return console.error(data.error);

        setUser(data);
        setFollowers(data.followers || []);
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

  const handleFollowToggle = async (follower) => {
    if (!authUser) return;

    const isFollowing = follower.followers?.some((f) => f._id === authUser._id);
    const params = { userId: authUser._id };
    const credentials = { t: token };

    try {
      let updatedFollower;
      if (isFollowing) {
        updatedFollower = await unfollow(params, credentials, follower._id);
      } else {
        updatedFollower = await follow(params, credentials, follower._id);
      }

      // Update followers list in state
      setFollowers((prev) =>
        prev.map((f) => (f._id === updatedFollower._id ? updatedFollower : f))
      );
    } catch (err) {
      console.error("Follow toggle error:", err);
    }
  };

  if (loading) return <p>Loading followers...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="followers-page">
      <h2>{user.name}'s Followers</h2>
      <div className="followers-container">
        {followers.length === 0 && <p>No followers yet.</p>}

        {followers.map((follower) => (
          <div key={follower._id} className="follower-card">
            <Link to={`/user/${follower._id}`}>
              <img
                src={`/api/users/photo/${follower._id}?t=${Date.now()}`}
                alt={follower.name}
                className="follow-avatar"
                onError={(e) => (e.target.src = "/api/users/defaultphoto")}
              />
            </Link>
            <span className="follow-name">{follower.name}</span>

            {follower._id !== authUser._id && (
              <FollowProfileButton
                following={follower.followers?.some(
                  (f) => f._id === authUser._id
                )}
                onButtonClick={() => handleFollowToggle(follower)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
