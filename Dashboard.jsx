import React, { useEffect, useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { getJSON } from "../api";
import { AuthContext } from "../AuthContext";

export default function Dashboard() {
  const { username, role } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState(null);
  const [msg, setMsg] = useState("");

  // Only providers can access dashboard
  if (role !== "Provider") {
    return <Navigate to="/search" />;
  }

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const res = await getJSON(`/api/provider/username/${username}`);
      if (res && res.success) {
        setProvider(res.provider);
      } else {
        setProvider(null);
        if (res && res.message) setMsg(res.message);
      }
      setLoading(false);
    }
    if (username) fetchProfile();
  }, [username]);

  if (loading) return <div className="card"><p>Loading...</p></div>;

  if (!provider) {
    return (
      <div className="card">
        <h2>Welcome, {username}</h2>
        <p>{msg || "You haven't created a provider profile yet."}</p>
        <Link to="/provider/create"><button>Create Profile</button></Link>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Provider Dashboard</h2>
      <p><strong>{provider.name}</strong></p>
      <p>Service: {provider.service}</p>
      <div className="btns">
        <Link to="/profile"><button>View Profile</button></Link>
        <Link to="/edit-profile"><button>Edit Profile</button></Link>
      </div>
    </div>
  );
}
