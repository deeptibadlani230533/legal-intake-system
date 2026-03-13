import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";

export default function DocumentSummary() {
  const location = useLocation();
  const { document } = location.state || {};

  const [step, setStep] = useState(0);
  const [summary, setSummary] = useState(document?.summary || null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const steps = [
    "Analyzing document structure...",
    "Extracting legal entities...",
    "Generating AI summary...",
    "Waiting for AI response...",
  ];

  useEffect(() => {
    if (!document) return;

    /* Step animation */
    const stepInterval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 1500);

    /* Poll backend every 2 seconds */
    const poll = setInterval(async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/documents/${document.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const result = await res.json();

        if (result?.data?.summary) {
          setSummary(result.data.summary);
          setLoading(false);
          clearInterval(poll);
          clearInterval(stepInterval);
        }
      } catch (err) {
        console.error("Polling failed");
      }
    }, 2000);

    return () => {
      clearInterval(poll);
      clearInterval(stepInterval);
    };
  }, [document]);

  if (!document) {
    return (
      <div className="p-6 text-center text-slate-500">
        Document not found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-blue-600" />
        <h1 className="text-xl font-bold text-slate-900">
          AI Document Summary
        </h1>
      </div>

      {/* Document Info */}
      <Card className="p-4">
        <div className="text-sm text-slate-500">Document</div>
        <div className="font-semibold text-slate-900">
          {document.originalName}
        </div>
      </Card>

      {/* Loading */}
      {loading && (
        <Card className="p-6 space-y-4 border-blue-100 bg-blue-50">

          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">
              AI is processing your document
            </span>
          </div>

          <div className="text-sm text-slate-600">
            • {steps[step]}
          </div>

        </Card>
      )}

      {/* Summary */}
      {!loading && summary && (
        <Card className="p-6 space-y-3">

          <h2 className="font-semibold text-slate-900">
            AI Generated Summary
          </h2>

          <p className="text-sm text-slate-600 leading-7 whitespace-pre-line">
            {summary}
          </p>

        </Card>
      )}

    </div>
  );
}