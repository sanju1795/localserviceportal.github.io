import React, { useEffect, useState, useContext } from "react";
import { getJSON, postJSON } from "../api";
import { AuthContext } from "../AuthContext";

export default function UserSearch() {
  const [providers, setProviders] = useState([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState({ date: "", time: "", notes: "" });
  const [msg, setMsg] = useState("");
  const { username } = useContext(AuthContext);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getJSON("/api/provider");
      if (res && res.success) setProviders(res.providers || []);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!query) return setFiltered(providers);
    const q = query.toLowerCase();
    const f = providers.filter((p) => {
      const svc = (p.service || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      return svc.includes(q) || name.includes(q) || (p.description || "").toLowerCase().includes(q);
    });
    setFiltered(f);
  }, [query, providers]);

  const openBooking = (prov) => {
    setSelected(prov);
    setBooking({ date: "", time: "", notes: "" });
    setBookingOpen(true);
    setMsg("");
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!selected) return;
    if (!booking.date || !booking.time) return setMsg("Please choose date and time");

    // require login
    if (!username) {
      setMsg("You must be logged in to book. Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 800);
      return;
    }

    // POST booking to server using postJSON helper
    try {
      const payload = {
        providerId: selected._id,
        providerName: selected.name,
        date: booking.date,
        time: booking.time,
        notes: booking.notes,
        username
      };
      const json = await postJSON("/api/bookings", payload);
      if (!json || !json.success) {
        setMsg(json?.message || "Failed to save booking");
        return;
      }
      setMsg("Booking saved.");
      setBookingOpen(false);
      // refresh bookings list
      setTimeout(async () => {
        const listJson = await getJSON("/api/bookings/user/me");
        if (listJson && listJson.success) {
          localStorage.setItem("bookings", JSON.stringify(listJson.bookings));
        }
      }, 300);
    } catch (err) {
      setMsg("Failed to save booking: " + err.message);
    }
  };

  return (
    <div className="card">
      <h2>Search Services</h2>
      <p>Search by service name, provider name or description.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Search services (e.g. Mehndi, Plumbing)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <button onClick={() => setQuery("")}>Clear</button>
      </div>

      {loading ? (
        <p>Loading providers...</p>
      ) : (
        <div>
          {msg && <p className="success">{msg}</p>}
          {(!filtered || filtered.length === 0) && <p>No providers found.</p>}
          {filtered && filtered.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {filtered.map((p) => (
                <li key={p._id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong>{p.name}</strong>
                      <div style={{ color: "#6b7280" }}>{p.service} • {p.contact}</div>
                      <div style={{ marginTop: 6 }}>{p.description}</div>
                    </div>
                    <div style={{ marginLeft: 12 }}>
                      <button onClick={() => openBooking(p)}>Book</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {bookingOpen && selected && (
        <div style={{ marginTop: 20 }}>
          <h3>Book: {selected.name}</h3>
          <form onSubmit={submitBooking}>
            <input type="date" value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value })} required />
            <input type="time" value={booking.time} onChange={(e) => setBooking({ ...booking, time: e.target.value })} required />
            <textarea placeholder="Notes (optional)" value={booking.notes} onChange={(e) => setBooking({ ...booking, notes: e.target.value })} />
            <div className="btns"><button type="submit">Confirm Booking</button><button type="button" onClick={() => setBookingOpen(false)}>Cancel</button></div>
          </form>
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <h3>Your bookings (local)</h3>
        <BookedList />
      </div>
    </div>
  );
}

function BookedList() {
  const [list, setList] = useState([]);
  useEffect(() => {
    const b = JSON.parse(localStorage.getItem("bookings") || "[]");
    setList(b.reverse());
  }, []);
  if (!list || list.length === 0) return <p>No bookings yet.</p>;
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {list.map((b) => (
        <li key={b.id} style={{ marginBottom: 10 }}>
          <div><strong>{b.providerName}</strong> — {b.date} {b.time}</div>
          <div style={{ color: "#6b7280" }}>{b.notes}</div>
        </li>
      ))}
    </ul>
  );
}
