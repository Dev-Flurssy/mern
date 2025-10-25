// EditProfile.js
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { read, update, getPhoto } from "../../apis/userApi.js";
import { isAuthenticated } from "../../apis/authApi.js";
import "../../styles/Editprofile.css";

export default function EditProfile() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    about: "",
    photo: null,
    error: "",
  });

  const [photoPreview, setPhotoPreview] = useState("/api/users/defaultphoto");
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const jwt = isAuthenticated();
    if (!jwt) {
      navigate("/signin");
      return;
    }

    read(userId, signal)
      .then((data) => {
        if (data && data.error) {
          setValues((prev) => ({ ...prev, error: data.error }));
        } else {
          setValues((prev) => ({
            ...prev,
            name: data.name || "",
            email: data.email || "",
            about: data.about || "",
          }));
          setPhotoPreview(getPhoto(data));
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });

    return () => abortController.abort();
  }, [userId, navigate]);

  const handleChange = (field) => (e) => {
    const value = field === "photo" ? e.target.files[0] : e.target.value;

    setValues((prev) => ({ ...prev, [field]: value }));

    if (field === "photo" && e.target.files[0]) {
      setPhotoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const clickSubmit = (e) => {
    e.preventDefault();

    const userData = {
      name: values.name,
      email: values.email,
      password: values.password,
      about: values.about,
      photo: values.photo, // ✅ handled by userApi.js
    };

    update(userId, userData).then((data) => {
      if (data && data.error) {
        setValues((prev) => ({ ...prev, error: data.error }));
      } else {
        navigate(`/user/${userId}`);
      }
    });
  };

  return (
    <main className="auth-page single-column">
      <div className="auth-form">
        <h2>Edit Profile</h2>
        <form onSubmit={clickSubmit}>
          {/* Name */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={values.name}
              onChange={handleChange("name")}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={values.email}
              onChange={handleChange("email")}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={values.password}
              onChange={handleChange("password")}
              placeholder="Enter new password to change"
            />
          </div>

          {/* About */}
          <div className="form-group">
            <label>About Me</label>
            <textarea
              rows="3"
              value={values.about}
              onChange={handleChange("about")}
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Profile Photo */}
          <div className="form-group">
            <label>Profile Photo</label>
            {photoPreview && (
              <div className="profile-photo-preview">
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  onError={(e) => (e.target.src = `/api/users/defaultphoto`)}
                />
              </div>
            )}
            <input
              accept="image/*"
              type="file"
              onChange={handleChange("photo")}
            />
            {values.photo && <p>{values.photo.name}</p>}
          </div>

          {values.error && <p className="error-message">{values.error}</p>}

          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </form>
      </div>
    </main>
  );
}
