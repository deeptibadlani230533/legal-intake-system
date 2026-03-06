import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Calendar, User, Mail, Phone, MapPin,
  Briefcase, Scale, AlertCircle, Clock, Database,
  Shield, ShieldCheck, FileText, Download, Building2, Gavel, StickyNote, Lock
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
import { Textarea } from "@/components/ui/textarea";

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
  assigned: "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-inset ring-amber-600/20",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-inset ring-blue-600/20",
  closed: "bg-slate-50 text-slate-600 border-slate-200 ring-1 ring-inset ring-slate-600/20",
};

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [role, setRole] = useState(null);
  const [activityRefresh, setActivityRefresh] = useState(0);
  
  // Internal Notes State (UI Only - Persistent via LocalStorage for now)
  const [internalNote, setInternalNote] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);

    // Load saved internal note for this case ID
    const savedNote = localStorage.getItem(`note_case_${id}`);
    if (savedNote) setInternalNote(savedNote);

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

  const saveInternalNote = () => {
    localStorage.setItem(`note_case_${id}`, internalNote);
    toast.success("Internal strategy note saved locally.");
  };

  const handleAcceptCase = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch(`/api/cases/${id}/accept`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      setCaseData((prev) => ({ ...prev, status: "in_progress" }));
      setActivityRefresh((prev) => prev + 1);
      toast.success("Case accepted successfully");
    } catch {
      toast.error("Failed to accept case");
    }
  };

  const handleCloseCase = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch(`/api/cases/${id}/close`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      setCaseData((prev) => ({ ...prev, status: "closed" }));
      setActivityRefresh((prev) => prev + 1);
      toast.success("Case closed successfully");
    } catch {
      toast.error("Failed to close case");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch(`/api/cases/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error();
      setCaseData((prev) => ({ ...prev, status: newStatus }));
      setActivityRefresh((prev) => prev + 1);
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleGenerateReport = () => {
    if (!caseData) return;
    const doc = new jsPDF();
    autoTable(doc, {
      startY: 40,
      head: [["Field", "Information"]],
      body: [
        ["Case Title", caseData.caseTitle],
        ["Client", caseData.clientName],
        ["Category", caseData.category],
        ["Status", caseData.status],
        ["Claim Amount", `₹${caseData.claimAmount}`]
      ],
    });
    doc.save(`LegalPro_Report_${id}.pdf`);
  };

  if (!caseData) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-slate-500 font-medium tracking-tight">Accessing Case Files...</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] min-h-screen">
      <Header title="Case Management">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/cases")}
          className="bg-white border-slate-200 shadow-sm hover:bg-slate-50 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Directory
        </Button>
      </Header>

      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* OVERVIEW CARD */}
            <Card className="border-slate-200/60 shadow-sm overflow-hidden bg-white">
              <div className="h-1.5 bg-blue-600 w-full" />
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">
                      {caseData.caseTitle}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar size={14} />
                      Opened on {new Date(caseData.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </CardDescription>
                  </div>
                  <Badge className={`${statusColors[caseData.status]} capitalize px-3 py-1 rounded-full border shadow-sm`}>
                    {caseData.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <Label className="text-[10px] font-bold uppercase text-blue-600 tracking-widest flex items-center gap-2 mb-2">
                    <FileText size={12} />
                    Case Narrative & Facts
                  </Label>
                  <p className="text-sm leading-relaxed text-slate-600 italic">
                    "{caseData.description}"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CLIENT PROFILE */}
            <Card className="border-slate-200/60 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><User size={18} /></div>
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <Label className="text-slate-400 text-xs">Full Name</Label>
                  <p className="font-medium text-slate-900">{caseData.clientName}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-400 text-xs">Email Address</Label>
                  <p className="font-medium text-slate-900 flex items-center gap-2 truncate">
                    <Mail size={14} className="text-slate-400 shrink-0"/> {caseData.clientEmail}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-400 text-xs">Phone Number</Label>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <Phone size={14} className="text-slate-400"/> {caseData.clientPhone}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-400 text-xs">Residential Address</Label>
                  <p className="font-medium text-slate-900 flex items-start gap-2 leading-tight italic">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5"/> {caseData.clientAddress}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* LEGAL DETAILS */}
            <Card className="border-slate-200/60 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                  <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg"><Scale size={18} /></div>
                  Legal Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <Label className="text-slate-400 text-xs text-blue-600/70 uppercase tracking-widest">Category</Label>
                  <p className="font-medium text-slate-900 flex items-center gap-2"><Building2 size={14} /> {caseData.category}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-400 text-xs">Priority Level</Label>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <AlertCircle size={14} className={caseData.priority === 'high' ? 'text-red-500' : 'text-blue-500'} />
                    {caseData.priority}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-400 text-xs">Incident Date</Label>
                  <p className="font-medium text-slate-900 flex items-center gap-2"><Clock size={14} /> {caseData.incidentDate}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-400 text-xs">Opposing Party</Label>
                  <p className="font-medium text-slate-900 flex items-center gap-2"><Gavel size={14} /> {caseData.opponentName}</p>
                </div>
              </CardContent>
            </Card>

            <ActivityTimeline caseId={id} refreshKey={activityRefresh} />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            
            {/* CLAIM AMOUNT */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-xl border-none overflow-hidden relative">
              <div className="absolute top-[-20px] right-[-20px] opacity-10 rotate-12">
                <Scale size={120} />
              </div>
              <CardContent className="p-6 relative z-10">
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-1">
                  Claim Valuation
                </p>
                <h2 className="text-4xl font-bold tracking-tight">
                  ₹{Number(caseData.claimAmount).toLocaleString("en-IN")}
                </h2>
                <div className="mt-4 flex items-center gap-2 text-[10px] bg-white/10 w-fit px-2 py-1 rounded-md">
                   <ShieldCheck size={12} className="text-emerald-400" /> Secure Legal Audit
                </div>
              </CardContent>
            </Card>

            {/* INTERNAL NOTES (Lawyer/Admin Only) */}
            {(role === "lawyer" || role === "admin") && (
              <Card className="border-amber-200 bg-amber-50/20 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">
                      <StickyNote size={14} /> Strategy Notes
                    </CardTitle>
                    <Badge variant="outline" className="text-[9px] bg-amber-100 text-amber-800 border-amber-200 flex gap-1 items-center">
                      <Lock size={10} /> Internal Only
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea 
                    placeholder="Type private case strategy or lawyer notes here..."
                    className="min-h-[120px] text-sm bg-white border-amber-200 focus:ring-amber-500"
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                  />
                  <Button 
                    size="sm" 
                    onClick={saveInternalNote}
                    className="w-full bg-amber-700 hover:bg-amber-800 text-white text-xs"
                  >
                    Save Internal Note
                  </Button>
                </CardContent>
              </Card>
            )}

            <DocumentManager caseId={id} role={role} />

            {/* LAWYER ACTIONS */}
            {role === "lawyer" && (
              <Card className="border-blue-100 bg-blue-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-blue-800">Lawyer Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {caseData.status === "assigned" && (
                    <Button
                      onClick={handleAcceptCase}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-200"
                    >
                      Accept Case
                    </Button>
                  )}
                  {caseData.status === "in_progress" && (
                    <Button
                      onClick={handleCloseCase}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold"
                    >
                      Close Case
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ADMIN ACTIONS */}
            {role === "admin" && (
              <Card className="border-slate-200 shadow-sm bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800">Administration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-slate-500">Global Status</Label>
                    <Select value={caseData.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="bg-white rounded-xl border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleGenerateReport}
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-xl flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Export Case Report
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