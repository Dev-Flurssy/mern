import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { isAuthenticated } from "../../apis/authApi.js";
import { list, follow, unfollow } from "../../apis/userApi.js";
import { SocketContext } from "../../context/SocketContextProvider.js";
import "../../styles/User.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const jwt = isAuthenticated();
  const { socket } = useContext(SocketContext);

  // Fetch all users on mount
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    list(signal)
      .then((data) => {
        if (data?.error) setError(data.error);
        else {
          setUsers(data);
          setFilteredUsers(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch users.");
        setLoading(false);
      });

    return () => abortController.abort();
  }, []);

  // Real-time follow/unfollow updates
  useEffect(() => {
    socket?.on("update user follow", ({ userId, followers }) => {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === userId ? { ...u, followers } : u))
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === userId ? { ...u, followers } : u))
      );
    });

    return () => socket?.off("update user follow");
  }, [socket]);

  // Search users
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  // Follow/Unfollow user
  const handleFollowToggle = async (user) => {
    if (!jwt) return;
    const isFollowing = user.followers?.some((f) => f._id === jwt.user._id);
    try {
      let updatedUser;
      if (isFollowing) {
        updatedUser = await unfollow(
          { userId: jwt.user._id },
          { t: jwt.token },
          user._id
        );
      } else {
        updatedUser = await follow(
          { userId: jwt.user._id },
          { t: jwt.token },
          user._id
        );
      }

      if (!updatedUser?.error) {
        // Emit update to all connected clients
        socket?.emit("update user follow", {
          userId: user._id,
          followers: updatedUser.followers,
        });

        // Update local state immediately
        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id ? { ...u, followers: updatedUser.followers } : u
          )
        );
        setFilteredUsers((prev) =>
          prev.map((u) =>
            u._id === user._id ? { ...u, followers: updatedUser.followers } : u
          )
        );
      }
    } catch (err) {
      console.error("Follow toggle failed:", err);
    }
  };

  return (
    <div className="users-page">
      <h1>All Users</h1>

      <input
        type="text"
        placeholder="Search users by name or email"
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
        aria-label="Search users"
      />

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <p>No users found for "{searchTerm}"</p>
      ) : (
        <motion.div
          className="users-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredUsers.map((user) => {
            const isFollowing = user.followers?.some(
              (f) => f._id === jwt.user._id
            );
            return (
              <motion.div
                key={user._id}
                className="user-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={`/api/users/photo/${user._id}`}
                  alt={`Avatar of ${user.name}`}
                  className="avatar"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
                <div className="user-info">
                  <h2>{user.name}</h2>
                  <p>{user.email}</p>
                  <Link to={`/user/${user._id}`}>View Profile</Link>
                </div>
                {user._id !== jwt.user._id && (
                  <button
                    className={`btn-follow ${
                      isFollowing ? "unfollow" : "follow"
                    }`}
                    onClick={() => handleFollowToggle(user)}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
