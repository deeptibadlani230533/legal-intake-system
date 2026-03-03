import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "../components/Header.jsx";

import CaseTable from "../components/cases/CaseTable.jsx";
import AssignLawyerDialog from "../components/cases/AssignLawyerDialog.jsx";
import ArchiveCaseDialog from "../components/cases/ArchiveCaseDialog.jsx";

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
          ? "http://localhost:3000/api/lawyer/cases"
          : "http://localhost:3000/api/cases";

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
        "http://localhost:3000/api/users/lawyers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setLawyers(data);
    } catch (err) {
      toast.error("Failed to load lawyers");
    }
  };

  const assignLawyer = async () => {
    if (!caseToAssign) return;
    if (!selectedLawyer) {
      toast.error("Please select a lawyer");
      return;
    }

    setIsAssigning(true);

    try {
      const res = await fetch(
        `http://localhost:3000/api/cases/${caseToAssign.id}/assign`,
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

      setCases(prev =>
        prev.map(c =>
          c.id === caseToAssign.id
            ? { ...c, status: "assigned" }
            : c
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
        `http://localhost:3000/api/cases/${caseToArchive.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Matter archived successfully");

      setCases(prev =>
        prev.filter(c => c.id !== caseToArchive.id)
      );

      setIsArchiveDialogOpen(false);
      setCaseToArchive(null);

    } catch (err) {
      toast.error(err.message || "Archive failed");
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto w-full px-6 py-10 space-y-6">

        <div className="flex justify-between">
          <h1 className="text-3xl font-semibold">Case Directory</h1>
        </div>

        <CaseTable
          cases={cases}
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

      </main>

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