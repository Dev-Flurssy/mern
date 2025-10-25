import { useEffect, useState } from "react";
import { list } from "../../apis/userApi.js";
import Navbar from "../../components/user/Navbar.js";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    list(controller.signal)
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message));

    return () => controller.abort();
  }, []);

  return (
    <>
      <Navbar />
      <main className="admin-page">
        <h1>Manage Users</h1>
        {error && <p className="error-message">{error}</p>}
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
