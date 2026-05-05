import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase, Users, BarChart3, FileText,
  ShieldCheck, Award, Scale, Zap,
} from "lucide-react";
import Header from "../components/Header";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

function timeAgo(date) {
  if (!date) return "";
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60)    return Math.floor(diff) + "s ago";
  if (diff < 3600)  return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

const DOT_COLORS = ["#c4a158", "#1c2b3a", "#4a7c59", "#9a9485", "#b85450", "#5b7fa6"];

export default function Dashboard() {
  const navigate = useNavigate();
  const role  = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [activityItems, setActivityItems] = useState([
    { label: "Loading recent activity…", time: "", dot: "#e5e0d8" },
  ]);
  const [caseStats, setCaseStats] = useState({ total: 0, open: 0, inProgress: 0, closed: 0 });

  useEffect(() => {
    // Fetch real activity
    fetch(API + "/api/activity", { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setActivityItems(data.slice(0, 5).map((item, i) => ({
            label: item.message || item.action || "System event",
            time: timeAgo(item.createdAt),
            dot: DOT_COLORS[i % DOT_COLORS.length],
          })));
        } else {
          setActivityItems([{ label: "No recent activity.", time: "", dot: "#e5e0d8" }]);
        }
      })
      .catch(() => {});

    // Fetch case counts
    fetch(API + "/api/cases", { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCaseStats({
            total: data.length,
            open: data.filter(c => c.status === "open").length,
            inProgress: data.filter(c => c.status === "in_progress").length,
            closed: data.filter(c => c.status === "closed").length,
          });
        }
      })
      .catch(() => {});
  }, []);

  const quickLinks = [
    { title: "Case Reports",  desc: "Analytics & case history",        icon: BarChart3, accent: "#1c2b3a", path: "/reports" },
    { title: "Case Directory",desc: "Browse all active matters",        icon: Briefcase, accent: "#c4a158", path: "/cases"   },
    { title: "Document Vault",desc: "Files and AI summaries",           icon: FileText,  accent: "#4a7c59", path: "/cases"   },
    ...(role === "admin"
      ? [{ title: "Manage Personnel", desc: "Lawyers, clients & roles", icon: Users, accent: "#7c4a6a", path: "/team" }]
      : []),
    ...(role === "admin"
      ? [{ title: "Audit Log", desc: "System activity trail", icon: ShieldCheck, accent: "#5b7fa6", path: "/audit" }]
      : []),
  ];

  const healthItems = [
    { label: "API Status",      value: "Online", ok: true  },
    { label: "DB Connectivity", value: "100%",   ok: true  },
    { label: "Auth Service",    value: "Online", ok: true  },
    { label: "Total Cases",     value: String(caseStats.total), ok: true },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        .db-root {
          min-height: 100vh; display: flex; flex-direction: column;
          background: #f4f2ee; font-family: 'Inter', sans-serif;
        }

        .db-main {
          flex: 1; width: 100%; max-width: 1100px;
          margin: 0 auto; padding: 40px 32px 60px;
          display: flex; flex-direction: column; gap: 28px;
        }

        /* ══ HERO ══ */
        .db-hero {
          background: #1c2b3a; border-radius: 20px;
          padding: 40px 44px; position: relative; overflow: hidden;
        }

        .db-hero-glow {
          position: absolute; top: -60px; right: -60px;
          width: 280px; height: 280px; border-radius: 50%;
          background: radial-gradient(circle, rgba(196,161,88,0.16) 0%, transparent 65%);
          pointer-events: none;
        }

        .db-hero-bg {
          position: absolute; right: 40px; bottom: -10px;
          opacity: 0.04; pointer-events: none;
        }

        .db-hero-inner {
          position: relative; z-index: 1;
          display: flex; justify-content: space-between;
          align-items: flex-end; gap: 28px; flex-wrap: wrap;
        }

        .db-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(196,161,88,0.12);
          border: 1px solid rgba(196,161,88,0.25);
          border-radius: 999px; padding: 4px 12px; margin-bottom: 14px;
        }

        .db-hero-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #c4a158;
          animation: db-pulse 2s ease-in-out infinite;
        }

        @keyframes db-pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.7); }
        }

        .db-hero-eyebrow-text {
          font-size: 10px; font-weight: 600; color: #c4a158;
          letter-spacing: 0.18em; text-transform: uppercase;
        }

        .db-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 3.5vw, 42px); font-weight: 400;
          color: #f0ede4; margin: 0 0 10px; line-height: 1.12; letter-spacing: -0.01em;
        }
        .db-hero-title em { font-style: italic; color: #c4a158; }

        .db-hero-sub {
          font-size: 13px; font-weight: 300;
          color: rgba(240,237,228,0.46); line-height: 1.7; max-width: 360px;
        }

        .db-hero-right {
          display: flex; flex-direction: column; gap: 10px; align-items: flex-end; flex-shrink: 0;
        }

        .db-secure-pill {
          display: flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 8px 14px;
        }
        .db-secure-text { font-size: 12px; font-weight: 500; color: rgba(240,237,228,0.55); }
        .db-secure-text span { color: #4a9e6a; font-weight: 600; }

        .db-kpi-row { display: flex; gap: 8px; }
        .db-kpi {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 10px 16px; text-align: center; min-width: 68px;
        }
        .db-kpi-val {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 500; color: #f0ede4; line-height: 1;
        }
        .db-kpi-lbl {
          font-size: 9px; font-weight: 600; color: rgba(240,237,228,0.36);
          letter-spacing: 0.12em; text-transform: uppercase; margin-top: 4px;
        }

        /* ══ BODY — two equal columns ══ */
        .db-body {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 20px; align-items: start;
        }
        @media (max-width: 820px) { .db-body { grid-template-columns: 1fr; } }

        /* Shared white card */
        .db-card {
          background: #fff; border: 1px solid #e5e0d8;
          border-radius: 18px; overflow: hidden;
        }

        .db-card-head {
          padding: 20px 24px 16px; border-bottom: 1px solid #f0ece4;
          display: flex; align-items: center; gap: 12px;
        }

        .db-card-head-icon {
          width: 38px; height: 38px; border-radius: 10px; background: #1c2b3a;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        .db-card-eyebrow {
          font-size: 10px; font-weight: 600; color: #c4a158;
          letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 3px;
        }

        .db-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px; font-weight: 500; color: #1a1a1a;
        }

        .db-card-sub { font-size: 11px; font-weight: 300; color: #9a9485; margin-top: 2px; }

        .db-card-body { padding: 20px 24px; }

        /* ── Quick Links grid ── */
        .db-links-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
          margin-bottom: 0;
        }

        .db-link-item {
          border: 1.5px solid #e5e0d8; border-radius: 12px;
          padding: 16px 15px; background: #faf9f6; cursor: pointer;
          display: flex; align-items: flex-start; gap: 11px;
          transition: border-color 0.15s, background 0.15s, transform 0.12s;
        }
        .db-link-item:hover {
          border-color: #c4a158; background: #fdf9f2; transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
        }

        .db-link-icon {
          width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }

        .db-link-title { font-size: 12px; font-weight: 600; color: #1a1a1a; margin-bottom: 3px; }
        .db-link-desc  { font-size: 11px; font-weight: 300; color: #9a9485; line-height: 1.45; }

        /* ── Inline Health section within left card ── */
        .db-health-section {
          border-top: 1px solid #f0ece4;
          padding: 18px 24px 20px;
        }

        .db-health-section-header {
          display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
        }

        .db-health-live-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #4a7c59;
          animation: db-pulse 2s ease-in-out infinite; flex-shrink: 0;
        }

        .db-health-section-eyebrow {
          font-size: 10px; font-weight: 600; color: #c4a158;
          letter-spacing: 0.18em; text-transform: uppercase;
        }

        .db-health-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 500; color: #1a1a1a; margin-left: 4px;
        }

        .db-health-rows { display: flex; flex-direction: column; gap: 11px; margin-bottom: 16px; }

        .db-health-row { display: flex; align-items: center; justify-content: space-between; }
        .db-health-lbl { font-size: 12px; font-weight: 400; color: #6b6355; }
        .db-health-val {
          font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 6px;
        }
        .db-health-val.ok   { background: rgba(74,124,89,0.08);  color: #4a7c59; }
        .db-health-val.warn { background: rgba(196,161,88,0.10); color: #b8902a; }

        .db-bar-labels { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .db-bar-lbl { font-size: 9px; font-weight: 600; color: #b8b2a8; letter-spacing: 0.1em; text-transform: uppercase; }
        .db-bar-track { height: 5px; background: #ede9e2; border-radius: 999px; overflow: hidden; }
        .db-bar-fill  { height: 100%; border-radius: 999px; background: linear-gradient(90deg,#1c2b3a,#4a7c59); }

        /* ── Right column ── */
        .db-right { display: flex; flex-direction: column; gap: 16px; }

        /* Activity */
        .db-activity-head {
          padding: 20px 24px 16px; border-bottom: 1px solid #f0ece4;
        }

        .db-act-eyebrow {
          font-size: 10px; font-weight: 600; color: #c4a158;
          letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 5px;
        }

        .db-act-title-row { display: flex; align-items: center; gap: 8px; }

        .db-live-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #4a7c59;
          animation: db-pulse 2s ease-in-out infinite;
        }

        .db-act-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px; font-weight: 500; color: #1a1a1a;
        }

        .db-activity { display: flex; flex-direction: column; gap: 14px; }
        .db-act-row  { display: flex; align-items: flex-start; gap: 10px; }
        .db-act-dot  { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
        .db-act-txt  { font-size: 12px; font-weight: 400; color: #1a1a1a; line-height: 1.45; }
        .db-act-time { font-size: 10px; color: #b8b2a8; margin-top: 3px; }

        /* Insight */
        .db-insight {
          background: #1c2b3a; border-radius: 18px; padding: 22px 24px;
          position: relative; overflow: hidden;
        }

        .db-insight-glow {
          position: absolute; top: -30px; right: -30px;
          width: 120px; height: 120px; border-radius: 50%;
          background: radial-gradient(circle, rgba(196,161,88,0.2) 0%, transparent 70%);
          pointer-events: none;
        }

        .db-insight-label {
          font-size: 10px; font-weight: 600; color: rgba(196,161,88,0.7);
          letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 9px;
          display: flex; align-items: center; gap: 6px;
        }

        .db-insight-title {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 500; color: #f0ede4; margin-bottom: 8px;
        }

        .db-insight-text {
          font-size: 12px; font-weight: 300; color: rgba(240,237,228,0.48); line-height: 1.7;
        }

        .db-footer {
          text-align: center; padding: 24px;
          font-size: 11px; color: #c0b9ae; letter-spacing: 0.06em;
          border-top: 1px solid #ede9e2;
        }
      `}</style>

      <div className="db-root">
        <Header />

        <main className="db-main">

          {/* ══ Hero ══ */}
          <div className="db-hero">
            <div className="db-hero-glow" />
            <div className="db-hero-bg"><Scale size={200} color="#fff" /></div>

            <div className="db-hero-inner">
              <div>
                <div className="db-hero-eyebrow">
                  <div className="db-hero-dot" />
                  <span className="db-hero-eyebrow-text">Live System Status</span>
                </div>
                <h1 className="db-hero-title">Legal <em>Overview</em></h1>
                <p className="db-hero-sub">
                  Monitor case distributions and lawyer availability in real-time across your entire firm.
                </p>
              </div>

              <div className="db-hero-right">
                <div className="db-secure-pill">
                  <ShieldCheck size={13} color="#4a9e6a" />
                  <span className="db-secure-text">Firm Security: <span>Encrypted</span></span>
                </div>
                <div className="db-kpi-row">
                  <div className="db-kpi"><div className="db-kpi-val">98%</div><div className="db-kpi-lbl">Uptime</div></div>
                  <div className="db-kpi"><div className="db-kpi-val">24ms</div><div className="db-kpi-lbl">Latency</div></div>
                  <div className="db-kpi"><div className="db-kpi-val">256</div><div className="db-kpi-lbl">AES Bit</div></div>
                </div>
              </div>
            </div>
          </div>

          {/* ══ Body: two equal columns ══ */}
          <div className="db-body">

            {/* LEFT — Quick Links + System Health */}
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-head-icon">
                  <Zap size={16} color="#c4a158" />
                </div>
                <div>
                  <div className="db-card-eyebrow">Quick Navigation</div>
                  <div className="db-card-title">Go somewhere</div>
                  <div className="db-card-sub">Jump to any section of your workspace.</div>
                </div>
              </div>

              <div className="db-card-body">
                <div className="db-links-grid">
                  {quickLinks.map((l) => (
                    <div key={l.title} className="db-link-item" onClick={() => navigate(l.path)}>
                      <div className="db-link-icon" style={{ background: l.accent + "12" }}>
                        <l.icon size={15} color={l.accent} />
                      </div>
                      <div>
                        <div className="db-link-title">{l.title}</div>
                        <div className="db-link-desc">{l.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Health — directly below quick links */}
              <div className="db-health-section">
                <div className="db-health-section-header">
                  <div className="db-health-live-dot" />
                  <span className="db-health-section-eyebrow">Infrastructure</span>
                  <span className="db-health-section-title">· System Health</span>
                </div>

                <div className="db-health-rows">
                  {healthItems.map((h) => (
                    <div className="db-health-row" key={h.label}>
                      <span className="db-health-lbl">{h.label}</span>
                      <span className={`db-health-val ${h.ok ? "ok" : "warn"}`}>{h.value}</span>
                    </div>
                  ))}
                </div>

                <div className="db-bar-labels">
                  <span className="db-bar-lbl">Server Capacity</span>
                  <span className="db-bar-lbl">95%</span>
                </div>
                <div className="db-bar-track">
                  <div className="db-bar-fill" style={{ width: "95%" }} />
                </div>
              </div>
            </div>

            {/* RIGHT — Activity + Insight */}
            <div className="db-right">

              <div className="db-card">
                <div className="db-activity-head">
                  <div className="db-act-eyebrow">Operations</div>
                  <div className="db-act-title-row">
                    <div className="db-live-dot" />
                    <div className="db-act-title">Recent Activity</div>
                  </div>
                </div>
                <div className="db-card-body">
                  <div className="db-activity">
                    {activityItems.map((item, i) => (
                      <div className="db-act-row" key={i}>
                        <div className="db-act-dot" style={{ background: item.dot }} />
                        <div>
                          <div className="db-act-txt">{item.label}</div>
                          <div className="db-act-time">{item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="db-insight">
                <div className="db-insight-glow" />
                <div className="db-insight-label">
                  <Award size={11} color="#c4a158" /> Firm Insight
                </div>
                <div className="db-insight-title">Resolve matters faster</div>
                <p className="db-insight-text">
                  Updating case statuses daily improves client transparency by{" "}
                  <strong style={{ color: "#c4a158" }}>40%</strong> — helping you close matters 2× quicker.
                </p>
              </div>

            </div>
          </div>

        </main>

        <footer className="db-footer">
          LegalPro Management Systems &copy; 2026 &nbsp;·&nbsp; Tier III Security &nbsp;·&nbsp; AES-256 Encrypted
        </footer>
      </div>
    </>
  );
}
