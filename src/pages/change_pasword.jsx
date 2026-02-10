import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../api";
import { AuthContext } from "../AuthProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [old_password, setOldPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (new_password !== confirm_password) {
      setErr("New password and confirm password do not match.");
      return;
    }

    setLoading(true);

    try {
      const { res, data } = await apiPost("/api/change-password/", {
        old_password,
        new_password,
      });

      if (!res.ok) {
        setErr(data?.error || data?.detail || "Password change failed.");
        return;
      }

      setMsg("Password changed successfully. Logging out...");
      await logout();
      navigate("/login", { replace: true });

    } catch (e2) {
      setErr("Network error. Check Django server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-lg border-0">
            <h3 className="mb-3 text-center">Change Password</h3>

            {msg && <div className="alert alert-success">{msg}</div>}
            {err && <div className="alert alert-danger">{err}</div>}

            <form onSubmit={handleSubmit}>

              {/* Old Password */}
              <div className="mb-3">
                <label className="form-label">Old Password</label>
                <div className="input-group">
                  <input
                    type={showOld ? "text" : "password"}
                    className="form-control"
                    value={old_password}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowOld(!showOld)}
                  >
                    <i className={`bi ${showOld ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </span>
                </div>
              </div>

              {/* New Password */}
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <div className="input-group">
                  <input
                    type={showNew ? "text" : "password"}
                    className="form-control"
                    value={new_password}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowNew(!showNew)}
                  >
                    <i className={`bi ${showNew ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <div className="input-group">
                  <input
                    type={showConfirm ? "text" : "password"}
                    className="form-control"
                    value={confirm_password}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    <i className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </span>
                </div>
              </div>

              <button className="btn btn-dark w-100" disabled={loading}>
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>

            <small className="text-muted d-block text-center mt-3">
              After success you will be logged out automatically.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
