import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { AuthContext } from "../AuthProvider";

const API_BASE = import.meta.env.VITE_API_BASE;
console.log("API_BASE =", API_BASE);


// ✅ Read csrftoken cookie set by Django
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// ✅ Ensure csrftoken cookie exists
async function ensureCsrf() {
  await fetch(`${API_BASE}/api/csrf/`, {
    method: "GET",
    credentials: "include",
  });
}

// ✅ Check session login status
async function fetchMeOnce() {
  const res = await fetch(`${API_BASE}/api/me/`, {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) return null;

  return await res.json().catch(() => null);
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, refreshUser } = useContext(AuthContext);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ✅ If already logged in, redirect home
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const me = await fetchMeOnce();
        if (alive && me) {
          setUser(me);
          navigate("/", { replace: true });
          return;
        }
      } finally {
        if (alive) setCheckingSession(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [navigate, setUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((p) => !p);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await ensureCsrf();
      const csrfToken = getCookie("csrftoken");

      const res = await fetch(`${API_BASE}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data?.error === "admin_redirect") {
          window.location.href = `${API_BASE}/login/?next=/dashboard/`;
          return;
        }
        setErrorMsg(data?.error || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ after login, refresh context user from /api/me/
      await refreshUser();

      navigate("/", { replace: true });
    } catch (err) {
      setErrorMsg("Network/CSRF error. Check Django server + CORS settings.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center bg-dark text-light">
        Checking session...
      </div>
    );
  }

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{
        background: "url(/images/background.jpeg) no-repeat center center/cover",
      }}
    >
      <div className="row w-75">
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-light">
          <h2 className="fw-bold text-uppercase" style={{ color: "#d4af37" }}>
            Flickify
          </h2>
          <p>OTT Platform</p>
        </div>

        <div className="col-md-6">
          <div
            className="card p-4 border-0 shadow-lg"
            style={{ background: "#1a1a1a", borderRadius: "15px" }}
          >
            <h3 className="text-center text-light mb-4">Welcome Back</h3>

            {errorMsg && (
              <div className="alert alert-danger py-2" role="alert">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label text-light">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control bg-dark text-light border-0 rounded-pill"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label text-light">
                  Password
                </label>
                <div className="input-group">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    className="form-control bg-dark text-light border-0 rounded-pill"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="input-group-text bg-dark border-0 rounded-pill"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                    aria-label="Toggle password visibility"
                  >
                    <i
                      className={`bi ${
                        passwordVisible ? "bi-eye" : "bi-eye-slash"
                      } text-light`}
                    />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100 rounded-pill mt-3"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </button>

              <div className="text-center mt-3">
                <small className="text-secondary">
                  Don’t have an account? <Link to="/register">Register</Link>
                </small>
              </div>

              {/* <div className="text-center mt-2">
                <small className="text-secondary">Backend: {API_BASE}</small>
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
