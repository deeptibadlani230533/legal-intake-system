import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { Download, FileText, Filter, TrendingUp, Briefcase, Activity, CheckCircle2, Loader2 } from "lucide-react";
import Header from "../components/Header.jsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cases`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to load reports.");

        const total = data.length;
        const open = data.filter(c => c.status === "open").length;
        const closed = data.filter(c => c.status === "closed").length;
        const inProgress = data.filter(c => c.status === "in_progress").length;

        setStats({ total, open, closed, inProgress });

        setChartData([
          { name: "Open", value: open, color: "#10b981" },
          { name: "In Progress", value: inProgress, color: "#3b82f6" },
          { name: "Closed", value: closed, color: "#64748b" }
        ]);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCases();
  }, []);

  const handleExportPDF = async () => {

  const input = document.getElementById("reports-container");
  const charts = document.getElementById("charts-section");

  if (!input) return;

  try {

    setIsExporting(true);

    // Hide charts temporarily
    if (charts) charts.style.display = "none";

    // wait for DOM update
    await new Promise(r => setTimeout(r, 300));

    const canvas = await html2canvas(input, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, 210, 15, "F");

    pdf.setTextColor(255,255,255);
    pdf.setFontSize(10);

    pdf.text("LEGALPRO ANALYTICS REPORT", 10, 10);
    pdf.text(`ISSUED: ${new Date().toLocaleDateString()}`, 165, 10);

    pdf.addImage(imgData, "PNG", 0, 20, imgWidth, imgHeight);

    pdf.setFontSize(8);
    pdf.setTextColor(100,116,139);
    pdf.text("Privileged Information: Internal Legal Review Only.", 10, 290);

    pdf.save(`LegalPro_Report_${new Date().toISOString().split("T")[0]}.pdf`);

  }
  catch(err){

    console.error(err);
    alert("PDF generation failed.");

  }
  finally{

    if (charts) charts.style.display = "grid"; // restore charts
    setIsExporting(false);

  }

};

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] min-h-screen">
      <Header title="Analytics & Intelligence">
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={isExporting}
            className="bg-white border-slate-200 shadow-sm hover:bg-slate-50 rounded-xl min-w-[130px]"
            onClick={handleExportPDF}
          >
            {isExporting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin text-blue-600" /> Exporting...</>
            ) : (
              <><Download className="w-4 h-4 mr-2 text-blue-600" /> Export PDF</>
            )}
          </Button>
          <Button size="sm" className="bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md">
            <Filter className="w-4 h-4 mr-2" /> Filter Range
          </Button>
        </div>
      </Header>

      <main id="reports-container" className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-10 py-10 space-y-8">
        {/* HERO SECTION */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white rounded-2xl shadow-2xl p-10 border border-white/10">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <TrendingUp size={240} />
          </div>
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-2">
              <Activity size={12} /> Live Performance Data
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Executive Analytics</h1>
            <p className="text-slate-300 max-w-md text-sm leading-relaxed">Comprehensive overview of firm efficiency and matter success rates.</p>
            <div className="pt-4 flex items-center gap-4 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400"/> Verified Records</span>
              <span>Refreshed {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        {/* METRICS */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SummarySmallCard title="Active Files" value={stats.open + stats.inProgress} subtitle="Requires Attention" icon={<Briefcase className="text-blue-600" />} trend="+12%" />
            <SummarySmallCard title="Matters Closed" value={stats.closed} subtitle="Successfully Resolved" icon={<CheckCircle2 className="text-emerald-600" />} trend="+5%" />
            <SummarySmallCard title="Total Volume" value={stats.total} subtitle="All Time Entries" icon={<FileText className="text-slate-600" />} />
            <SummarySmallCard title="Success Rate" value="94.2%" subtitle="Benchmark KPI" icon={<TrendingUp className="text-indigo-600" />} isHighlighted />
          </div>
        )}

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30">
              <CardTitle className="text-lg font-bold text-slate-800">Monthly Case Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} isAnimationActive={!isExporting} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30">
              <CardTitle className="text-lg font-bold text-slate-800">Status Allocation</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius={75} outerRadius={100} paddingAngle={8} dataKey="value" isAnimationActive={!isExporting}>
                    {chartData.map((entry, index) => <Cell key={index} fill={entry.color} stroke="none" />)}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full space-y-2 mt-4 px-4">
                 {chartData.map((entry, i) => (
                   <div key={i} className="flex items-center justify-between text-xs font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{backgroundColor: entry.color}} />
                        <span className="text-slate-500">{entry.name}</span>
                      </div>
                      <span className="text-slate-700">{entry.value}</span>
                   </div>
                 ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function SummarySmallCard({ title, value, subtitle, icon, trend, isHighlighted }) {
  return (
    <div className={`relative p-6 rounded-2xl border transition-all duration-200 hover:shadow-md ${isHighlighted ? "bg-blue-600 border-blue-500 text-white" : "bg-white border-slate-200 shadow-sm"}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-xl ${isHighlighted ? "bg-white/20" : "bg-slate-50"}`}>{icon}</div>
        {trend && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isHighlighted ? "bg-white/20" : "bg-emerald-50 text-emerald-600"}`}>{trend}</span>}
      </div>
      <div className="space-y-1">
        <p className={`text-[10px] font-bold uppercase tracking-widest ${isHighlighted ? "text-blue-100" : "text-slate-400"}`}>{title}</p>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        <p className={`text-[11px] italic ${isHighlighted ? "text-blue-200" : "text-slate-500"}`}>{subtitle}</p>
      </div>
    </div>
  );
}