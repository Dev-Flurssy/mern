import { isAuthenticated } from "../../apis/authApi.js";
import "../../styles/Userhomepage.css";

export default function UserHomepage() {
  const auth = isAuthenticated();
  return (
    <>
      <main className="homepage">
        <h1>👋 Welcome, {auth?.user?.name || "User"}!</h1>

        <section className="homepage-content">
          <p>Here you’ll see the latest posts from other Chatterhub users.</p>
        </section>
      </main>
    </>
  );
}
