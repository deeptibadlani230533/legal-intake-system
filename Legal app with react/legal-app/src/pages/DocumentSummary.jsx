import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";

export default function DocumentSummary() {
  const location = useLocation();
  const { document } = location.state || {};

  const [step, setStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (!document) return;

    const steps = [
      "Analyzing document structure...",
      "Extracting legal entities...",
      "Generating AI summary...",
    ];

    let current = 0;

    const interval = setInterval(() => {
      current++;

      if (current < steps.length) {
        setStep(current);
      } else {
        clearInterval(interval);

        setTimeout(() => {
          setShowSummary(true);
        }, 500);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [document]);

  if (!document) {
    return (
      <div className="p-6 text-center text-slate-500">
        Document not found.
      </div>
    );
  }

  const steps = [
    "Analyzing document structure...",
    "Extracting legal entities...",
    "Generating AI summary...",
  ];

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

      {/* AI Processing Animation */}
      {!showSummary && (
        <Card className="p-6 space-y-4 border-blue-100 bg-blue-50">

          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">
              AI is processing your document
            </span>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            {steps.map((s, index) => (
              <div
                key={index}
                className={`transition-all ${
                  index <= step ? "opacity-100" : "opacity-30"
                }`}
              >
                • {s}
              </div>
            ))}
          </div>

        </Card>
      )}

      {/* Summary */}
      {showSummary && (
        <Card className="p-6 space-y-3">

          <h2 className="font-semibold text-slate-900">
            AI Generated Summary
          </h2>

          {document.summary ? (
            <p className="text-sm text-slate-600 leading-7 whitespace-pre-line">
              {document.summary}
            </p>
          ) : (
            <p className="text-sm text-slate-500">
              No summary available for this document.
            </p>
          )}

        </Card>
      )}
    </div>
  );
}