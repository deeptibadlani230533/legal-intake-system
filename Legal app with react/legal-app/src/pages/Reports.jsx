import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, FileText, Filter, TrendingUp } from "lucide-react";
import Header from "../components/Header.jsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("${import.meta.env.VITE_API_URL}/api/cases", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to load reports.");

        const total = data.length;
        const open = data.filter((c) => c.status === "open").length;
        const closed = data.filter((c) => c.status === "closed").length;
        const inProgress = data.filter((c) => c.status === "in_progress").length;

        setStats({ total, open, closed, inProgress });
        
        // Data for Pie Chart
        setChartData([
          { name: "Open", value: open, color: "#10b981" },
          { name: "In Progress", value: inProgress, color: "#3b82f6" },
          { name: "Closed", value: closed, color: "#64748b" },
        ]);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCases();
  }, []);

  const COLORS = ["#10b981", "#3b82f6", "#64748b"];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-screen">
      <Header title="Analytics & Reports">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-white">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
          <Button size="sm" className="bg-slate-900">
            <Filter className="w-4 h-4 mr-2" /> Filter Range
          </Button>
        </div>
      </Header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-8">
        {error && <div className="p-4 text-red-600 bg-red-50 border border-red-100 rounded-lg">{error}</div>}

        {/* Top Summary Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SummarySmallCard title="Active Files" value={stats.open + stats.inProgress} icon={<TrendingUp className="text-emerald-500" />} />
            <SummarySmallCard title="Closed to Date" value={stats.closed} icon={<FileText className="text-slate-400" />} />
            <SummarySmallCard title="Total Volume" value={stats.total} icon={<div className="h-2 w-2 rounded-full bg-blue-500" />} />
            <SummarySmallCard title="Success Rate" value="92%" icon={<span className="text-xs font-bold text-blue-600">KPI</span>} />
          </div>
        )}

        {/* Visual Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart Card */}
          <Card className="border-slate-200/60 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Case Distribution</CardTitle>
              <CardDescription>Volume of new legal matters opened per category.</CardDescription>
            </CardHeader>
            <CardContent className="h-75 pt-4">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart Card */}
          <Card className="border-slate-200/60 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Case Status Allocation</CardTitle>
              <CardDescription>Real-time percentage breakdown of all firm matters.</CardDescription>
            </CardHeader>
            <CardContent className="h-75 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 pr-8">
                 {chartData.map((item) => (
                   <div key={item.name} className="flex items-center gap-2 text-xs">
                     <div className="h-2 w-2 rounded-full" style={{backgroundColor: item.color}} />
                     <span className="text-slate-500">{item.name}:</span>
                     <span className="font-bold text-slate-900">{item.value}</span>
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

function SummarySmallCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm flex justify-between items-start">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</p>
        <p className="text-2xl font-bold mt-1 text-slate-900">{value}</p>
      </div>
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
    </div>
  );
}