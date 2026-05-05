import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Shield, ShieldCheck, MoreHorizontal,
  UserPlus, Trash2, Search, ChevronDown, Users,
} from "lucide-react";
import Header from "../components/Header.jsx";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Team() {
  const [users, setUsers]         = useState([]);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) { setError(data.message || "Failed to load users"); return; }
        setUsers(data);
      } catch {
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getInitials = (name) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const deleteUser = async (userId) => {
    const currentUserId = localStorage.getItem("userId");
    if (userId === Number(currentUserId)) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!window.confirm("Are you sure you want to restrict this user's access?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { alert("Failed to delete user"); return; }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      alert("Server error while deleting user");
    }
  };

  const roleConfig = {
    admin:  { bg: "#fdf4f3", color: "#c0392b", border: "#f5c6c2", icon: ShieldCheck },
    lawyer: { bg: "#eef4fd", color: "#2859a0", border: "#bdd3f5", icon: Shield     },
    client: { bg: "#f4f2ee", color: "#6b6355", border: "#d0cbc2", icon: User       },
  };

  const avatarAccents = [
    "#1c2b3a", "#c4a158", "#4a7c59", "#7c4a6a", "#2859a0",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        .tm-root {
          min-height: 100vh; display: flex; flex-direction: column;
          background: #f4f2ee; font-family: 'Inter', sans-serif; position: relative;
        }

        .tm-bg-glow1 {
          position: fixed; top: -100px; right: -100px;
          width: 440px; height: 440px; border-radius: 50%;
          background: radial-gradient(circle, rgba(196,161,88,0.07) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .tm-bg-glow2 {
          position: fixed; bottom: -100px; left: -80px;
          width: 380px; height: 380px; border-radius: 50%;
          background: radial-gradient(circle, rgba(28,43,58,0.06) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .tm-main {
          flex: 1; width: 100%; max-width: 1200px;
          margin: 0 auto; padding: 40px 32px 60px;
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 28px;
        }

        /* ── Page Header ── */
        .tm-page-header {
          display: flex; justify-content: space-between;
          align-items: flex-end; gap: 20px; flex-wrap: wrap;
          padding-bottom: 26px; border-bottom: 1px solid #e5e0d8;
        }

        .tm-header-eyebrow {
          font-size: 10px; font-weight: 600; color: #c4a158;
          letter-spacing: 0.2em; text-transform: uppercase;
          margin-bottom: 8px; display: flex; align-items: center; gap: 6px;
        }

        .tm-header-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 3vw, 38px); font-weight: 400;
          color: #1a1a1a; margin: 0 0 6px; letter-spacing: -0.01em;
        }
        .tm-header-title em { font-style: italic; color: #c4a158; }

        .tm-header-sub { font-size: 13px; font-weight: 300; color: #9a9485; }

        .tm-invite-btn {
          display: flex; align-items: center; gap: 7px;
          height: 42px; background: #1c2b3a; color: #f0ede4;
          border: none; border-radius: 10px; padding: 0 20px;
          font-family: 'Inter', sans-serif; font-size: 12px;
          font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer; transition: background 0.15s; flex-shrink: 0;
        }
        .tm-invite-btn:hover { background: #243547; }

        /* ── Error ── */
        .tm-error {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 18px; background: #fdf4f3;
          border: 1px solid #f5c6c2; border-radius: 12px;
          font-size: 13px; color: #c0392b; font-weight: 400;
        }

        .tm-error-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #c0392b; flex-shrink: 0;
        }

        /* ── Toolbar ── */
        .tm-toolbar {
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
        }

        .tm-search-wrap { position: relative; flex: 1; max-width: 320px; }

        .tm-search-icon {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%); color: #b8b2a8; pointer-events: none;
        }

        .tm-search-input {
          width: 100%; height: 42px;
          background: #fff; border: 1.5px solid #e5e0d8; border-radius: 10px;
          padding: 0 16px 0 40px;
          font-family: 'Inter', sans-serif; font-size: 13px; color: #1a1a1a;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .tm-search-input:focus {
          border-color: #c4a158; box-shadow: 0 0 0 3px rgba(196,161,88,0.12);
        }
        .tm-search-input::placeholder { color: #c8c2b8; }

        .tm-select-wrap { position: relative; }

        .tm-select {
          height: 42px; appearance: none;
          background: #fff; border: 1.5px solid #e5e0d8; border-radius: 10px;
          padding: 0 36px 0 14px;
          font-family: 'Inter', sans-serif; font-size: 13px; color: #1a1a1a;
          outline: none; cursor: pointer; min-width: 130px;
          transition: border-color 0.15s;
        }
        .tm-select:focus { border-color: #c4a158; }

        .tm-select-chevron {
          position: absolute; right: 11px; top: 50%;
          transform: translateY(-50%); pointer-events: none; color: #b8b2a8;
        }

        /* ── Table Card ── */
        .tm-table-card {
          background: #fff; border: 1px solid #e5e0d8;
          border-radius: 18px; overflow: hidden;
        }

        .tm-table-top {
          padding: 16px 24px; border-bottom: 1px solid #f0ece4;
          display: flex; align-items: center; justify-content: space-between;
        }

        .tm-table-top-label {
          font-size: 10px; font-weight: 600; color: #9a9485;
          letter-spacing: 0.15em; text-transform: uppercase;
        }

        .tm-count-badge {
          font-size: 11px; font-weight: 600; color: #6b6355;
          background: #f4f2ee; border: 1px solid #e5e0d8;
          border-radius: 999px; padding: 2px 10px;
        }

        /* Table */
        .tm-table { width: 100%; border-collapse: collapse; }

        .tm-thead { background: #faf9f6; }

        .tm-th {
          padding: 12px 20px; text-align: left;
          font-size: 10px; font-weight: 600; color: #b8b2a8;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-bottom: 1px solid #f0ece4;
        }
        .tm-th:last-child { text-align: right; }

        .tm-tr {
          border-bottom: 1px solid #f8f6f2;
          transition: background 0.12s;
        }
        .tm-tr:last-child { border-bottom: none; }
        .tm-tr:hover { background: #faf9f6; }

        .tm-td { padding: 14px 20px; vertical-align: middle; }
        .tm-td:last-child { text-align: right; }

        /* ID cell */
        .tm-id {
          font-size: 11px; font-weight: 500; color: #b8b2a8;
          font-variant-numeric: tabular-nums; letter-spacing: 0.04em;
        }

        /* Avatar + profile */
        .tm-profile { display: flex; align-items: center; gap: 12px; }

        .tm-avatar {
          width: 36px; height: 36px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; color: #fff; flex-shrink: 0;
          letter-spacing: 0.04em;
        }

        .tm-user-name { font-size: 13px; font-weight: 600; color: #1a1a1a; margin-bottom: 2px; }
        .tm-user-email { font-size: 11px; font-weight: 400; color: #9a9485; }

        /* Role badge */
        .tm-role-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 600;
          padding: 4px 11px; border-radius: 999px; border: 1px solid;
          letter-spacing: 0.06em; text-transform: capitalize;
        }

        /* Action button */
        .tm-action-trigger {
          width: 32px; height: 32px; border-radius: 8px;
          background: none; border: 1.5px solid #e5e0d8;
          display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer; transition: border-color 0.15s, background 0.15s;
        }
        .tm-action-trigger:hover { border-color: #c4a158; background: #fdf9f2; }

        /* Dropdown */
        .tm-dropdown {
          width: 200px !important; background: #fff !important;
          border: 1px solid #e5e0d8 !important; border-radius: 13px !important;
          box-shadow: 0 10px 32px rgba(0,0,0,0.09) !important;
          padding: 6px !important; font-family: 'Inter', sans-serif;
        }

        .tm-dropdown-label {
          font-size: 10px; font-weight: 600; color: #b8b2a8;
          letter-spacing: 0.14em; text-transform: uppercase;
          padding: 8px 10px 6px;
        }

        .tm-dropdown-divider { height: 1px; background: #f0ece4; margin: 4px 0; }

        .tm-dropdown-item {
          display: flex !important; align-items: center !important; gap: 9px !important;
          padding: 9px 10px !important; border-radius: 8px !important;
          font-size: 13px !important; font-weight: 400 !important;
          cursor: pointer !important; color: #c0392b !important;
          transition: background 0.12s !important;
        }
        .tm-dropdown-item:hover { background: #fdf4f3 !important; }

        /* Loading state */
        .tm-loading {
          padding: 56px 20px; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }

        .tm-loading-spin {
          width: 32px; height: 32px; border-radius: 50%;
          border: 3px solid #ede9e2; border-top-color: #c4a158;
          animation: tm-spin 0.9s linear infinite;
        }
        @keyframes tm-spin { to { transform: rotate(360deg); } }

        .tm-loading-text { font-size: 12px; font-weight: 300; color: #b8b2a8; }

        /* Empty state */
        .tm-empty {
          padding: 52px 20px; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }

        .tm-empty-icon {
          width: 48px; height: 48px; border-radius: 50%; background: #f4f2ee;
          display: flex; align-items: center; justify-content: center;
        }

        .tm-empty-text { font-size: 13px; font-weight: 300; color: #b8b2a8; }

        .tm-footer {
          text-align: center; padding: 24px;
          font-size: 11px; color: #c0b9ae; letter-spacing: 0.06em;
          border-top: 1px solid #ede9e2; position: relative; z-index: 1;
        }
      `}</style>

      <div className="tm-root">
        <div className="tm-bg-glow1" />
        <div className="tm-bg-glow2" />

        <Header title="Personnel Directory">
          <button className="tm-invite-btn" onClick={() => navigate("/signup")}>
            <UserPlus size={13} /> Invite Member
          </button>
        </Header>

        <main className="tm-main">

          {/* ── Page Header ── */}
          <div className="tm-page-header">
            <div>
              <div className="tm-header-eyebrow">
                <Users size={11} /> Personnel Directory
              </div>
              <h1 className="tm-header-title">Firm <em>Members</em></h1>
              <p className="tm-header-sub">
                {loading ? "Loading firm members…" : `${users.length} registered member${users.length !== 1 ? "s" : ""} in the system.`}
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="tm-error">
              <div className="tm-error-dot" />
              {error}
            </div>
          )}

          {/* Toolbar */}
          <div className="tm-toolbar">
            <div className="tm-search-wrap">
              <Search size={14} className="tm-search-icon" />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="tm-search-input"
              />
            </div>

            <div className="tm-select-wrap">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="tm-select"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="lawyer">Lawyer</option>
                <option value="client">Client</option>
              </select>
              <ChevronDown size={13} className="tm-select-chevron" />
            </div>
          </div>

          {/* Table Card */}
          <div className="tm-table-card">
            <div className="tm-table-top">
              <span className="tm-table-top-label">Member Records</span>
              <span className="tm-count-badge">{filteredUsers.length} shown</span>
            </div>

            {loading ? (
              <div className="tm-loading">
                <div className="tm-loading-spin" />
                <p className="tm-loading-text">Syncing firm database…</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="tm-empty">
                <div className="tm-empty-icon">
                  <Users size={18} color="#c8c2b8" />
                </div>
                <p className="tm-empty-text">No firm members found matching your search.</p>
              </div>
            ) : (
              <table className="tm-table">
                <thead className="tm-thead">
                  <tr>
                    <th className="tm-th">ID</th>
                    <th className="tm-th">Member Profile</th>
                    <th className="tm-th">Authorization</th>
                    <th className="tm-th">Options</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => {
                    const rc = roleConfig[user.role] || roleConfig.client;
                    const RoleIcon = rc.icon;
                    const avatarColor = avatarAccents[idx % avatarAccents.length];
                    return (
                      <tr className="tm-tr" key={user.id}>

                        {/* ID */}
                        <td className="tm-td">
                          <span className="tm-id">#{String(user.id).padStart(4, "0")}</span>
                        </td>

                        {/* Profile */}
                        <td className="tm-td">
                          <div className="tm-profile">
                            <div className="tm-avatar" style={{ background: avatarColor }}>
                              {getInitials(user.name)}
                            </div>
                            <div>
                              <div className="tm-user-name">{user.name}</div>
                              <div className="tm-user-email">{user.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role badge */}
                        <td className="tm-td">
                          <div
                            className="tm-role-badge"
                            style={{ background: rc.bg, color: rc.color, borderColor: rc.border }}
                          >
                            <RoleIcon size={10} />
                            {user.role}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="tm-td">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="tm-action-trigger">
                                <MoreHorizontal size={14} color="#9a9485" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="tm-dropdown">
                              <div className="tm-dropdown-label">Account Actions</div>
                              <div className="tm-dropdown-divider" />
                              <DropdownMenuItem
                                disabled={user.role === "admin"}
                                onClick={() => deleteUser(user.id)}
                                className="tm-dropdown-item"
                              >
                                <Trash2 size={13} />
                                Restrict Access
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>

        <footer className="tm-footer">
          LegalPro Management Systems &copy; 2026 &nbsp;·&nbsp; Tier III Security &nbsp;·&nbsp; AES-256 Encrypted
        </footer>
      </div>
    </>
  );
}
