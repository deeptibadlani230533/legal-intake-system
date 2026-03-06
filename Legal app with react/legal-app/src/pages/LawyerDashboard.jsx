import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Sparkles,
  Lightbulb,
  LayoutDashboard,
  Command,
  Activity,
  ShieldCheck,
  Zap,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import Header from "../components/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LawyerDashboard() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState({ assigned: 0, in_progress: 0, closed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLawyerCases = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lawyer/cases`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        const fetchedCases = Array.isArray(data.cases) ? data.cases : [];
        setCases(fetchedCases);
        setStats({
          assigned: fetchedCases.filter((c) => c.status === "assigned").length,
          in_progress: fetchedCases.filter((c) => c.status === "in_progress").length,
          closed: fetchedCases.filter((c) => c.status === "closed").length,
        });
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyerCases();
  }, []);

  const activeCases = cases.filter((c) => c.status !== "closed");
  const formatStatus = (status) => status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const getStatusStyles = (status) => {
    if (status === "assigned") return "bg-blue-50 text-blue-700 border-blue-100";
    if (status === "in_progress") return "bg-amber-50 text-amber-700 border-amber-100";
    if (status === "closed") return "bg-emerald-50 text-emerald-700 border-emerald-100";
    return "bg-slate-50 text-slate-600 border-slate-100";
  };

  const statConfig = [
    { label: "Assigned", value: stats.assigned, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "In Progress", value: stats.in_progress, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Closed", value: stats.closed, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-indigo-100/40 rounded-full blur-[100px] pointer-events-none" />

      <Header />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-10 z-10"
      >
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full w-fit">
               <Activity className="w-3.5 h-3.5 text-blue-600" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">Practice Overview</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Lawyer Workspace</h1>
            <p className="text-slate-500 font-medium text-lg">Managing {activeCases.length} active legal matters today.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md text-slate-700 px-5 py-2.5 rounded-2xl text-xs font-bold border border-slate-200/60 shadow-xl shadow-slate-200/40">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Security: <span className="text-emerald-600 font-extrabold">Active Vault</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statConfig.map((item) => (
            <Card key={item.label} className="border-slate-200/60 shadow-xl shadow-slate-900/5 bg-white rounded-[32px] overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{item.label}</p>
                <div className="flex items-center justify-between">
                  <span className="text-5xl font-black tracking-tighter text-slate-900">
                    {loading ? "---" : <CountUp end={item.value} duration={1} />}
                  </span>
                  <div className={`p-3 ${item.bg} rounded-2xl`}>
                    <Briefcase className={`w-6 h-6 ${item.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Cases List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">Recent Assignments</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/cases")} className="text-blue-600 font-bold hover:text-blue-700">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {loading ? (
                  [1, 2, 3].map((i) => <div key={i} className="h-20 bg-white border border-slate-100 rounded-2xl animate-pulse" />)
                ) : activeCases.length > 0 ? (
                  activeCases.slice(0, 5).map((c) => (
                    <motion.div
                      key={c.id}
                      whileHover={{ x: 4 }}
                      onClick={() => navigate(`/cases/${c.id}`)}
                      className="group flex items-center justify-between p-5 rounded-[24px] cursor-pointer bg-white border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-200 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <Zap size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">CASE-{c.id.toString().padStart(4, "0")}</span>
                          <span className="text-base font-bold text-slate-900">{c.caseTitle || "Untitled Matter"}</span>
                        </div>
                      </div>
                      <Badge className={`text-[10px] px-3 py-1 font-black uppercase tracking-widest border ${getStatusStyles(c.status)}`}>
                        {formatStatus(c.status)}
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
                    <p className="text-slate-400 text-sm font-medium italic">No active assignments currently in queue.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            <section className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Quick Actions</h4>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate("/cases")}
                  className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-between px-6"
                >
                  <div className="flex items-center gap-3">
                    <Command className="w-4 h-4 text-slate-400" />
                    <span>Manage Portfolio</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-500" />
                </Button>

                <Button variant="outline" className="w-full h-14 border-slate-200 text-slate-700 bg-white rounded-2xl font-bold hover:bg-slate-50 shadow-sm active:scale-95 transition-all flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>Generate AI Summary</span>
                </Button>
              </div>
            </section>

            {/* Practice Insight Card */}
            <Card className="border-blue-100 bg-white/80 backdrop-blur-md rounded-[32px] shadow-xl shadow-blue-900/5">
              <CardContent className="p-8 space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Practice Insight</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mt-2">
                    Updating "In Progress" statuses daily increases client transparency ratings by <span className="text-blue-600 font-bold">40%</span>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.main>
      
      <footer className="w-full text-center py-8 text-slate-400 text-[10px] font-black uppercase tracking-widest mt-auto">
        &copy; 2026 LegalPro Management • Secure Lawyer Terminal
      </footer>
    </div>
  );
}