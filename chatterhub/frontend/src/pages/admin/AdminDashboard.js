import { useNavigate } from "react-router-dom";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <main className="admin-dashboard">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage users, posts, and site settings efficiently.</p>
        </header>

        <section className="dashboard-cards">
          <div className="card" onClick={() => navigate("/admin/users")}>
            <h2>Users</h2>
            <p>View, edit, or remove users.</p>
          </div>

          <div className="card" onClick={() => navigate("/admin/posts")}>
            <h2>Posts</h2>
            <p>Manage posts submitted by users.</p>
          </div>

          <div className="card" onClick={() => navigate("/admin/settings")}>
            <h2>Settings</h2>
            <p>Configure site settings and preferences.</p>
          </div>
        </section>
      </main>
    </>
  );
}
