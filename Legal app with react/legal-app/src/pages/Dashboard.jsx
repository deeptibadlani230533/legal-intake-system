import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  Clock, 
  Users, 
  BarChart3, 
  ChevronRight, 
  ShieldCheck,
  Activity,
  Zap
} from "lucide-react";

import Header from "../components/Header";
import StatCard from "../components/StatCard"; 
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setStats(data);
      } catch (err) {
        console.error("Dashboard Stats Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      
      {/* Decorative Background Elements - Matching Login/Signup */}
      <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-indigo-100/40 rounded-full blur-[100px] pointer-events-none" />

      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-10 z-10">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full w-fit">
               <Activity className="w-3.5 h-3.5 text-blue-600" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">Live System Status</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Legal Overview (CI/CD TEST)</h1>
            <p className="text-slate-500 font-medium">Monitoring case distributions and lawyer availability in real-time.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md text-slate-700 px-5 py-2.5 rounded-2xl text-xs font-bold border border-slate-200/60 shadow-xl shadow-slate-200/40">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Firm Security: <span className="text-emerald-600">Encrypted</span>
          </div>
        </div>

        {/* Stats Grid - Using Enhanced Shadowing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-700 delay-100">
          <StatCard
            title="Total Cases"
            value={loading ? "---" : stats?.totalCases}
            icon={Briefcase}
            trend="+5.2%"
            className="shadow-xl shadow-blue-900/5 border-slate-200/60"
          />
          <StatCard
            title="Pending Intake"
            value={loading ? "---" : stats?.pendingIntake}
            icon={Clock}
            trend="+2.1%"
            className="shadow-xl shadow-slate-900/5 border-slate-200/60"
          />
          <StatCard
            title="Active Lawyers"
            value={loading ? "---" : stats?.activeLawyers}
            icon={Users}
            trend="Stable"
            className="shadow-xl shadow-slate-900/5 border-slate-200/60"
          />
        </div>

        {/* Quick Actions & Secondary Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          
          {/* Quick Actions Card - Styled as a "Power Card" */}
          <Card className="lg:col-span-2 border-slate-200/60 shadow-2xl shadow-slate-200/50 bg-white rounded-[32px] overflow-hidden">
            <CardHeader className="bg-slate-50/30 border-b border-slate-100 p-8 pb-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-blue-600 rounded-xl text-white">
                  <Zap size={18} />
                </div>
                <CardTitle className="text-xl font-bold">Administrative Shortcuts</CardTitle>
              </div>
              <CardDescription className="font-medium text-slate-500 ml-11">Execute primary system tasks and view operational metrics.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-6">
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => navigate("/reports")} 
                  className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 rounded-xl shadow-lg shadow-blue-600/20 font-bold transition-all active:scale-95"
                >
                  <BarChart3 className="w-4 h-4 mr-2" /> View Case Reports
                </Button>

                {role === "admin" && (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/team")}
                    className="h-12 px-8 rounded-xl border-slate-200 hover:bg-slate-50 font-bold text-slate-700 transition-all active:scale-95"
                  >
                    <Users className="w-4 h-4 mr-2" /> Manage Personnel
                  </Button>
                )}

                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/cases")}
                  className="h-12 px-6 text-slate-500 hover:text-blue-600 font-bold transition-colors"
                >
                  Open Directory <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Placeholder Card - Styled with Glassmorphism */}
          <Card className="border-slate-200/60 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm rounded-[32px]">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">API Latency</span>
                <span className="font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg">24ms</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">DB Connectivity</span>
                <span className="font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg">100%</span>
              </div>
              <div className="pt-2">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-inner" />
                </div>
                <p className="text-[10px] text-slate-400 mt-3 uppercase font-extrabold tracking-widest text-center">Server Capacity Utilization</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
      
      <footer className="w-full text-center py-6 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        LegalPro Command Center &copy; 2026 • Tier III Security
      </footer>
    </div>
  );
}