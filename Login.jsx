import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { postJSON, getJSON } from "../api";
import { AuthContext } from "../AuthContext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [role, setRole] = useState("User");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    if (location.state && location.state.success) {
      setSuccess(location.state.success);
    }
  }, [location]);

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    const payload = { ...form, role };
    const res = await postJSON("/api/auth/login", payload);

    if (!res || !res.success) {
      setMsg(res?.message || "Login failed");
      return;
    }

    // Save user in AuthContext
    login({ user: res.user, token: res.token });

    // Redirect based on role
    if (role === "Provider") {
      // Check if provider has profile
      try {
        const resCheck = await getJSON(`/api/provider/username/${res.user.username}`);
        if (resCheck && resCheck.success) {
          navigate("/profile");
        } else {
          navigate("/provider/create");
        }
      } catch (err) {
        navigate("/provider/create");
      }
    } else {
      // User role - go to search
      navigate("/search");
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>

      {success && <p className="success">{success}</p>}
      {msg && <p className="error">{msg}</p>}

      <form onSubmit={submit}>
        <input
          name="username"
          placeholder="Username or email"
          value={form.username}
          onChange={handle}
          required
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handle}
          required
        />

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 6 }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="radio"
              name="role"
              value="User"
              checked={role === "User"}
              onChange={() => setRole("User")}
            />
            User
          </label>

          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="radio"
              name="role"
              value="Provider"
              checked={role === "Provider"}
              onChange={() => setRole("Provider")}
            />
            Provider
          </label>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
