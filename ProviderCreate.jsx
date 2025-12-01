import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { postJSON } from "../api";
import { AuthContext } from "../AuthContext";
import { useEffect } from "react";

export default function ProviderCreate() {
  const { username } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", service: "", contact: "", address: "", insta: "", availability: "", description: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function check() {
      if (!username) return;
      try {
        const res = await fetch(`/api/provider/username/${username}`);
        const json = await res.json();
        if (json && json.success) {
          // provider already exists -> go to profile
          navigate("/profile");
        }
      } catch (e) {
        // no-op
      }
    }
    check();
  }, [username]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    // IMPORTANT: send username so backend links to user
    const payload = { username, ...form };
    const res = await postJSON("/api/provider", payload);
    if (!res || !res.success) {
      setMsg(res?.message || "Create failed");
      return;
    }
    navigate("/profile");
  };

  return (
    <div className="card">
      <h2>Create Provider Profile</h2>
      {msg && <p className="error">{msg}</p>}
      <form onSubmit={submit}>
        <input name="name" placeholder="Full name" value={form.name} onChange={change} required />
        <input name="service" placeholder="Service (e.g. Mehndi)" value={form.service} onChange={change} required />
        <input name="contact" placeholder="Contact number" value={form.contact} onChange={change} required />
        <input name="address" placeholder="Address" value={form.address} onChange={change} required />
        <input name="insta" placeholder="Instagram" value={form.insta} onChange={change} />
        <input name="availability" placeholder="Availability" value={form.availability} onChange={change} />
        <textarea name="description" placeholder="Short description" value={form.description} onChange={change} />
        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
}
