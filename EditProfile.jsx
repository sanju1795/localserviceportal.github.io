import React, { useEffect, useState, useContext } from "react";
import { getJSON, putJSON } from "../api";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { username } = useContext(AuthContext);
  const [provider, setProvider] = useState(null);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const res = await getJSON(`/api/provider/username/${username}`);
      if (res && res.success) {
        setProvider(res.provider);
        setForm({
          name: res.provider.name || "",
          service: res.provider.service || "",
          contact: res.provider.contact || "",
          address: res.provider.address || "",
          insta: res.provider.insta || "",
          availability: res.provider.availability || "",
          description: res.provider.description || ""
        });
      }
    }
    if (username) load();
  }, [username]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await putJSON(`/api/provider/${provider._id}`, form);
    if (!res || !res.success) {
      setMsg(res?.message || "Update failed");
      return;
    }
    navigate("/profile");
  };

  if (!provider) return <div className="card"><p>Loading...</p></div>;

  return (
    <div className="card">
      <h2>Edit Profile</h2>
      {msg && <p className="error">{msg}</p>}
      <form onSubmit={submit}>
        <input name="name" value={form.name} onChange={change} required />
        <input name="service" value={form.service} onChange={change} required />
        <input name="contact" value={form.contact} onChange={change} required />
        <input name="address" value={form.address} onChange={change} required />
        <input name="insta" value={form.insta} onChange={change} />
        <input name="availability" value={form.availability} onChange={change} />
        <textarea name="description" value={form.description} onChange={change} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
