import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { getJSON } from "../api";

export default function ViewProfile() {
  const { username } = useContext(AuthContext);
  const [provider, setProvider] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function fetchProfile() {
      const res = await getJSON(`/api/provider/username/${username}`);
      if (res && res.success) setProvider(res.provider);
    }
    if (username) fetchProfile();
  }, [username]);

  useEffect(() => {
    // load bookings for this provider from server
    async function loadBookings() {
      if (!provider) return;
      try {
        const res = await getJSON(`/api/bookings/provider/${provider._id}`);
        if (res && res.success) setBookings(res.bookings || []);
      } catch (e) {
        console.error("Failed to fetch bookings:", e);
        setBookings([]);
      }
    }
    loadBookings();
  }, [provider]);

  if (!provider) return <div className="card"><p>No profile found.</p></div>;

  return (
    <div className="card">
      <h2>{provider.name}</h2>
      <p><strong>Service:</strong> {provider.service}</p>
      <p><strong>Contact:</strong> {provider.contact}</p>
      <p><strong>Address:</strong> {provider.address}</p>
      <p><strong>Instagram:</strong> {provider.insta}</p>
      <p><strong>Availability:</strong> {provider.availability}</p>
      <p>{provider.description}</p>
      <div style={{ marginTop: 20 }}>
        <h3>Bookings</h3>
        {(!bookings || bookings.length === 0) && <p>No bookings yet.</p>}
        {bookings && bookings.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {bookings.map((b) => (
              <li key={b._id} style={{ marginBottom: 8, padding: 10, border: "1px solid #e5e7eb", borderRadius: 4 }}>
                <div><strong>{b.username || "Anonymous"}</strong> — {b.date} at {b.time}</div>
                {b.notes && <div style={{ color: "#6b7280", marginTop: 4 }}>Notes: {b.notes}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
