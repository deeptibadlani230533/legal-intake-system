import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Receipt,
  TrendingUp,
  Clock,
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronDown,
  Layers,
} from "lucide-react";
import Header from "../components/Header.jsx";
import { Button } from "@/components/ui/button";

/* ── Mock data – replace with real API calls ── */
const MOCK_INVOICES = [
  { id: "INV-2026-0041", caseTitle: "Mehta Enterprises vs. Sunrise Logistics", client: "Rajesh Mehta", lawyer: "Adv. Priya Sharma", amount: 85000, paid: 85000, status: "paid", issuedOn: "2026-03-01", dueOn: "2026-03-15", hours: 12.5 },
  { id: "INV-2026-0042", caseTitle: "Singh Family Property Partition Suit", client: "Gurpreet Singh", lawyer: "Adv. Arjun Nair", amount: 120000, paid: 0, status: "pending", issuedOn: "2026-03-05", dueOn: "2026-03-20", hours: 18.0 },
  { id: "INV-2026-0043", caseTitle: "Verma vs. Verma – Divorce & Alimony", client: "Sunita Verma", lawyer: "Adv. Priya Sharma", amount: 60000, paid: 30000, status: "partial", issuedOn: "2026-03-08", dueOn: "2026-03-22", hours: 9.0 },
  { id: "INV-2026-0044", caseTitle: "State vs. Ramesh Kumar – Fraud & Forgery", client: "State of MP", lawyer: "Adv. Karan Malhotra", amount: 200000, paid: 0, status: "overdue", issuedOn: "2026-02-10", dueOn: "2026-02-28", hours: 30.5 },
  { id: "INV-2026-0045", caseTitle: "Wrongful Termination – Kapoor vs. TechSoft India", client: "Meena Kapoor", lawyer: "Adv. Arjun Nair", amount: 75000, paid: 75000, status: "paid", issuedOn: "2026-03-12", dueOn: "2026-03-26", hours: 11.0 },
  { id: "INV-2026-0046", caseTitle: "HDFC Bank vs. Sharma Textiles", client: "HDFC Bank Ltd.", lawyer: "Adv. Karan Malhotra", amount: 350000, paid: 175000, status: "partial", issuedOn: "2026-03-15", dueOn: "2026-03-30", hours: 42.0 },
  { id: "INV-2026-0047", caseTitle: "Intellectual Property – Gupta Designs", client: "Anita Gupta", lawyer: "Adv. Priya Sharma", amount: 95000, paid: 0, status: "pending", issuedOn: "2026-03-18", dueOn: "2026-04-02", hours: 14.5 },
];

const STATUS_CONFIG = {
  paid:    { label: "Paid",     color: "#4a7c59", bg: "rgba(74,124,89,0.1)",   icon: CheckCircle },
  pending: { label: "Pending",  color: "#c4a158", bg: "rgba(196,161,88,0.1)", icon: Clock },
  partial: { label: "Partial",  color: "#5b7fa6", bg: "rgba(91,127,166,0.1)", icon: AlertCircle },
  overdue: { label: "Overdue",  color: "#b85450", bg: "rgba(184,84,80,0.1)",  icon: XCircle },
};

const fmt = (n) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const fmtDate = (s) =>
  new Date(s).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

