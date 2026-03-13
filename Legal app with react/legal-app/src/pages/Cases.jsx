import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Briefcase,
  Plus,
  Search,
  Layers,
  Clock,
  AlertCircle,
} from "lucide-react";

import Header from "../components/Header.jsx";
import CaseTable from "../components/cases/CaseTable.jsx";
import AssignLawyerDialog from "../components/cases/AssignLawyerDialog.jsx";
import ArchiveCaseDialog from "../components/cases/ArchiveCaseDialog.jsx";
import { Button } from "@/components/ui/button";

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [caseToAssign, setCaseToAssign] = useState(null);
  const [selectedLawyer, setSelectedLawyer] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [caseToArchive, setCaseToArchive] = useState(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCases();
    if (role === "admin") fetchLawyers();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);

      const endpoint =
        role === "lawyer"
          ? `${import.meta.env.VITE_API_URL}/api/lawyer/cases`
          : `${import.meta.env.VITE_API_URL}/api/cases`;

      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setCases(role === "lawyer" ? data.cases : data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLawyers = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/lawyers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setLawyers(data);
    } catch (err) {
      toast.error("Failed to load lawyers");
    }
  };

  const assignLawyer = async () => {
    if (!caseToAssign || !selectedLawyer) {
      toast.error("Please select a lawyer");
      return;
    }

    setIsAssigning(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cases/${caseToAssign.id}/assign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ lawyerId: selectedLawyer }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Counsel assigned successfully");

      setCases((prev) =>
        prev.map((c) =>
          c.id === caseToAssign.id ? { ...c, status: "assigned" } : c
        )
      );

      setIsAssignDialogOpen(false);
      setSelectedLawyer("");
      setCaseToAssign(null);
    } catch (err) {
      toast.error(err.message || "Assignment failed");
    } finally {
      setIsAssigning(false);
    }
  };

  const archiveCase = async () => {
    if (!caseToArchive) return;

    setIsArchiving(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cases/${caseToArchive.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Matter archived successfully");

      setCases((prev) => prev.filter((c) => c.id !== caseToArchive.id));

      setIsArchiveDialogOpen(false);
      setCaseToArchive(null);
    } catch (err) {
      toast.error(err.message || "Archive failed");
    } finally {
      setIsArchiving(false);
    }
  };

  /* ===============================
     SEARCH FILTER
  ================================= */

  const filteredCases = cases.filter((c) => {
    const term = search.toLowerCase();

    return (
      c.caseTitle?.toLowerCase().includes(term) ||
      c.clientName?.toLowerCase().includes(term) ||
      c.status?.toLowerCase().includes(term)
    );
  });

  /* ===============================
     STATS
  ================================= */

  const stats = {
    total: cases.length,
    active: cases.filter((c) => c.status !== "closed").length,
    pending: cases.filter((c) => !c.lawyerId).length,
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] min-h-screen">
      <Header />

      <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-10 py-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
              <Layers size={14} />
              Case Management
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Matter Directory
            </h1>

            <p className="text-slate-500 text-sm font-medium">
              Reviewing {stats.total} total legal records in the system.
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* SEARCH */}
            <div className="relative hidden lg:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search matters..."
                className="bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>

            <Button
              onClick={() => navigate("/intake")}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-5 shadow-lg shadow-slate-200 flex items-center gap-2"
            >
              <Plus size={18} />
              New Intake
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Matters"
            value={stats.total}
            icon={<Briefcase className="text-blue-600" />}
            color="blue"
          />
          <StatCard
            label="Active Files"
            value={stats.active}
            icon={<Clock className="text-emerald-600" />}
            color="emerald"
          />
          <StatCard
            label="Unassigned"
            value={stats.pending}
            icon={<AlertCircle className="text-amber-600" />}
            color="amber"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ring-1 ring-slate-100">

          <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
              Database Records
            </span>

            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase">
                Live Sync
              </span>
            </div>
          </div>

          <CaseTable
            cases={filteredCases}
            loading={loading}
            role={role}
            onView={(id) => navigate(`/cases/${id}`)}
            onAssignClick={(item) => {
              setCaseToAssign(item);
              setIsAssignDialogOpen(true);
            }}
            onArchiveClick={(item) => {
              setCaseToArchive(item);
              setIsArchiveDialogOpen(true);
            }}
            onCreate={() => navigate("/intake")}
          />
        </div>
      </main>

      {/* Dialogs */}
      <AssignLawyerDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        lawyers={lawyers}
        selectedLawyer={selectedLawyer}
        setSelectedLawyer={setSelectedLawyer}
        onAssign={assignLawyer}
        isAssigning={isAssigning}
      />

      <ArchiveCaseDialog
        open={isArchiveDialogOpen}
        onOpenChange={setIsArchiveDialogOpen}
        caseTitle={caseToArchive?.caseTitle}
        onArchive={archiveCase}
        isArchiving={isArchiving}
      />
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  const colorMap = {
    blue: "bg-blue-50 border-blue-100",
    emerald: "bg-emerald-50 border-emerald-100",
    amber: "bg-amber-50 border-amber-100",
  };

  return (
    <div
      className={`p-4 rounded-2xl border flex items-center gap-4 ${colorMap[color]} transition-transform hover:scale-[1.01]`}
    >
      <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-xl font-extrabold text-slate-900">{value}</p>
      </div>
    </div>
  );
}