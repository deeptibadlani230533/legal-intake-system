import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";

export default function DocumentSummary() {
  const location = useLocation();
  const { document } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (!document) return;

    const viewedKey = `summary_viewed_${document.id}`;
    const alreadyViewed = localStorage.getItem(viewedKey);

    if (!document.summary) {
      setShowSummary(true);
      return;
    }

    if (alreadyViewed) {
      setShowSummary(true);
    } else {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        setShowSummary(true);
        localStorage.setItem(viewedKey, "true");
      }, 3000); // fake AI processing delay
    }
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

      {/* Loading Animation */}
      {loading && (
        <Card className="p-6 flex items-center gap-3 bg-blue-50 border-blue-100">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-blue-700 text-sm font-medium">
            AI is analyzing the document...
          </span>
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