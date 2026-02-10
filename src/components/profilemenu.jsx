import { useEffect, useRef, useState } from "react";

const API_BASE = "http://localhost:8000";

export default function ProfileMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState(null);

  // update form (should be empty when menu opens)
  const [phone, setPhone] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicFile, setProfilePicFile] = useState(null);

  const boxRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const letter = (user?.username || user?.email || "U")[0].toUpperCase();

  // ✅ Load profile details (for PROFILE DETAILS section)
  const loadMe = async () => {
    const res = await fetch(`${API_BASE}/api/me/`, {
      credentials: "include",
    });
    if (!res.ok) return;

    const data = await res.json();
    setMe(data);

    // ✅ Clear update form every time menu opens
    setPhone("");
    setHobbies("");
    setBio("");
    setProfilePicFile(null);
  };

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next) await loadMe();
  };

  // ✅ cache-buster so image updates immediately after upload/delete
  const avatarUrl = me?.profile_pic
    ? `${API_BASE}${me.profile_pic}?t=${Date.now()}`
    : "";

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setProfilePicFile(f);
  };

  const getCsrfToken = async () => {
    const csrfRes = await fetch(`${API_BASE}/api/csrf/`, {
      credentials: "include",
    });
    if (!csrfRes.ok) throw new Error("CSRF fetch failed");
    const data = await csrfRes.json();
    return data.csrfToken;
  };

  const saveProfile = async () => {
    try {
      const csrfToken = await getCsrfToken();

      const fd = new FormData();

      // ✅ Only send fields if user typed something (so empty inputs don't erase saved data)
      if (phone.trim()) fd.append("phone", phone.trim());
      if (hobbies.trim()) fd.append("hobbies", hobbies.trim());
      if (bio.trim()) fd.append("bio", bio.trim());
      if (profilePicFile) fd.append("profile_pic", profilePicFile);

      // If user didn't type anything and didn't choose a file, don't send
      if ([...fd.keys()].length === 0) {
        alert("Nothing to update 🙂");
        return;
      }

      const res = await fetch(`${API_BASE}/api/profile/update/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfToken,
        },
        body: fd,
      });

      if (!res.ok) throw new Error("Save failed");

      // ✅ Django returns updated profile JSON
      const updatedData = await res.json();

      // ✅ Update UI immediately (PROFILE DETAILS + avatar)
      setMe(updatedData);

      // ✅ Clear the update form after save
      setPhone("");
      setHobbies("");
      setBio("");
      setProfilePicFile(null);

      alert("Profile updated ✅");
    } catch (e) {
      console.error(e);
      alert("Profile update failed ❌");
    }
  };

  const deletePhoto = async () => {
    try {
      const ok = window.confirm("Remove profile photo?");
      if (!ok) return;

      const csrfToken = await getCsrfToken();

      const res = await fetch(`${API_BASE}/api/profile/delete-pic/`, {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRFToken": csrfToken },
      });

      if (!res.ok) throw new Error("Delete failed");

      const updated = await res.json();

      setMe(updated);
      setProfilePicFile(null);

      alert("Profile photo removed ✅");
    } catch (e) {
      console.error(e);
      alert("Could not remove photo ❌");
    }
  };

  return (
    <div style={{ position: "relative" }} ref={boxRef}>
      {/* Profile icon */}
      <button
        onClick={toggle}
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.18)",
          background: "#111827",
          color: "white",
          fontWeight: 800,
          cursor: "pointer",
          overflow: "hidden",
        }}
        title="Profile"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="profile"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          letter
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: 12,
            width: 360,
            background: "#0b1220",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            boxShadow: "0 18px 60px rgba(0,0,0,.55)",
            zIndex: 5000,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: 16,
              display: "flex",
              gap: 12,
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                overflow: "hidden",
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                letter
              )}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800 }}>
                {me?.username || user?.username || "User"}
              </div>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
                {me?.email || user?.email}
              </div>
            </div>

            {/* ✅ Bin icon (delete profile photo) */}
            <button
              onClick={deletePhoto}
              title="Remove profile photo"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <i className="bi bi-trash3" style={{ fontSize: 18, color: "#ff4b2b" }}></i>
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: 16 }}>
            {/* Profile Details */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, letterSpacing: 0.5 }}>
                PROFILE DETAILS
              </div>

              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                <InfoRow label="Phone" value={me?.phone || "—"} />
                <InfoRow label="Hobbies" value={me?.hobbies || "—"} />
                <InfoRow label="Bio" value={me?.bio || "—"} />
              </div>
            </div>

            {/* Update Profile */}
            <div style={{ marginTop: 16 }}>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, letterSpacing: 0.5 }}>
                UPDATE PROFILE
              </div>

              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  style={darkInput}
                />

                <input
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  placeholder="Hobbies (eg: movies, football)"
                  style={darkInput}
                />

                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Bio"
                  rows={3}
                  style={{ ...darkInput, resize: "none" }}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}
                />

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={saveProfile}
                    style={{
                      flex: 1,
                      background: "#ff4b2b",
                      border: "none",
                      color: "white",
                      padding: "10px 12px",
                      borderRadius: 12,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>

                  <button
                    onClick={onLogout}
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.18)",
                      color: "white",
                      padding: "10px 12px",
                      borderRadius: 12,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{label}</div>
      <div
        style={{
          color: "white",
          fontSize: 13,
          maxWidth: 210,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          textAlign: "right",
        }}
        title={value}
      >
        {value}
      </div>
    </div>
  );
}

const darkInput = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  outline: "none",
  fontSize: 14,
};
