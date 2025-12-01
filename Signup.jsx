import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { postJSON } from "../api";
import { AuthContext } from "../AuthContext";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "", cpassword: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await postJSON("/api/auth/signup", form);
    if (!res || !res.success) {
      setMsg(res?.message || "Signup failed");
      return;
    }
    // Successful: backend returns { success, token, user }
    // Redirect to login page so user can choose how to login
    navigate("/login", { state: { success: "Account created. Please login." } });
  };

  return (
    <div className="card">
      <h2>Signup</h2>
      {msg && <p className="error">{msg}</p>}
      <form onSubmit={submit}>
        <input name="username" placeholder="Username" value={form.username} onChange={handle} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handle} required />
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={handle} required />
        <input name="cpassword" placeholder="Confirm" type="password" value={form.cpassword} onChange={handle} required />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
