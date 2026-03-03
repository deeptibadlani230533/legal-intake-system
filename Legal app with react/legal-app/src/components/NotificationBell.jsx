import React, { useState } from "react";
import { Bell, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  // Mock data for your reviewer
  const notifications = [
    { id: 1, text: "Case #402 status updated to 'In Progress'", time: "5m ago", type: "update" },
    { id: 2, text: "New document: 'Evidence_01.pdf' uploaded", time: "2h ago", type: "file" },
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-white border-slate-200 shadow-sm hover:bg-slate-50 rounded-xl w-10 h-10"
      >
        <Bell className="w-4 h-4 text-slate-600" />
        {/* Notification Badge */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600 border-2 border-white"></span>
        </span>
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-200 shadow-xl rounded-2xl z-40 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">Activity Alerts</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">LegalPro</span>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className="p-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors">
                  <div className="flex gap-3">
                    {n.type === "update" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5" /> : <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5" />}
                    <div>
                      <p className="text-[11px] text-slate-700 font-medium leading-snug">{n.text}</p>
                      <p className="text-[9px] text-slate-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}