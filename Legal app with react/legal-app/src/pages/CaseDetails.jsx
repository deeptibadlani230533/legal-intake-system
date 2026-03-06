import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Calendar, User, Mail, Phone, MapPin, 
  Briefcase, Scale, AlertCircle, Clock, Database, Shield, ShieldCheck, FileText
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { apiFetch } from "@/lib/api";

import Header from "../components/Header";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import DocumentManager from "../components/DocumentManager";
import ActivityTimeline from "../components/ActivityTimeline";

const statusColors = {
  open: "bg-emerald-50 text-emerald-700 border-emerald-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function CaseDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [role, setRole] = useState(null);
  const [activityRefresh, setActivityRefresh] = useState(0);

  useEffect(() => {

    const userRole = localStorage.getItem("role");
    setRole(userRole);

    const fetchCase = async () => {
      try {

        const token = localStorage.getItem("token");

        const res = await apiFetch(`/api/cases/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setCaseData(data);

      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch case details.");
      }
    };

    fetchCase();

  }, [id]);

  const handleStatusChange = async (newStatus) => {

    try {

      const token = localStorage.getItem("token");

      const res = await apiFetch(`/api/cases/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Update failed");

      setCaseData((prev) => ({ ...prev, status: newStatus }));
      setActivityRefresh((prev) => prev + 1);

      toast.success(`Status updated to ${newStatus}`);

    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleAcceptCase = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await apiFetch(`/api/cases/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "in_progress" }),
      });

      if (!res.ok) throw new Error("Accept failed");

      setCaseData((prev) => ({ ...prev, status: "in_progress" }));
      setActivityRefresh((prev) => prev + 1);

      toast.success("Case accepted successfully");

    } catch (err) {
      toast.error("Failed to accept case");
    }
  };

  const handleCloseCase = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await apiFetch(`/api/cases/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "closed" }),
      });

      if (!res.ok) throw new Error("Close failed");

      setCaseData((prev) => ({ ...prev, status: "closed" }));
      setActivityRefresh((prev) => prev + 1);

      toast.success("Case closed");

    } catch (err) {
      toast.error("Failed to close case");
    }
  };

  const handleGenerateReport = () => {

    if (!caseData) return;

    try {

      const doc = new jsPDF();

      autoTable(doc, {
        startY: 40,
        head: [["Field", "Information"]],
        body: [
          ["Matter Title", caseData.caseTitle],
          ["Client Name", caseData.clientName],
          ["Email", caseData.clientEmail],
          ["Phone", caseData.clientPhone],
          ["Category", caseData.category],
          ["Status", caseData.status],
          ["Claim Amount", `₹${caseData.claimAmount}`],
        ],
      });

      doc.save(`LegalPro_Report_${id}.pdf`);
      toast.success("PDF generated");

    } catch (err) {
      toast.error("Error generating PDF");
    }
  };

  if (!caseData)
    return (
      <div className="p-8 text-slate-500 animate-pulse">
        Loading case file...
      </div>
    );

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-screen">

      <Header title="Case Management">

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/cases")}
          className="bg-white border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Directory
        </Button>

      </Header>

      <main className="flex-1 p-6 lg:p-10">

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">

            <Card>
              <CardHeader>

                <div className="flex justify-between">

                  <div>

                    <CardTitle>
                      {caseData.caseTitle}
                    </CardTitle>

                    <CardDescription>
                      Opened {new Date(caseData.createdAt).toLocaleDateString()}
                    </CardDescription>

                  </div>

                  <Badge className={statusColors[caseData.status]}>
                    {caseData.status}
                  </Badge>

                </div>

              </CardHeader>

              <CardContent>
                {caseData.description}
              </CardContent>

            </Card>

            <ActivityTimeline caseId={id} refreshKey={activityRefresh} />

          </div>

          <div className="space-y-8">

            <DocumentManager caseId={id} role={role} />

            {role === "lawyer" && (
              <Card>

                <CardHeader>
                  <CardTitle>Lawyer Actions</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                  {caseData.status === "open" && (
                    <Button
                      onClick={handleAcceptCase}
                      className="w-full bg-emerald-600 text-white"
                    >
                      Accept Case
                    </Button>
                  )}

                  {caseData.status === "in_progress" && (
                    <Button
                      onClick={handleCloseCase}
                      className="w-full bg-slate-800 text-white"
                    >
                      Close Case
                    </Button>
                  )}

                </CardContent>

              </Card>
            )}

            {role === "admin" && (
              <Card>

                <CardHeader>
                  <CardTitle>Administrative Actions</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                  <Select
                    value={caseData.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>

                  </Select>

                  <Button
                    onClick={handleGenerateReport}
                    className="w-full bg-blue-600 text-white"
                  >
                    Generate Case Report
                  </Button>

                </CardContent>

              </Card>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}