/* ── Status badge ── */
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className="bl-badge" style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}22` }}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

/* ── Progress bar for partial payments ── */
function PaymentBar({ paid, amount }) {
  const pct = amount > 0 ? Math.round((paid / amount) * 100) : 0;
  return (
    <div className="bl-bar-wrap">
      <div className="bl-bar-track">
        <div className="bl-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="bl-bar-label">{pct}%</span>
    </div>
  );
}

/* ── Main ── */
export default function Billing() {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  /* Derived stats */
  const totalRevenue   = invoices.reduce((s, i) => s + i.amount, 0);
  const totalCollected = invoices.reduce((s, i) => s + i.paid, 0);
  const totalOutstanding = totalRevenue - totalCollected;
  const overdueCount   = invoices.filter((i) => i.status === "overdue").length;
  const totalHours     = invoices.reduce((s, i) => s + i.hours, 0);

  const filtered = invoices.filter((inv) => {
    const term = search.toLowerCase();
    const matchesSearch =
      inv.id.toLowerCase().includes(term) ||
      inv.caseTitle.toLowerCase().includes(term) ||
      inv.client.toLowerCase().includes(term) ||
      inv.lawyer.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /* Simulate mark-as-paid */
  const markPaid = (id) => {
    setInvoices((prev) =>
      prev.map((inv) => inv.id === id ? { ...inv, paid: inv.amount, status: "paid" } : inv)
    );
    toast.success("Invoice marked as paid");
    setOpenMenu(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .bl-root {
          min-height: 100vh;
          display: flex; flex-direction: column;
          background: #f4f2ee;
          font-family: 'Inter', sans-serif;
          position: relative;
        }

        .bl-glow1 {
          position: fixed; top: -100px; right: -100px;
          width: 460px; height: 460px; border-radius: 50%;
          background: radial-gradient(circle, rgba(196,161,88,0.07) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .bl-glow2 {
          position: fixed; bottom: -100px; left: -80px;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(28,43,58,0.06) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .bl-main {
          flex: 1; width: 100%; max-width: 1200px;
          margin: 0 auto; padding: 40px 32px 60px;
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 32px;
        }

        /* ── Page Header ── */
        .bl-page-header {
          display: flex; justify-content: space-between;
          align-items: flex-end; gap: 20px; flex-wrap: wrap;
          padding-bottom: 28px;
          border-bottom: 1px solid #e5e0d8;
        }

        .bl-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 10px; font-weight: 600; color: #c4a158;
          letter-spacing: 0.2em; text-transform: uppercase;
          margin-bottom: 10px;
        }

        .bl-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 3.5vw, 40px);
          font-weight: 400; color: #1a1a1a;
          line-height: 1.15; margin: 0 0 8px;
          letter-spacing: -0.01em;
        }
        .bl-title em { font-style: italic; color: #c4a158; }

        .bl-sub {
          font-size: 13px; font-weight: 300; color: #9a9485;
        }

        .bl-header-right {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }

        /* Search */
        .bl-search-wrap { position: relative; }
        .bl-search-icon {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%); color: #b8b2a8; pointer-events: none;
        }
        .bl-search {
          height: 44px; background: #fff;
          border: 1.5px solid #e5e0d8; border-radius: 10px;
          padding: 0 16px 0 40px;
          font-family: 'Inter', sans-serif; font-size: 13px;
          color: #1a1a1a; width: 220px; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .bl-search:focus {
          border-color: #c4a158;
          box-shadow: 0 0 0 3px rgba(196,161,88,0.12);
        }
        .bl-search::placeholder { color: #c8c2b8; }

        /* Filter select */
        .bl-filter-wrap { position: relative; }
        .bl-filter-icon {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%); color: #b8b2a8; pointer-events: none;
        }
        .bl-filter-arrow {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%); color: #b8b2a8; pointer-events: none;
        }
        .bl-filter {
          height: 44px; background: #fff;
          border: 1.5px solid #e5e0d8; border-radius: 10px;
          padding: 0 36px 0 38px;
          font-family: 'Inter', sans-serif; font-size: 13px;
          color: #5a5248; appearance: none; outline: none;
          cursor: pointer;
          transition: border-color 0.18s;
        }
        .bl-filter:focus { border-color: #c4a158; }

        /* New Invoice button */
        .bl-new-btn {
          height: 44px !important; background: #1c2b3a !important;
          color: #f0ede4 !important; border: none !important;
          border-radius: 10px !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 12px !important; font-weight: 600 !important;
          letter-spacing: 0.08em !important; text-transform: uppercase !important;
          padding: 0 20px !important;
          display: flex !important; align-items: center !important; gap: 8px !important;
          cursor: pointer !important;
          transition: background 0.15s, transform 0.12s !important;
        }
        .bl-new-btn:hover { background: #243547 !important; }
        .bl-new-btn:active { transform: scale(0.98) !important; }

        /* ── Stat Cards ── */
        .bl-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) { .bl-stats-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 480px) { .bl-stats-grid { grid-template-columns: 1fr; } }

        .bl-stat {
          background: #fff; border: 1px solid #e5e0d8;
          border-radius: 16px; padding: 22px 20px;
          display: flex; align-items: center; gap: 14px;
          position: relative; overflow: hidden;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .bl-stat:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(0,0,0,0.06);
        }
        .bl-stat-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
        }
        .bl-stat-icon {
          width: 42px; height: 42px; border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .bl-stat-label {
          font-size: 9px; font-weight: 600; color: #9a9485;
          letter-spacing: 0.14em; text-transform: uppercase;
          margin-bottom: 4px;
        }
        .bl-stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 400;
          color: #1a1a1a; line-height: 1;
        }
        .bl-stat-note {
          font-size: 10px; font-weight: 300; color: #9a9485;
          margin-top: 3px;
        }

        /* ── Revenue bar ── */
        .bl-rev-card {
          background: #fff; border: 1px solid #e5e0d8;
          border-radius: 16px; padding: 24px 28px;
        }
        .bl-rev-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 20px;
        }
        .bl-rev-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px; font-weight: 400; color: #1a1a1a;
        }
        .bl-rev-legend {
          display: flex; gap: 16px;
        }
        .bl-legend-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 400; color: #7a7268;
        }
        .bl-legend-dot {
          width: 8px; height: 8px; border-radius: 50%;
        }
        .bl-rev-bar-track {
          height: 12px; background: #f0ece4;
          border-radius: 99px; overflow: hidden;
          position: relative;
        }
        .bl-rev-bar-fill {
          height: 100%; border-radius: 99px;
          background: linear-gradient(90deg, #4a7c59, #6aad7d);
          transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
          position: relative;
        }
        .bl-rev-bar-fill::after {
          content: '';
          position: absolute; right: 0; top: 0; bottom: 0;
          width: 4px; background: rgba(255,255,255,0.4);
          border-radius: 0 99px 99px 0;
        }
        .bl-rev-numbers {
          display: flex; justify-content: space-between;
          margin-top: 12px;
        }
        .bl-rev-num-group { display: flex; flex-direction: column; }
        .bl-rev-num-label { font-size: 10px; font-weight: 600; color: #9a9485; letter-spacing: 0.1em; text-transform: uppercase; }
        .bl-rev-num-val { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 400; color: #1a1a1a; }

        /* ── Table Card ── */
        .bl-table-card {
          background: #fff; border: 1px solid #e5e0d8;
          border-radius: 18px; overflow: hidden;
        }
        .bl-table-top {
          padding: 18px 24px; border-bottom: 1px solid #f0ece4;
          display: flex; align-items: center; justify-content: space-between;
        }
        .bl-table-top-left {
          font-size: 10px; font-weight: 600; color: #9a9485;
          letter-spacing: 0.15em; text-transform: uppercase;
        }
        .bl-table-top-right {
          display: flex; align-items: center; gap: 8px;
        }
        .bl-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #4a7c59;
          animation: bl-pulse 2s ease-in-out infinite;
        }
        @keyframes bl-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.5; transform:scale(.75); }
        }
        .bl-live-label {
          font-size: 10px; font-weight: 600; color: #4a7c59;
          letter-spacing: 0.15em; text-transform: uppercase;
        }

        /* Table */
        .bl-table { width: 100%; border-collapse: collapse; }
        .bl-th {
          padding: 12px 20px; text-align: left;
          font-size: 9px; font-weight: 600; color: #9a9485;
          letter-spacing: 0.14em; text-transform: uppercase;
          border-bottom: 1px solid #f0ece4;
          background: #faf9f7;
        }
        .bl-th:last-child { text-align: center; }

        .bl-tr {
          border-bottom: 1px solid #f7f4f0;
          transition: background 0.13s;
          cursor: pointer;
        }
        .bl-tr:last-child { border-bottom: none; }
        .bl-tr:hover { background: #faf9f7; }

        .bl-td {
          padding: 16px 20px;
          font-size: 13px; font-weight: 300; color: #3a3530;
          vertical-align: middle;
        }

        .bl-invoice-id {
          font-family: 'Playfair Display', serif;
          font-size: 13px; font-weight: 500;
          color: #1c2b3a; letter-spacing: 0.02em;
        }
        .bl-case-name {
          font-size: 13px; font-weight: 400; color: #2a2520;
          max-width: 260px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .bl-client-name {
          font-size: 11px; font-weight: 300; color: #9a9485;
          margin-top: 2px;
        }

        .bl-amount-val {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 400; color: #1a1a1a;
        }
        .bl-amount-sub {
          font-size: 10px; font-weight: 300; color: #9a9485;
          margin-top: 2px;
        }

        /* Badge */
        .bl-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 500; letter-spacing: 0.04em;
        }

        /* Progress bar */
        .bl-bar-wrap {
          display: flex; align-items: center; gap: 8px;
          min-width: 100px;
        }
        .bl-bar-track {
          flex: 1; height: 5px; background: #f0ece4;
          border-radius: 99px; overflow: hidden;
        }
        .bl-bar-fill {
          height: 100%; background: #4a7c59;
          border-radius: 99px;
          transition: width 0.5s ease;
        }
        .bl-bar-label {
          font-size: 10px; font-weight: 500; color: #9a9485;
          min-width: 28px;
        }

        /* Options menu */
        .bl-options-cell { text-align: center; position: relative; }
        .bl-options-btn {
          background: none; border: 1.5px solid #e5e0d8;
          border-radius: 8px; width: 30px; height: 30px;
          display: inline-flex; align-items: center; justify-content: center;
          color: #9a9485; cursor: pointer;
          transition: all 0.15s;
        }
        .bl-options-btn:hover {
          background: #f0ece4; border-color: #c4a158; color: #1a1a1a;
        }
        .bl-menu {
          position: absolute; right: 16px; top: calc(100% - 8px);
          background: #fff; border: 1px solid #e5e0d8;
          border-radius: 12px; padding: 6px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.1);
          z-index: 50; min-width: 160px;
          animation: bl-menuin 0.15s ease;
        }
        @keyframes bl-menuin {
          from { opacity:0; transform:translateY(-6px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .bl-menu-item {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 12px; border-radius: 8px;
          font-size: 12px; font-weight: 400; color: #3a3530;
          cursor: pointer;
          transition: background 0.12s;
          border: none; background: none; width: 100%; text-align: left;
          font-family: 'Inter', sans-serif;
        }
        .bl-menu-item:hover { background: #f4f2ee; }
        .bl-menu-item.bl-danger { color: #b85450; }
        .bl-menu-item.bl-danger:hover { background: #fef2f2; }

        /* Empty state */
        .bl-empty {
          text-align: center; padding: 64px 20px;
        }
        .bl-empty-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: rgba(196,161,88,0.08);
          display: inline-flex; align-items: center; justify-content: center;
          color: #c4a158; margin-bottom: 16px;
        }
        .bl-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 400; color: #1a1a1a;
          margin-bottom: 6px;
        }
        .bl-empty-sub {
          font-size: 13px; font-weight: 300; color: #9a9485;
        }

        /* Hours chip */
        .bl-hours-chip {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(28,43,58,0.06);
          border-radius: 6px; padding: 3px 8px;
          font-size: 11px; font-weight: 500; color: #1c2b3a;
        }

        .bl-footer {
          text-align: center; padding: 24px;
          font-size: 11px; color: #c0b9ae; letter-spacing: 0.06em;
          border-top: 1px solid #ede9e2;
          position: relative; z-index: 1;
        }

        @media (max-width: 768px) {
          .bl-main { padding: 24px 16px 40px; }
          .bl-case-name { max-width: 160px; }
          .bl-th.bl-hide-sm, .bl-td.bl-hide-sm { display: none; }
        }
      `}</style>

      <div className="bl-root" onClick={() => setOpenMenu(null)}>
        <div className="bl-glow1" />
        <div className="bl-glow2" />

        <Header />

        <main className="bl-main">

          {/* ── Page Header ── */}
          <div className="bl-page-header">
            <div>
              <div className="bl-eyebrow">
                <Receipt size={12} />
                Financial Records
              </div>
              <h1 className="bl-title">Billing &amp; <em>Invoices</em></h1>
              <p className="bl-sub">
                {filtered.length} of {invoices.length} records · {totalHours.toFixed(1)} billable hours logged
              </p>
            </div>

            <div className="bl-header-right">
              <div className="bl-search-wrap">
                <Search size={15} className="bl-search-icon" />
                <input
                  className="bl-search"
                  placeholder="Search invoices…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="bl-filter-wrap">
                <Filter size={13} className="bl-filter-icon" />
                <ChevronDown size={12} className="bl-filter-arrow" />
                <select
                  className="bl-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              {(role === "admin" || role === "lawyer") && (
                <Button className="bl-new-btn">
                  <Plus size={14} />
                  New Invoice
                </Button>
              )}
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div className="bl-stats-grid">
            {[
              {
                label: "Total Billed", val: fmt(totalRevenue), note: `${invoices.length} invoices`,
                bar: "linear-gradient(90deg,#1c2b3a,#1c2b3a88)",
                iconBg: "rgba(28,43,58,0.07)", iconColor: "#1c2b3a",
                Icon: DollarSign,
              },
              {
                label: "Collected", val: fmt(totalCollected), note: `${Math.round((totalCollected/totalRevenue)*100)}% of billed`,
                bar: "linear-gradient(90deg,#4a7c59,#4a7c5988)",
                iconBg: "rgba(74,124,89,0.08)", iconColor: "#4a7c59",
                Icon: CheckCircle,
              },
              {
                label: "Outstanding", val: fmt(totalOutstanding), note: "Pending & partial",
                bar: "linear-gradient(90deg,#c4a158,#c4a15888)",
                iconBg: "rgba(196,161,88,0.10)", iconColor: "#c4a158",
                Icon: Clock,
              },
              {
                label: "Overdue", val: `${overdueCount}`, note: "Requires follow-up",
                bar: "linear-gradient(90deg,#b85450,#b8545088)",
                iconBg: "rgba(184,84,80,0.08)", iconColor: "#b85450",
                Icon: AlertCircle,
              },
            ].map(({ label, val, note, bar, iconBg, iconColor, Icon }) => (
              <div className="bl-stat" key={label}>
                <div className="bl-stat-bar" style={{ background: bar }} />
                <div className="bl-stat-icon" style={{ background: iconBg }}>
                  <Icon size={17} color={iconColor} />
                </div>
                <div>
                  <div className="bl-stat-label">{label}</div>
                  <div className="bl-stat-val">{val}</div>
                  <div className="bl-stat-note">{note}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Revenue Collection Bar ── */}
          <div className="bl-rev-card">
            <div className="bl-rev-header">
              <div className="bl-rev-title">Collection Progress</div>
              <div className="bl-rev-legend">
                <span className="bl-legend-item">
                  <span className="bl-legend-dot" style={{ background: "#4a7c59" }} />
                  Collected
                </span>
                <span className="bl-legend-item">
                  <span className="bl-legend-dot" style={{ background: "#e5e0d8" }} />
                  Outstanding
                </span>
              </div>
            </div>
            <div className="bl-rev-bar-track">
              <div
                className="bl-rev-bar-fill"
                style={{ width: `${Math.round((totalCollected / totalRevenue) * 100)}%` }}
              />
            </div>
            <div className="bl-rev-numbers">
              <div className="bl-rev-num-group">
                <span className="bl-rev-num-label">Collected</span>
                <span className="bl-rev-num-val" style={{ color: "#4a7c59" }}>{fmt(totalCollected)}</span>
              </div>
              <div className="bl-rev-num-group" style={{ alignItems: "center" }}>
                <span className="bl-rev-num-label">Total Billed</span>
                <span className="bl-rev-num-val">{fmt(totalRevenue)}</span>
              </div>
              <div className="bl-rev-num-group" style={{ alignItems: "flex-end" }}>
                <span className="bl-rev-num-label">Outstanding</span>
                <span className="bl-rev-num-val" style={{ color: "#c4a158" }}>{fmt(totalOutstanding)}</span>
              </div>
            </div>
          </div>

          {/* ── Invoice Table ── */}
          <div className="bl-table-card">
            <div className="bl-table-top">
              <span className="bl-table-top-left">Invoice Register</span>
              <div className="bl-table-top-right">
                <div className="bl-live-dot" />
                <span className="bl-live-label">Live Sync</span>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="bl-empty">
                <div className="bl-empty-icon"><Receipt size={24} /></div>
                <div className="bl-empty-title">No invoices found</div>
                <p className="bl-empty-sub">Try adjusting your search or filter.</p>
              </div>
            ) : (
              <table className="bl-table">
                <thead>
                  <tr>
                    <th className="bl-th">Invoice</th>
                    <th className="bl-th">Matter / Client</th>
                    <th className="bl-th bl-hide-sm">Lawyer</th>
                    <th className="bl-th">Amount</th>
                    <th className="bl-th bl-hide-sm">Collection</th>
                    <th className="bl-th">Status</th>
                    <th className="bl-th bl-hide-sm">Due Date</th>
                    <th className="bl-th bl-hide-sm">Hours</th>
                    <th className="bl-th">Options</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv) => (
                    <tr className="bl-tr" key={inv.id}>
                      <td className="bl-td">
                        <div className="bl-invoice-id">{inv.id}</div>
                        <div className="bl-client-name">Issued {fmtDate(inv.issuedOn)}</div>
                      </td>
                      <td className="bl-td">
                        <div className="bl-case-name">{inv.caseTitle}</div>
                        <div className="bl-client-name">{inv.client}</div>
                      </td>
                      <td className="bl-td bl-hide-sm" style={{ fontSize: 12, color: "#5a5248" }}>
                        {inv.lawyer}
                      </td>
                      <td className="bl-td">
                        <div className="bl-amount-val">{fmt(inv.amount)}</div>
                        {inv.paid > 0 && inv.paid < inv.amount && (
                          <div className="bl-amount-sub">Paid {fmt(inv.paid)}</div>
                        )}
                      </td>
                      <td className="bl-td bl-hide-sm">
                        <PaymentBar paid={inv.paid} amount={inv.amount} />
                      </td>
                      <td className="bl-td">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="bl-td bl-hide-sm" style={{ fontSize: 12, color: inv.status === "overdue" ? "#b85450" : "#5a5248" }}>
                        {fmtDate(inv.dueOn)}
                        {inv.status === "overdue" && (
                          <div style={{ fontSize: 10, color: "#b85450", marginTop: 2 }}>Overdue</div>
                        )}
                      </td>
                      <td className="bl-td bl-hide-sm">
                        <span className="bl-hours-chip">
                          <Clock size={10} />
                          {inv.hours}h
                        </span>
                      </td>
                      <td className="bl-td bl-options-cell" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="bl-options-btn"
                          onClick={() => setOpenMenu(openMenu === inv.id ? null : inv.id)}
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        {openMenu === inv.id && (
                          <div className="bl-menu">
                            <button className="bl-menu-item">
                              <Download size={13} /> Download PDF
                            </button>
                            {inv.status !== "paid" && (
                              <button className="bl-menu-item" onClick={() => markPaid(inv.id)}>
                                <CheckCircle size={13} /> Mark as Paid
                              </button>
                            )}
                            <button className="bl-menu-item">
                              <Receipt size={13} /> View Details
                            </button>
                            {role === "admin" && (
                              <button className="bl-menu-item bl-danger">
                                <XCircle size={13} /> Void Invoice
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>

        <footer className="bl-footer">
          LegalPro Management Systems &copy; 2026 &nbsp;·&nbsp; Tier III Security &nbsp;·&nbsp; AES-256 Encrypted
        </footer>
      </div>
    </>
  );
}