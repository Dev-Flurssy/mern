import { useState, useEffect, useContext } from "react";
import { Avatar, Button, Snackbar } from "@mui/material";
import { isAuthenticated } from "../../apis/authApi.js";
import { findPeople, follow } from "../../apis/userApi.js";
import { Link } from "react-router-dom";
import { SocketContext } from "../../context/SocketContextProvider.js";
import "./FindPeopleGrid.css";

export default function FindPeopleGrid({ onUserFollow }) {
  const [values, setValues] = useState({
    users: [],
    open: false,
    followMessage: "",
  });

  const jwt = isAuthenticated();
  const { socket } = useContext(SocketContext);

  // Fetch suggested users to follow
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    findPeople({ userId: jwt.user._id }, { t: jwt.token }, signal).then(
      (data) => {
        if (!data?.error) setValues((v) => ({ ...v, users: data }));
        else console.error(data.error);
      }
    );

    return () => abortController.abort();
  }, [jwt.user._id, jwt.token]);

  // Listen to real-time follow updates
  useEffect(() => {
    socket?.on("update user follow", ({ userId, followers }) => {
      setValues((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u._id === userId ? { ...u, followers } : u
        ),
      }));
    });
    return () => socket?.off("update user follow");
  }, [socket]);

  const handleFollow = (user, index) => {
    follow({ userId: jwt.user._id }, { t: jwt.token }, user._id).then(
      (data) => {
        if (data?.error) {
          console.error(data.error);
        } else {
          // Remove followed user from suggestions
          const updatedUsers = [...values.users];
          updatedUsers.splice(index, 1);

          setValues({
            ...values,
            users: updatedUsers,
            open: true,
            followMessage: `Following ${user.name}!`,
          });

          // Notify parent to update followers live
          onUserFollow && onUserFollow(data);

          // Emit follow update via socket
          socket?.emit("update user follow", {
            userId: user._id,
            followers: data.followers,
          });
        }
      }
    );
  };

  const handleCloseSnackbar = () =>
    setValues((prev) => ({ ...prev, open: false }));

  return (
    <div className="find-people-grid">
      {values.users.map((user, i) => (
        <div key={user._id} className="find-people-card">
          <Link to={`/user/${user._id}`}>
            <Avatar
              src={`/api/users/photo/${user._id}`}
              alt={user.name}
              className="find-people-avatar"
              onError={(e) => (e.target.src = "/api/users/defaultphoto")}
            />
            <div className="find-people-name">{user.name}</div>
          </Link>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleFollow(user, i)}
          >
            Follow
          </Button>
        </div>
      ))}

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={values.open}
        onClose={handleCloseSnackbar}
        autoHideDuration={4000}
        message={<span>{values.followMessage}</span>}
      />
    </div>
  );
}
