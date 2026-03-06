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

// MOVE THIS OUTSIDE TO PREVENT SCOPING ERRORS
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
  headers: { Authorization: `Bearer ${token}` },
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

  const handleGenerateReport = () => {
    if (!caseData) return;
    
    try {
      const doc = new jsPDF();
      const primaryBlue = [30, 58, 138]; 
      const accentBlue = [59, 130, 246]; 
      
      // Header
      doc.setFillColor(248, 250, 252); 
      doc.rect(0, 0, 210, 45, 'F');
      doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      doc.setFontSize(26);
      doc.setFont("helvetica", "bold");
      doc.text("LegalPro", 15, 28); 
      
      doc.setDrawColor(accentBlue[0], accentBlue[1], accentBlue[2]);
      doc.setLineWidth(1);
      doc.line(15, 32, 55, 32);

      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text("CONFIDENTIAL ATTORNEY-CLIENT PRIVILEGE", 140, 20, { align: 'right' });
      doc.text(`Ref ID: #${id}`, 195, 25, { align: 'right' });
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 195, 30, { align: 'right' });

      // Table
      autoTable(doc, {
        startY: 60,
        head: [['Field', 'Information']],
        body: [
          ['Matter Title', caseData.caseTitle],
          ['Client Name', caseData.clientName],
          ['Contact', `${caseData.clientEmail} | ${caseData.clientPhone}`],
          ['Category', caseData.category],
          ['Status', caseData.status.toUpperCase()],
          ['Claim Amount', `INR ${Number(caseData.claimAmount).toLocaleString('en-IN')}`],
        ],
        headStyles: { fillColor: primaryBlue },
        styles: { fontSize: 10 },
      });

      // Narrative
      const narrativeY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("Case Narrative:", 15, narrativeY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const splitDesc = doc.splitTextToSize(caseData.description || "No narrative provided.", 180);
      doc.text(splitDesc, 15, narrativeY + 7);

      // Signature line
      doc.setDrawColor(200);
      doc.line(15, 260, 75, 260);
      doc.text("Authorized Admin Signature", 15, 265);

      doc.save(`LegalPro_Report_${id}.pdf`);
      toast.success("PDF generated successfully");
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Error generating PDF");
    }
  };

  if (!caseData) return <div className="p-8 text-slate-500 animate-pulse">Loading case file...</div>;

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-screen font-sans">
      <Header title="Case Management">
        <Button 
          variant="outline" size="sm" 
          onClick={() => navigate("/cases")} 
          className="bg-white border-slate-200 shadow-sm hover:bg-slate-50 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Button>
      </Header>

      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-slate-200/60 shadow-sm overflow-hidden rounded-2xl bg-white">
              <CardHeader className="bg-slate-50/30 pb-6 border-b border-slate-100">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">{caseData.caseTitle}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5" /> Opened {new Date(caseData.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={`${statusColors[caseData.status] || "bg-slate-100"} capitalize px-3 py-1 text-xs font-bold border-0 shadow-sm`}>
                    {caseData.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Label className="text-slate-400 uppercase text-xs font-bold tracking-widest">Case Narrative</Label>
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                    <p className="text-slate-700 leading-relaxed italic text-sm">"{caseData.description || "No narrative."}"</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 shadow-sm rounded-2xl bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2 font-bold text-slate-800">
                  <User className="w-5 h-5 text-blue-600" /> Client Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <InfoItem icon={<User />} label="Full Name" value={caseData.clientName} />
                <InfoItem icon={<Mail />} label="Email Address" value={caseData.clientEmail} />
                <InfoItem icon={<Phone />} label="Phone Number" value={caseData.clientPhone} />
                <InfoItem icon={<MapPin />} label="Mailing Address" value={caseData.clientAddress} />
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 shadow-sm rounded-2xl bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2 font-bold text-slate-800">
                  <Scale className="w-5 h-5 text-blue-600" /> Legal & Financial Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <InfoItem icon={<Briefcase />} label="Legal Category" value={caseData.category} className="capitalize" />
                <InfoItem icon={<AlertCircle />} label="Case Priority" value={caseData.priority} className="capitalize" />
                <InfoItem icon={<Calendar />} label="Incident Date" value={caseData.incidentDate} />
                <InfoItem icon={<Database />} label="Opposing Party" value={caseData.opponentName} />
                <div className="md:col-span-2 pt-4">
                  <div className="bg-slate-900 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg">
                    <div className="space-y-1">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Estimated Claim Amount</p>
                      <h3 className="text-3xl font-bold">₹{Number(caseData.claimAmount).toLocaleString('en-IN')}</h3>
                    </div>
                    <Scale className="text-white/20 w-12 h-12" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <ActivityTimeline caseId={id} refreshKey={activityRefresh} />
          </div>

          <div className="space-y-8 lg:sticky lg:top-24">
            <DocumentManager caseId={id} role={role} />

            {role === "admin" && (
              <Card className="border-blue-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 shadow-sm rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-blue-700 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> Administrative Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-blue-900/60 text-[10px] font-bold uppercase ml-1">Update Case Status</Label>
                    <Select value={caseData.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="bg-white border-blue-200/60 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleGenerateReport} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 shadow-md shadow-blue-100 transition-all font-bold flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> Generate Case Report
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="border-slate-200/60 shadow-sm rounded-2xl bg-white p-6 space-y-4">
              <div className="flex items-center gap-2 text-blue-500">
                <Shield size={16} />
                <span className="text-[11px] font-bold uppercase tracking-widest">Security Verified</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Ref ID:</span>
                <span className="font-mono font-bold">#{id}</span>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoItem({ icon, label, value, className = "" }) {
  return (
    <div className="flex gap-4 items-start group">
      <div className="mt-0.5 p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        {icon && React.cloneElement(icon, { size: 16 })}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <p className={`text-sm font-semibold text-slate-800 ${className}`}>{value || "—"}</p>
      </div>
    </div>
  );
}