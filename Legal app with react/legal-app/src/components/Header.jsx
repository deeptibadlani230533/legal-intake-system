import { useNavigate } from "react-router-dom";
import { LogOut, Scale } from "lucide-react";

export default function Header({ title, children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');

        .hdr-root {
          height: 64px;
          background: #fff;
          border-bottom: 1px solid #e5e0d8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 50;
          font-family: 'Inter', sans-serif;
        }

        .hdr-left {
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          text-decoration: none;
        }

        .hdr-brand-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #c4a158, #e2c07a);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .hdr-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 500;
          color: #1a1a1a; letter-spacing: 0.02em;
        }

        .hdr-brand-name b { color: #c4a158; font-weight: 600; }

        .hdr-divider {
          width: 1px; height: 22px;
          background: #e5e0d8;
          margin: 0 4px;
        }

        .hdr-title {
          font-size: 13px; font-weight: 400;
          color: #9a9485; letter-spacing: 0.02em;
        }

        .hdr-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hdr-logout-btn {
          display: flex; align-items: center; gap: 7px;
          font-family: 'Inter', sans-serif;
          font-size: 12px; font-weight: 500;
          color: #9a9485;
          background: none; border: none;
          padding: 6px 12px; border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          letter-spacing: 0.04em;
        }

        .hdr-logout-btn:hover {
          background: #fdf9f2;
          color: #c4a158;
        }
      `}</style>

      <header className="hdr-root">
        <div className="hdr-left" onClick={() => navigate("/dashboard")}>
          <div className="hdr-brand-icon">
            <svg viewBox="0 0 76 65" fill="#1c2b3a" width="14" height="14">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
          </div>
          <span className="hdr-brand-name">Legal<b>Pro</b></span>
          {title && (
            <>
              <div className="hdr-divider" />
              <span className="hdr-title">{title}</span>
            </>
          )}
        </div>

        <div className="hdr-right">
          {children}
          <button className="hdr-logout-btn" onClick={handleLogout}>
            <LogOut size={13} />
            Sign Out
          </button>
        </div>
      </header>
    </>
  );
}
