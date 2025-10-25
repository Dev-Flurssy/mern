import { useState, useEffect, useCallback, useContext } from "react";
import { isAuthenticated } from "../apis/authApi.js";
import { follow, unfollow } from "../apis/userApi.js";
import { SocketContext } from "../context/SocketContextProvider.js";

export default function useFollow(initialUser) {
  const [user, setUser] = useState(initialUser);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const jwt = isAuthenticated();
  const { dispatch } = useContext(SocketContext); // access socket dispatch if needed

  const checkFollow = useCallback(
    (profileUser) => {
      if (!jwt?.user || !profileUser?.followers) return false;
      return profileUser.followers.some((f) => f._id === jwt.user._id);
    },
    [jwt]
  );

  useEffect(() => {
    if (initialUser) {
      setFollowing(checkFollow(initialUser));
      setLoading(false);
    }
  }, [initialUser, checkFollow]);

  const handleFollowToggle = async () => {
    if (!jwt) return;

    try {
      let updatedUser;
      if (following) {
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

      if (updatedUser?.error) {
        console.error(updatedUser.error);
      } else {
        setUser(updatedUser);
        setFollowing(!following);

        // Optional: dispatch a "FOLLOW_UPDATE" event to SocketContext if you want
        dispatch &&
          dispatch({
            type: "UPDATE_USER_FOLLOW",
            payload: {
              userId: updatedUser._id,
              followers: updatedUser.followers,
            },
          });
      }
    } catch (err) {
      console.error("Follow toggle failed:", err);
    }
  };

  return {
    user,
    following,
    loading,
    handleFollowToggle,
    setUser,
  };
}
