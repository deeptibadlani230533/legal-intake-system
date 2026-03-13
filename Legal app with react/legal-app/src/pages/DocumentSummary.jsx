import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

export default function DocumentSummary() {
  const location = useLocation();
  const { document } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(document?.summary || "");

  const token = localStorage.getItem("token");

  if (!document) {
    return (
      <div className="p-6 text-center text-slate-500">
        Document not found.
      </div>
    );
  }

  const generateSummary = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/summarize/${document.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (result.success) {
        setSummary(result.summary);
        toast.success("AI Summary generated successfully");
      } else {
        toast.error(result.message || "Failed to generate summary");
      }
    } catch (err) {
      toast.error("AI service failed.");
    } finally {
      setLoading(false);
    }
  };

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
      <Card className="p-4 space-y-2">
        <div className="text-sm text-slate-500">Document</div>
        <div className="font-semibold text-slate-900">
          {document.originalName}
        </div>
      </Card>

      {/* Generate Button */}
      {!summary && (
        <Button
          onClick={generateSummary}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Summary...
            </>
          ) : (
            "Generate AI Summary"
          )}
        </Button>
      )}

      {/* Loading Indicator */}
      {loading && (
        <Card className="p-6 flex items-center gap-3 bg-blue-50 border-blue-100">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-blue-700 text-sm font-medium">
            AI is analyzing the document...
          </span>
        </Card>
      )}

      {/* Summary Output */}
      {summary && (
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