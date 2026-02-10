import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_BASE = "http://localhost:8000";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

async function ensureCsrf() {
  await fetch(`${API_BASE}/api/csrf/`, {
    method: "GET",
    credentials: "include",
  });
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    if (formData.password !== formData.confirm_password) {
      setErrorMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await ensureCsrf();
      const csrfToken = getCookie("csrftoken");

      const res = await fetch(`${API_BASE}/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirm_password: formData.confirm_password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // show serializer error nicely
        if (data && typeof data === "object") {
          const key = Object.keys(data)[0];
          const msg = Array.isArray(data[key]) ? data[key][0] : data[key];
          setErrorMsg(msg || "Registration failed");
        } else {
          setErrorMsg("Registration failed");
        }
        setLoading(false);
        return;
      }

      setSuccessMsg("Account created successfully! Redirecting to login...");
      setLoading(false);
      setTimeout(() => navigate("/login", { replace: true }), 800);
    } catch {
      setErrorMsg("Network/CSRF error. Check Django server + CORS settings.");
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{
        background: "url(/images/background.jpeg) no-repeat center center/cover",
      }}
    >
      <div className="row w-75">
        {/* Left Section */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-light">
          <h2 className="fw-bold text-uppercase" style={{ color: "#d4af37" }}>
            Flickify
          </h2>
          <p>OTT Platform</p>
        </div>

        {/* Right Section */}
        <div className="col-md-6">
          <div
            className="card p-4 border-0 shadow-lg"
            style={{ background: "#1a1a1a", borderRadius: "15px" }}
          >
            <h3 className="text-center text-light mb-4">Create Account</h3>

            {errorMsg && (
              <div className="alert alert-danger py-2" role="alert">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="alert alert-success py-2" role="alert">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-light">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control bg-dark text-light border-0 rounded-pill"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-light">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control bg-dark text-light border-0 rounded-pill"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-light">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control bg-dark text-light border-0 rounded-pill"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-light">Confirm Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  className="form-control bg-dark text-light border-0 rounded-pill"
                  placeholder="Confirm password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100 rounded-pill mt-2"
                disabled={loading}
              >
                {loading ? "Creating..." : "Register"}
              </button>

              <div className="text-center mt-3">
                <small className="text-secondary">
                  Already have an account? <Link to="/login">Login</Link>
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
