import React, { useState } from "react";
import { Bell, CheckCircle2, FileText } from "lucide-react";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    { id: 1, text: "Case #402 status updated to 'In Progress'", time: "5m ago",  type: "update" },
    { id: 2, text: "New document: 'Evidence_01.pdf' uploaded",  time: "2h ago",  type: "file"   },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Inter:wght@300;400;500;600&display=swap');

        .nb-bell-btn {
          position: relative; width: 36px; height: 36px;
          background: #fff; border: 1.5px solid #e5e0d8;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: border-color 0.15s, background 0.15s;
          flex-shrink: 0;
        }
        .nb-bell-btn:hover { border-color: #c4a158; background: #fdf9f2; }

        .nb-bell-dot {
          position: absolute; top: -3px; right: -3px;
          width: 10px; height: 10px; border-radius: 50%;
          background: #c4a158; border: 2px solid #f4f2ee;
        }

        .nb-bell-ping {
          position: absolute; top: -3px; right: -3px;
          width: 10px; height: 10px; border-radius: 50%;
          background: rgba(196,161,88,0.45);
          animation: nb-ping 1.8s ease-out infinite;
        }

        @keyframes nb-ping {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        /* Backdrop */
        .nb-backdrop {
          position: fixed; inset: 0; z-index: 40;
        }

        /* Dropdown */
        .nb-dropdown {
          position: absolute; right: 0; top: calc(100% + 10px);
          width: 300px; background: #fff;
          border: 1px solid #e5e0d8; border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.10);
          z-index: 50; overflow: hidden;
          font-family: 'Inter', sans-serif;
          animation: nb-appear 0.15s ease;
        }

        @keyframes nb-appear {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        .nb-dropdown-header {
          padding: 14px 16px 12px;
          border-bottom: 1px solid #f0ece4;
          background: #faf9f6;
          display: flex; align-items: center; justify-content: space-between;
        }

        .nb-dropdown-title {
          font-size: 11px; font-weight: 600; color: #1a1a1a;
          letter-spacing: 0.1em; text-transform: uppercase;
        }

        .nb-brand-tag {
          font-size: 9px; font-weight: 600; color: #c4a158;
          background: rgba(196,161,88,0.10);
          border: 1px solid rgba(196,161,88,0.2);
          border-radius: 999px; padding: 2px 8px;
          letter-spacing: 0.1em; text-transform: uppercase;
        }

        /* Notification items */
        .nb-list { max-height: 240px; overflow-y: auto; }
        .nb-list::-webkit-scrollbar { width: 3px; }
        .nb-list::-webkit-scrollbar-thumb { background: #e5e0d8; border-radius: 3px; }

        .nb-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 13px 16px; border-bottom: 1px solid #f8f6f2;
          transition: background 0.12s; cursor: default;
        }
        .nb-item:last-child { border-bottom: none; }
        .nb-item:hover { background: #faf9f6; }

        .nb-item-icon {
          width: 28px; height: 28px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
        }

        .nb-item-text {
          font-size: 12px; font-weight: 400; color: #1a1a1a;
          line-height: 1.5; margin-bottom: 4px;
        }

        .nb-item-time {
          font-size: 10px; font-weight: 400; color: #b8b2a8;
          letter-spacing: 0.04em;
        }

        /* Empty */
        .nb-empty {
          padding: 32px 16px; text-align: center;
          font-size: 12px; font-weight: 300; color: #b8b2a8;
        }

        /* Footer */
        .nb-dropdown-footer {
          padding: 10px 16px;
          border-top: 1px solid #f0ece4;
          background: #faf9f6; text-align: center;
        }

        .nb-footer-link {
          font-size: 11px; font-weight: 600; color: #9a9485;
          letter-spacing: 0.08em; text-transform: uppercase;
          background: none; border: none; cursor: pointer;
          transition: color 0.15s;
        }
        .nb-footer-link:hover { color: #c4a158; }
      `}</style>

      <div style={{ position: "relative" }}>
        <button
          className="nb-bell-btn"
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Notifications"
        >
          <Bell size={15} color="#6b6355" />
          {notifications.length > 0 && (
            <>
              <div className="nb-bell-ping" />
              <div className="nb-bell-dot" />
            </>
          )}
        </button>

        {isOpen && (
          <>
            <div className="nb-backdrop" onClick={() => setIsOpen(false)} />
            <div className="nb-dropdown">
              <div className="nb-dropdown-header">
                <span className="nb-dropdown-title">Activity Alerts</span>
                <span className="nb-brand-tag">LegalPro</span>
              </div>

              <div className="nb-list">
                {notifications.length === 0 ? (
                  <div className="nb-empty">No new notifications.</div>
                ) : (
                  notifications.map((n) => (
                    <div className="nb-item" key={n.id}>
                      <div
                        className="nb-item-icon"
                        style={{
                          background: n.type === "update"
                            ? "rgba(74,124,89,0.10)"
                            : "rgba(196,161,88,0.10)",
                        }}
                      >
                        {n.type === "update"
                          ? <CheckCircle2 size={14} color="#4a7c59" />
                          : <FileText     size={14} color="#c4a158" />}
                      </div>
                      <div>
                        <div className="nb-item-text">{n.text}</div>
                        <div className="nb-item-time">{n.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="nb-dropdown-footer">
                <button className="nb-footer-link" onClick={() => setIsOpen(false)}>
                  Mark all as read
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
