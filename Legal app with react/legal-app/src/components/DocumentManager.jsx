import React, { useState, useEffect } from "react";
import {
  FileText,
  UploadCloud,
  Download,
  File,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* -------------------------------- */
/* File Icon Helper */
/* -------------------------------- */

function getFileIcon(fileType, fileName) {
  const extension = fileName.split(".").pop().toLowerCase();

  if (fileType?.includes("pdf") || extension === "pdf") {
    return <FileText className="w-4 h-4 text-red-600" />;
  }

  if (extension === "doc" || extension === "docx") {
    return <FileText className="w-4 h-4 text-blue-600" />;
  }

  if (extension === "jpg" || extension === "jpeg" || extension === "png") {
    return <File className="w-4 h-4 text-green-600" />;
  }

  return <File className="w-4 h-4 text-slate-500" />;
}

/* -------------------------------- */
/* Component */
/* -------------------------------- */

export default function DocumentManager({ caseId, role }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDocuments();
  }, [caseId]);

  /* -------------------------------- */
  /* Fetch Documents */
  /* -------------------------------- */

  const fetchDocuments = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/documents/case/${caseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const result = await res.json();
      if (result.success) setDocuments(result.data);
    } catch (err) {
      toast.error("Could not load documents.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------- */
  /* Upload */
  /* -------------------------------- */

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("caseId", caseId);
    formData.append("file", file);

    setUploading(true);

    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Document uploaded successfully");
        fetchDocuments();
      } else {
        toast.error(result.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  /* -------------------------------- */
  /* Download */
  /* -------------------------------- */

  const handleDownload = async (docId, fileName) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/documents/${docId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      toast.error("Download failed.");
    }
  };

  /* -------------------------------- */
  /* Delete (Admin Only) */
  /* -------------------------------- */

  const handleDelete = async () => {
  if (!selectedDoc) return;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/documents/${selectedDoc.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    toast.success("Document deleted successfully");

    setConfirmDelete(false);
    setSelectedDoc(null);
    fetchDocuments();
  } catch (err) {
    toast.error("Delete failed.");
  }
};

  /* -------------------------------- */
  /* UI */
  /* -------------------------------- */

  return (
    <>
      <Card className="border-slate-200/60 shadow-sm bg-white overflow-hidden rounded-xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Case Documents</h3>
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <div className="flex items-center gap-2 text-xs font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
              {uploading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <UploadCloud className="w-3 h-3" />
              )}
              {uploading ? "Uploading..." : "Upload File"}
            </div>
          </label>
        </div>

        {/* Document List */}
        <ScrollArea className="h-75">
          <div className="p-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                <p className="text-xs">Accessing vault...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <File className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-xs">No documents attached yet.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-md">
                        {getFileIcon(doc.fileType, doc.originalName)}
                      </div>

                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 truncate max-w-45">
                          {doc.originalName}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                          v{doc.version || 1} •{" "}
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

 {/* Document Details Modal */}
<Dialog open={!!selectedDoc} onOpenChange={() => {
  setSelectedDoc(null);
  setConfirmDelete(false);
}}>
  {selectedDoc && (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {confirmDelete ? "Confirm Deletion" : selectedDoc.originalName}
        </DialogTitle>
      </DialogHeader>

      {!confirmDelete ? (
        /* NORMAL VIEW */
        <div className="space-y-4 text-sm mt-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Version</span>
            <span>v{selectedDoc.version || 1}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Uploaded On</span>
            <span>
              {new Date(selectedDoc.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">File Type</span>
            <span>{selectedDoc.fileType || "Unknown"}</span>
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() =>
              handleDownload(selectedDoc.id, selectedDoc.originalName)
            }
          >
            Download File
          </Button>

          {role === "admin" && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setConfirmDelete(true)}
            >
              Delete Document
            </Button>
          )}
        </div>
      ) : (
        /* CONFIRM DELETE VIEW */
        <div className="space-y-4 text-sm mt-2">
          <p className="text-slate-600">
            Are you sure you want to delete this document?
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  )}
</Dialog>
</>
  );
}
    
  
