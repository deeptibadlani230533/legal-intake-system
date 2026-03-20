import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase, Users, BarChart3, ChevronRight,
  ShieldCheck, Activity, Zap, FileText, Scale,
  Award, Lock, Cpu,
} from "lucide-react";
import Header from "../components/Header";

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const features = [
    { icon: Briefcase, accent: "#1c2b3a", title: "Case Management",    desc: "Track every matter from intake to resolution."       },
    { icon: FileText,  accent: "#c4a158", title: "Smart Documents",    desc: "Upload files and generate AI summaries instantly."   },
    { icon: Users,     accent: "#4a7c59", title: "Lawyer Network",     desc: "Assign counsel, manage team and track availability." },
    { icon: Lock,      accent: "#7c4a6a", title: "Bank-Grade Security",desc: "AES-256 encryption and SOC 2 compliance built in."   },
  ];

  const quickLinks = [
    { title: "Case Reports",  desc: "Analytics, trends and full case history",       icon: BarChart3, accent: "#1c2b3a", path: "/reports" },
    { title: "Case Directory",desc: "Browse and manage all active matters",           icon: Briefcase, accent: "#c4a158", path: "/cases"   },
    { title: "Document Vault",desc: "Uploaded files and AI-generated summaries",     icon: FileText,  accent: "#4a7c59", path: "/cases"   },
    ...(role === "admin" ? [
      { title: "Manage Personnel", desc: "Lawyers, clients and role assignments", icon: Users, accent: "#7c4a6a", path: "/team" },
    ] : []),
  ];

  const activityItems = [
    { label: "New case intake received",        time: "2 min ago",  dot: "#c4a158" },
    { label: "Lawyer assignment updated",        time: "18 min ago", dot: "#1c2b3a" },
    { label: "Document uploaded to Case #4821", time: "1 hr ago",   dot: "#4a7c59" },
    { label: "OTP verification completed",       time: "3 hr ago",   dot: "#9a9485" },
  ];

  const healthItems = [
    { label: "API Latency",     value: "24 ms",  type: "green" },
    { label: "DB Connectivity", value: "100%",   type: "green" },
    { label: "Auth Service",    value: "Online", type: "green" },
    { label: "Storage",         value: "78%",    type: "gold"  },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        .db-root {
          min-height: 100vh; display: flex; flex-direction: column;
          background: #f4f2ee; font-family: 'Inter', sans-serif;
        }

        .db-main {
          flex: 1; width: 100%; max-width: 1200px;
          margin: 0 auto; padding: 28px 32px 48px;
          display: flex; flex-direction: column; gap: 20px;
        }

        /* ══ HERO BANNER ══ */
        .db-banner {
          background: #1c2b3a; border-radius: 18px;
          padding: 32px 40px; position: relative; overflow: hidden;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 20px;
        }

        .db-banner-glow1 {
          position: absolute; top: -50px; right: -40px;
          width: 260px; height: 260px; border-radius: 50%;
          background: radial-gradient(circle, rgba(196,161,88,0.18) 0%, transparent 65%);
          pointer-events: none;
        }
        .db-banner-glow2 {
          position: absolute; bottom: -70px; left: 28%;
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(74,124,89,0.12) 0%, transparent 65%);
          pointer-events: none;
        }
        .db-banner-bg {
          position: absolute; right: 36px; bottom: -8px;
          opacity: 0.04; pointer-events: none;
        }

        .db-banner-left { position: relative; z-index: 1; }

        .db-banner-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(196,161,88,0.12);
          border: 1px solid rgba(196,161,88,0.25);
          border-radius: 999px; padding: 4px 12px; margin-bottom: 12px;
        }
        .db-banner-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #c4a158;
          animation: db-pulse 2s ease-in-out infinite;
        }
        @keyframes db-pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.45; transform: scale(0.75); }
        }
        .db-banner-eyebrow-text {
          font-size: 10px; font-weight: 600; color: #c4a158;
          letter-spacing: 0.18em; text-transform: uppercase;
        }
        .db-banner-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(24px, 3vw, 36px); font-weight: 400;
          color: #f0ede4; margin: 0 0 8px; letter-spacing: -0.01em; line-height: 1.15;
        }
        .db-banner-title em { font-style: italic; color: #c4a158; }
        .db-banner-sub {
          font-size: 13px; font-weight: 300;
          color: rgba(240,237,228,0.5); max-width: 380px; line-height: 1.65;
        }

        .db-banner-right {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 9px; align-items: flex-end;
        }
        .db-secure-pill {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 8px 14px;
        }
        .db-secure-text { font-size: 12px; font-weight: 500; color: rgba(240,237,228,0.6); }
        .db-secure-text span { color: #4a9e6a; font-weight: 600; }

        .db-kpi-row { display: flex; gap: 8px; }
        .db-kpi {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 9px 14px; text-align: center;
        }
        .db-kpi-val {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 500; color: #f0ede4; line-height: 1;
        }
        .db-kpi-lbl {
          font-size: 9px; font-weight: 600; color: rgba(240,237,228,0.4);
          letter-spacing: 0.12em; text-transform: uppercase; margin-top: 3px;
        }

        /* ══ FEATURE STRIP ══ */
        .db-features {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 12px;
        }
        @media (max-width: 900px) { .db-features { grid-template-columns: repeat(2,1fr); } }

        .db-feature {
          background: #fff; border: 1px solid #e5e0d8;
          border-radius: 14px; padding: 18px 18px 16px;
          position: relative; overflow: hidden;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .db-feature:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
        .db-feature-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
        .db-feature-icon {
          width: 34px; height: 34px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center; margin-bottom: 11px;
        }
        .db-feature-title {
          font-family: 'Playfair Display', serif;
          font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 4px;
        }
        .db-feature-desc { font-size: 11px; font-weight: 300; color: #9a9485; line-height: 1.55; }

        /* ══ BODY GRID ══ */
        .db-body {
          display: grid; grid-template-columns: 1fr 300px;
          gap: 16px; align-items: start;
        }
        @media (max-width: 900px) { .db-body { grid-template-columns: 1fr; } }

        /* ── Left card ── */
        .db-left-card {
          background: #fff; border: 1px solid #e5e0d8;
          border-radius: 16px; overflow: hidden;
          display: flex; flex-direction: column;
        }

        .db-shortcuts-head {
          padding: 18px 22px 14px; border-bottom: 1px solid #f0ece4;
          display: flex; align-items: center; gap: 12px;
        }
        .db-shortcuts-head-icon {
          width: 38px; height: 38px; border-radius: 10px; background: #1c2b3a;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .db-shortcuts-eyebrow {
          font-size: 10px; font-weight: 600; color: #c4a158;
          letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 2px;
        }
        .db-shortcuts-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px; font-weight: 500; color: #1a1a1a;
        }
        .db-shortcuts-sub { font-size: 11px; font-weight: 300; color: #9a9485; margin-top: 1px; }

        .db-shortcuts-body { padding: 18px 22px; display: flex; flex-direction: column; gap: 16px; }

        /* Quick link grid — 2×2, no separate CTA buttons */
        .db-links-grid {
          display: grid; grid-template-columns: repeat(2,1fr); gap: 10px;
        }

        .db-link-card {
          border: 1.5px solid #e5e0d8; border-radius: 12px;
          padding: 14px 15px; background: #faf9f6; cursor: pointer;
          transition: border-color 0.15s, background 0.15s, transform 0.12s;
          display: flex; align-items: flex-start; gap: 10px;
        }
        .db-link-card:hover { border-color: #c4a158; background: #fdf9f2; transform: translateY(-1px); }
        .db-link-icon {
          width: 30px; height: 30px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;
        }
        .db-link-title { font-size: 13px; font-weight: 600; color: #1a1a1a; margin-bottom: 2px; }
        .db-link-desc  { font-size: 11px; font-weight: 300; color: #9a9485; line-height: 1.4; }

        /* Inline System Health inside left card */
        .db-health-section {
          border-top: 1px solid #f0ece4;
          padding: 16px 22px;
        }
        .db-health-section-head {
          display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
        }
        .db-health-live-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #4a7c59;
          animation: db-pulse 2s ease-in-out infinite;
        }
        .db-health-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 500; color: #1a1a1a;
        }
        .db-health-eyebrow {
          font-size: 10px; font-weight: 600; color: #c4a158;
          letter-spacing: 0.18em; text-transform: uppercase;
          margin-bottom: 6px;
        }

        .db-health-grid {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 8px;
          margin-bottom: 12px;
        }
        .db-health-mini {
          background: #faf9f6; border: 1px solid #ede9e2;
          border-radius: 10px; padding: 10px 12px;
        }
        .db-health-mini-lbl {
          font-size: 10px; font-weight: 500; color: #9a9485;
          margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.06em;
        }
        .db-health-mini-val {
          font-size: 13px; font-weight: 600;
        }
        .db-health-mini-val.green { color: #4a7c59; }
        .db-health-mini-val.gold  { color: #b8902a; }

        .db-bar-wrap { }
        .db-bar-labels { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .db-bar-lbl { font-size: 9px; font-weight: 600; color: #b8b2a8; letter-spacing: 0.1em; text-transform: uppercase; }
        .db-bar-track { height: 5px; background: #ede9e2; border-radius: 999px; overflow: hidden; }
        .db-bar-fill  { height: 100%; border-radius: 999px; background: linear-gradient(90deg,#1c2b3a,#4a7c59); }

        /* ── Right column ── */
        .db-right { display: flex; flex-direction: column; gap: 14px; }

        .db-side-card {
          background: #fff; border: 1px solid #e5e0d8; border-radius: 14px; overflow: hidden;
        }
        .db-side-head { padding: 14px 18px 11px; border-bottom: 1px solid #f0ece4; }
        .db-side-eyebrow {
          font-size: 10px; font-weight: 600; color: #c4a158;
          letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 4px;
        }
        .db-side-title-row { display: flex; align-items: center; gap: 7px; }
        .db-side-live-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #4a7c59;
          animation: db-pulse 2s ease-in-out infinite;
        }
        .db-side-title {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 500; color: #1a1a1a;
        }
        .db-side-body { padding: 13px 18px; }

        .db-activity { display: flex; flex-direction: column; gap: 11px; }
        .db-act-row  { display: flex; align-items: flex-start; gap: 9px; }
        .db-act-dot  { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
        .db-act-txt  { font-size: 12px; font-weight: 400; color: #1a1a1a; line-height: 1.4; }
        .db-act-time { font-size: 10px; color: #b8b2a8; margin-top: 2px; }

        /* Insight card */
        .db-insight {
          background: #1c2b3a; border-radius: 14px; padding: 18px;
          position: relative; overflow: hidden;
        }
        .db-insight-glow {
          position: absolute; top: -30px; right: -30px;
          width: 110px; height: 110px; border-radius: 50%;
          background: radial-gradient(circle,rgba(196,161,88,0.2) 0%,transparent 70%);
          pointer-events: none;
        }
        .db-insight-label {
          font-size: 10px; font-weight: 600; color: rgba(196,161,88,0.7);
          letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 7px;
          display: flex; align-items: center; gap: 5px;
        }
        .db-insight-title {
          font-family: 'Playfair Display', serif;
          font-size: 14px; font-weight: 500; color: #f0ede4; margin-bottom: 6px;
        }
        .db-insight-text {
          font-size: 11px; font-weight: 300; color: rgba(240,237,228,0.5); line-height: 1.65;
        }

        .db-footer {
          text-align: center; padding: 20px;
          font-size: 11px; color: #c0b9ae; letter-spacing: 0.06em;
          border-top: 1px solid #ede9e2;
        }
      `}</style>

      <div className="db-root">
        <Header />

        <main className="db-main">

          {/* ══ Hero Banner ══ */}
          <div className="db-banner">
            <div className="db-banner-glow1" /><div className="db-banner-glow2" />
            <div className="db-banner-bg"><Scale size={200} color="#fff" /></div>

            <div className="db-banner-left">
              <div className="db-banner-eyebrow">
                <div className="db-banner-dot" />
                <span className="db-banner-eyebrow-text">Live System Status</span>
              </div>
              <h1 className="db-banner-title">Legal <em>Overview</em></h1>
              <p className="db-banner-sub">
                Monitor case distributions and lawyer availability in real-time across your entire firm.
              </p>
            </div>

            <div className="db-banner-right">
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

          {/* ══ Feature Strip ══ */}
          <div className="db-features">
            {features.map((f) => (
              <div className="db-feature" key={f.title}>
                <div className="db-feature-bar" style={{ background:`linear-gradient(90deg,${f.accent},${f.accent}44)` }} />
                <div className="db-feature-icon" style={{ background: f.accent + "12" }}>
                  <f.icon size={16} color={f.accent} />
                </div>
                <div className="db-feature-title">{f.title}</div>
                <div className="db-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* ══ Body Grid ══ */}
          <div className="db-body">

            {/* Left — Shortcuts + System Health combined */}
            <div className="db-left-card">
              <div className="db-shortcuts-head">
                <div className="db-shortcuts-head-icon">
                  <Zap size={16} color="#c4a158" />
                </div>
                <div>
                  <div className="db-shortcuts-eyebrow">Administrative</div>
                  <div className="db-shortcuts-title">Administrative Shortcuts</div>
                  <div className="db-shortcuts-sub">Execute primary tasks and view operational metrics.</div>
                </div>
              </div>

              <div className="db-shortcuts-body">
                {/* Quick link cards — NO duplicate buttons, single source of navigation */}
                <div className="db-links-grid">
                  {quickLinks.map((l) => (
                    <div key={l.title} className="db-link-card" onClick={() => navigate(l.path)}>
                      <div className="db-link-icon" style={{ background: l.accent + "12" }}>
                        <l.icon size={14} color={l.accent} />
                      </div>
                      <div>
                        <div className="db-link-title">{l.title}</div>
                        <div className="db-link-desc">{l.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Health — directly below shortcuts, no scrolling needed */}
              <div className="db-health-section">
                <div className="db-health-eyebrow">Infrastructure</div>
                <div className="db-health-section-head">
                  <div className="db-health-live-dot" />
                  <div className="db-health-section-title">System Health</div>
                </div>
                <div className="db-health-grid">
                  {healthItems.map((h) => (
                    <div className="db-health-mini" key={h.label}>
                      <div className="db-health-mini-lbl">{h.label}</div>
                      <div className={`db-health-mini-val ${h.type}`}>{h.value}</div>
                    </div>
                  ))}
                </div>
                <div className="db-bar-wrap">
                  <div className="db-bar-labels">
                    <span className="db-bar-lbl">Server Capacity</span>
                    <span className="db-bar-lbl">95%</span>
                  </div>
                  <div className="db-bar-track">
                    <div className="db-bar-fill" style={{ width: "95%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Activity + Insight */}
            <div className="db-right">

              {/* Recent Activity */}
              <div className="db-side-card">
                <div className="db-side-head">
                  <div className="db-side-eyebrow">Operations</div>
                  <div className="db-side-title-row">
                    <div className="db-side-live-dot" />
                    <div className="db-side-title">Recent Activity</div>
                  </div>
                </div>
                <div className="db-side-body">
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

              {/* Insight card — right below activity, no scroll needed */}
              <div className="db-insight">
                <div className="db-insight-glow" />
                <div className="db-insight-label"><Award size={11} color="#c4a158" /> Firm Insight</div>
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
