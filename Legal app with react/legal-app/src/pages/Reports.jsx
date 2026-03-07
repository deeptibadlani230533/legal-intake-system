import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

import { Download, FileText, Filter, TrendingUp, Briefcase, Activity, CheckCircle2, Loader2 } from "lucide-react";
import Header from "../components/Header.jsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

export default function Reports() {
const [stats, setStats] = useState(null);
const [chartData, setChartData] = useState([]);
const [cases, setCases] = useState([]);
const [filterRange, setFilterRange] = useState("all");
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

      setCases(data);
      processCases(data, filterRange);

    } catch (err) {
      setError(err.message);
    }

  };

  fetchCases();

}, []);

const processCases = (data, range) => {

  let filtered = [...data];

  if (range !== "all") {

    const now = new Date();
    const days = Number(range);

    filtered = data.filter(c => {

      if (!c.createdAt) return true;

      const created = new Date(c.createdAt);
      const diff = (now - created) / (1000 * 60 * 60 * 24);

      return diff <= days;

    });

  }

  const total = filtered.length;
  const open = filtered.filter(c => c.status === "open").length;
  const closed = filtered.filter(c => c.status === "closed").length;
  const inProgress = filtered.filter(c => c.status === "in_progress").length;

  setStats({ total, open, closed, inProgress });

  setChartData([
    { name: "Open", value: open, color: "#10b981" },
    { name: "In Progress", value: inProgress, color: "#3b82f6" },
    { name: "Closed", value: closed, color: "#64748b" }
  ]);

};

const handleFilterChange = (range) => {
  setFilterRange(range);
  processCases(cases, range);
};

  const handleExportPDF = () => {
    if (!stats) return;
    setIsExporting(true);

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // 1. BRANDED HEADER
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, pageWidth, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("LEGALPRO ANALYTICS", 20, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`EXECUTIVE SUMMARY | ISSUED: ${new Date().toLocaleDateString()}`, 20, 30);

    // 2. METRIC BOXES (DRAWN MANUALLY)
    let yPos = 55;
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.text("FIRM PERFORMANCE METRICS", 20, yPos);

    const metrics = [
      { label: "Total Volume", val: stats.total },
      { label: "Active Files", val: stats.open + stats.inProgress },
      { label: "Resolved", val: stats.closed },
      { label: "Success Rate", val: "94.2%" }
    ];

    yPos += 15;
    metrics.forEach((m, i) => {
      const x = 20 + (i * 45);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(x, yPos, 40, 25, 3, 3, "F");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(m.label.toUpperCase(), x + 5, yPos + 8);
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text(String(m.val), x + 5, yPos + 18);
    });

    // 3. MANUAL BAR CHART DRAWING
    yPos += 45;
    doc.setFontSize(14);
    doc.text("CASE DISTRIBUTION BY STATUS", 20, yPos);
    
    yPos += 15;
    const chartHeight = 50;
    const maxValue = Math.max(...chartData.map(d => d.value)) || 10;

    chartData.forEach((d, i) => {
      const barWidth = 30;
      const spacing = 15;
      const x = 30 + (i * (barWidth + spacing));
      const barHeight = (d.value / maxValue) * chartHeight;
      
      // Draw Bar
      doc.setFillColor(d.color);
      doc.rect(x, yPos + (chartHeight - barHeight), barWidth, barHeight, "F");
      
      // Label
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(d.name, x, yPos + chartHeight + 8);
      doc.text(String(d.value), x + (barWidth/2) - 2, yPos + (chartHeight - barHeight) - 3);
    });

    // 4. STATUS ALLOCATION (MANUAL PIE LEGEND)
    yPos += 85;
    doc.setFontSize(14);
    doc.text("PIPELINE ALLOCATION", 20, yPos);
    
    yPos += 10;
    chartData.forEach((d, i) => {
      doc.setFillColor(d.color);
      doc.circle(25, yPos + (i * 10), 2, "F");
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text(`${d.name}: ${d.value} Matters`, 32, yPos + (i * 10) + 1.5);
    });

    // 5. WATERMARK & FOOTER
    doc.setTextColor(230, 230, 230);
    doc.setFontSize(50);
    

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("This document is generated by LegalPro Intelligence Engine. Privileged & Confidential.", 20, 285);
    doc.text(`Page 1 of 1`, pageWidth - 35, 285);

    doc.save(`LegalPro_Full_Report.pdf`);
    setIsExporting(false);
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
            {isExporting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin text-blue-600" /> Generating...</> : <><Download className="w-4 h-4 mr-2 text-blue-600" /> Export PDF</>}
          </Button>
          <select
  className="text-sm border border-slate-300 rounded-xl px-3 py-2"
  value={filterRange}
  onChange={(e) => handleFilterChange(e.target.value)}
>
  <option value="all">All Time</option>
  <option value="7">Last 7 Days</option>
  <option value="30">Last 30 Days</option>
  <option value="90">Last 90 Days</option>
</select>
        </div>
      </Header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-10 py-10 space-y-8">
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
            <p className="text-slate-300 max-w-md text-sm leading-relaxed">Detailed analysis of firm metrics and operational efficiency.</p>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
  Showing data for: 
  <span className="ml-1 text-slate-800 font-semibold">
    {filterRange === "all" && "All Time"}
    {filterRange === "7" && "Last 7 Days"}
    {filterRange === "30" && "Last 30 Days"}
    {filterRange === "90" && "Last 90 Days"}
  </span>
</div>

        {/* METRICS GRID */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SummarySmallCard title="Active Files" value={stats.open + stats.inProgress} subtitle="Under Review" icon={<Briefcase className="text-blue-600" />} />
            <SummarySmallCard title="Closed Matters" value={stats.closed} subtitle="Total Resolved" icon={<CheckCircle2 className="text-emerald-600" />} />
            <SummarySmallCard title="Firm Volume" value={stats.total} subtitle="Total Intake" icon={<FileText className="text-slate-600" />} />
            <SummarySmallCard title="Success Rate" value="94.2%" subtitle="Benchmark KPI" icon={<TrendingUp className="text-white" />} isHighlighted />
          </div>
        )}

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30">
              <CardTitle className="text-lg font-bold text-slate-800">Case Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={45}>
                    {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30">
              <CardTitle className="text-lg font-bold text-slate-800">Status Ratio</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] flex flex-col items-center justify-center">

  <ResponsiveContainer width="100%" height={220}>
    <PieChart>
      <Pie
        data={chartData}
        innerRadius={60}
        outerRadius={80}
        paddingAngle={5}
        dataKey="value"
      >
        {chartData.map((entry, index) => (
          <Cell key={index} fill={entry.color} stroke="none" />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>

  <div className="mt-4 space-y-2 px-6 w-full">
    {chartData.map((d, i) => (
      <div key={i} className="flex justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
          <span className="text-slate-500">{d.name}</span>
        </div>
        <span className="font-bold text-slate-700">{d.value}</span>
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

function SummarySmallCard({ title, value, subtitle, icon, isHighlighted }) {
  return (
    <div className={`p-6 rounded-2xl border transition-all ${isHighlighted ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-200" : "bg-white border-slate-200 shadow-sm"}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-2 rounded-xl ${isHighlighted ? "bg-white/20" : "bg-slate-50"}`}>{icon}</div>
        <p className={`text-[10px] font-bold uppercase tracking-widest ${isHighlighted ? "text-blue-100" : "text-slate-400"}`}>{title}</p>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className={`text-xs mt-1 ${isHighlighted ? "text-blue-200" : "text-slate-500"}`}>{subtitle}</p>
    </div>
  );
}