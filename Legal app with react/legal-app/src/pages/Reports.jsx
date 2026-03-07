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

import { Download, FileText, Filter, TrendingUp } from "lucide-react";
import Header from "../components/Header.jsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Reports() {

  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");

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

  /* ---------------- EXPORT PDF ---------------- */

  const handleExportPDF = async () => {

    const input = document.getElementById("reports-container");

    const canvas = await html2canvas(input, { scale: 2 });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const pageHeight = 295;

    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

    heightLeft -= pageHeight;

    while (heightLeft >= 0) {

      position = heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

      heightLeft -= pageHeight;

    }

    /* FOOTER + PAGE NUMBERS */

    const pageCount = pdf.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {

      pdf.setPage(i);

      pdf.setFontSize(10);

      pdf.text(
        "LegalPro Analytics Report",
        10,
        285
      );

      pdf.text(
        `Page ${i} of ${pageCount}`,
        180,
        285
      );

    }

    pdf.save("legalpro-analytics-report.pdf");

  };

  const COLORS = ["#10b981", "#3b82f6", "#64748b"];

  return (

    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-screen">

      <Header title="Analytics & Reports">

        <div className="flex gap-2">

          <Button
            variant="outline"
            size="sm"
            className="bg-white"
            onClick={handleExportPDF}
          >
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>

          <Button size="sm" className="bg-slate-900">
            <Filter className="w-4 h-4 mr-2" /> Filter Range
          </Button>

        </div>

      </Header>

      <main
        id="reports-container"
        className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-8"
      >

        {/* REPORT HEADER */}

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg p-8 text-center">

          <h1 className="text-3xl font-bold">
            LegalPro Analytics Report
          </h1>

          <p className="text-sm opacity-90 mt-1">
            Performance & Case Metrics Overview
          </p>

          <p className="text-xs opacity-80 mt-2">
            Generated on {new Date().toLocaleDateString()}
          </p>

        </div>

        {error && (
          <div className="p-4 text-red-600 bg-red-50 border border-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* SUMMARY CARDS */}

        {stats && (

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <SummarySmallCard
              title="Active Files"
              value={stats.open + stats.inProgress}
              icon={<TrendingUp className="text-emerald-500" />}
            />

            <SummarySmallCard
              title="Closed to Date"
              value={stats.closed}
              icon={<FileText className="text-slate-400" />}
            />

            <SummarySmallCard
              title="Total Volume"
              value={stats.total}
              icon={<div className="h-2 w-2 rounded-full bg-blue-500" />}
            />

            <SummarySmallCard
              title="Success Rate"
              value="92%"
              icon={<span className="text-xs font-bold text-blue-600">KPI</span>}
            />

          </div>

        )}

        {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <Card className="border-slate-200 shadow-sm">

            <CardHeader>

              <CardTitle>
                Monthly Case Distribution
              </CardTitle>

              <CardDescription>
                Volume of new legal matters opened per category.
              </CardDescription>

            </CardHeader>

            <CardContent className="h-75">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart data={chartData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar dataKey="value" fill="#3b82f6" radius={[6,6,0,0]} />

                </BarChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

          <Card className="border-slate-200 shadow-sm">

            <CardHeader>

              <CardTitle>
                Case Status Allocation
              </CardTitle>

              <CardDescription>
                Real-time percentage breakdown of all firm matters.
              </CardDescription>

            </CardHeader>

            <CardContent className="h-75 flex items-center justify-center">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >

                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

        </div>

      </main>

    </div>

  );

}

function SummarySmallCard({ title, value, icon }) {

  return (

    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start">

      <div>

        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {title}
        </p>

        <p className="text-2xl font-bold mt-1 text-slate-900">
          {value}
        </p>

      </div>

      <div className="p-2 bg-slate-50 rounded-lg">
        {icon}
      </div>

    </div>

  );

}